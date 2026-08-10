// src/hooks/writings/useSubmissionEngine.ts
// =========================================================================
// STATELESS WORKSPACE SYNCHRONIZATION & DEBOUNCED AUTOSAVE ENGINE HOOK
// =========================================================================
import { useState, useEffect } from 'react';
import useLocalStorage from '../localStorage/useLocalStorage';
import { ExamPromptNode } from '../../features/prompts/promptsApiSlice';
import { 
  useCreateNewSubmissionMutation, 
  useUpdateExistingSubmissionMutation,
  useGetUserSubmissionsListQuery
} from '../../features/submissions/submissionsApiSlice';

export const useSubmissionEngine = (prompt: ExamPromptNode, onLeaveWorkspace: () => void) => {
  // 🛡️ TIER 1: Initialize local storage cache cell natively
  const [essayText, setEssayText] = useLocalStorage<string>(`essay_draft_prompt_${prompt.id}`, '');
  const [activeSubmissionId, setActiveSubmissionId] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'typing' | 'syncing'>('saved');

  const { data: history, isSuccess: isHistoryLoaded } = useGetUserSubmissionsListQuery();
  
  const [createNewSubmission] = useCreateNewSubmissionMutation();
  const [updateExistingSubmission] = useUpdateExistingSubmissionMutation();
  const [submitFinalEssay, { isLoading: isSubmitting }] = useCreateNewSubmissionMutation();

  // --- 1. LOCAL-FIRST MOUNT HYDRATION PASS ---
  useEffect(() => {
    if (!isHistoryLoaded || !history) return;

    const backendDraft = history.find(sub => sub.prompt_id === prompt.id && sub.status === 'draft');
    
    if (backendDraft) {
      setActiveSubmissionId(backendDraft.id);
      
      // 🛡️ TIER 2 FALLBACK: Hydrate from database if local storage cell is blank
      if (!essayText.trim() && backendDraft.student_payload) {
        setEssayText(backendDraft.student_payload);
      }
    }
  }, [isHistoryLoaded, history, prompt.id]);

  // --- 2. REGEX WORD COUNT CALCULATOR ---
  const getWordCount = (text: string): number => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const currentWordCount = getWordCount(essayText);

  const extractWordRange = (rangeString: string) => {
    const matches = rangeString.match(/(\d+)-(\d+)/);
    if (matches && matches[1] && matches[2]) {
      return { min: parseInt(matches[1], 10), max: parseInt(matches[2], 10) };
    }
    return { min: 140, max: 260 };
  };

  const wordBounds = extractWordRange(prompt.word_count);
  const isSubmitDisabled = currentWordCount < wordBounds.min || currentWordCount > wordBounds.max || isSubmitting;

  // --- 3. THE AUTOMATED DEBOUNCED BACKEND AUTOSAVE LOOP ---
  useEffect(() => {
    if (!essayText.trim()) return;

    setSaveStatus('typing');

    const triggerBackendAutosave = async () => {
      setSaveStatus('syncing');
      try {
        if (activeSubmissionId === null) {
          const response = await createNewSubmission({
            prompt_id: prompt.id,
            student_payload: essayText,
            status: 'draft'
          }).unwrap();
          
          if (response && response.id) {
            setActiveSubmissionId(response.id);
          }
        } else {
          await updateExistingSubmission({
            id: activeSubmissionId,
            student_payload: essayText,
            status: 'draft'
          }).unwrap();
        }
        setSaveStatus('saved');
      } catch (err) {
        console.error("Autosave sync failed:", err);
        setSaveStatus('typing');
      }
    };

    const debounceTimer = setTimeout(triggerBackendAutosave, 1500);
    return () => clearTimeout(debounceTimer);
  }, [essayText, prompt.id, createNewSubmission, updateExistingSubmission]);

  // --- 4. EXPLICIT FINAL ESSAY SUBMISSION ---
  const handleFinalEssaySubmission = async () => {
    if (isSubmitDisabled) return;
    try {
      await submitFinalEssay({
        prompt_id: prompt.id,
        student_payload: essayText,
        status: 'submitted'
      }).unwrap();

      alert("🎉 Essay submitted successfully for administrator evaluation!");
      localStorage.removeItem(`essay_draft_prompt_${prompt.id}`);
      setEssayText('');
      setActiveSubmissionId(null);
      onLeaveWorkspace();
    } catch (err) {
      console.error(err);
      alert("Submission processing failed. Please check your connection fields.");
    }
  };

  return {
    essayText,
    setEssayText,
    saveStatus,
    currentWordCount,
    wordBounds,
    isSubmitDisabled,
    isSubmitting,
    handleFinalEssaySubmission
  };
};