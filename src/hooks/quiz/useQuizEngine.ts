// src/hooks/quiz/useQuizEngine.ts
// =========================================================================
// STATELESS NAVIGATION URL INTERPRETER, ANTI-CHEAT & SUBMISSION ENG HOOK
// =========================================================================
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetRandomQuestionQuery, useSubmitAnswerMutation, SubmissionResult } from '../../features/questions/questionApiSlice';

export const useQuizEngine = () => {
  const [searchParams] = useSearchParams();

  // Extract parameters, safely applying defaults if attributes are blank
  const mode = searchParams.get('mode') || 'random';
  const kind = searchParams.get('kind') || '';
  const level = searchParams.get('level') || '';
  const tag = searchParams.get('tag') || '';

  // 1. UNIQUE PATH IDENTIFIER (ANTI-CHEAT SYSTEM)
  const currentPathSignature = `${mode}_${kind}_${level}_${tag}`;
  const storageKey = `current_puzzle_id_${currentPathSignature}`;

  const getFreshCachedId = (): number | null => {
    const value = localStorage.getItem(storageKey);
    return value ? parseInt(value, 10) : null;
  };

  const [activeFetchId, setActiveFetchId] = useState<number | null>(() => getFreshCachedId());

  // ✅ NEW: Interactive UI States for the answering loop cycle
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [resultData, setResultData] = useState<SubmissionResult | null>(null);

  // Automatically update active fetch ID target whenever browser URL path adjusts
  useEffect(() => {
    setActiveFetchId(getLocalValueId());
    function getLocalValueId() {
      const value = localStorage.getItem(storageKey);
      return value ? parseInt(value, 10) : null;
    }
    // ✅ Reset user inputs cleanly when changing puzzle tracks via layout clicks
    setUserAnswer('');
    setIsAnswered(false);
    setResultData(null);
  }, [storageKey]);

  // Fire the network query loader, feeding it our crisp, atomic fetch ID
  const {
    data: puzzle,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useGetRandomQuestionQuery({ mode, kind, level, tag, id: activeFetchId });

  // Connect our brand-new mutation dispatch controller hook
  const [submitAnswerApi, { isLoading: isSubmitting }] = useSubmitAnswerMutation();

  // Anti-Cheat Lock Monitor
  useEffect(() => {
    if (puzzle && puzzle.id && !isFetching) {
      const currentDiskValue = localStorage.getItem(storageKey);
      if (!currentDiskValue) {
        localStorage.setItem(storageKey, puzzle.id.toString());
        setActiveFetchId(puzzle.id);
      }
    }
  }, [puzzle, isFetching, storageKey]);

  // ✅ NEW: Submits user answers down to your Rails transaction block
  const handleAnswerSubmit = async () => {
    if (!puzzle || !userAnswer.trim() || isAnswered) return;

    try {
      // Execute the POST request through your RTK mutation slice
      const response = await submitAnswerApi({
        id: puzzle.id,
        answer: userAnswer.trim(),
        mode: mode
      }).unwrap();

      // Capture and lock your backend evaluator calculations into local memory states
      setResultData(response);
      setIsAnswered(true);
    } catch (err) {
      console.error("Failed to submit student answer packet:", err);
    }
  };

  // NEXT PUZZLE HANDLER CORE ACTION
  const fetchNextQuestion = async () => {
    console.log(`[CACHE PURGE] Wiping atomic disk lock for key: ${storageKey}`);
    localStorage.removeItem(storageKey); // Physically purge anti-cheat row from disk
    setActiveFetchId(null);              // Drop memory hook indicator
    
    // Clean up our answering state cells for the upcoming fresh question
    setUserAnswer('');
    setIsAnswered(false);
    setResultData(null);

    await refetch();                     // Fire network call to draw fresh data
  };

  return {
    puzzle,
    mode,
    kind,
    isLoading,
    isError,
    error,
    // Exporting our brand-new interactive states and method handles
    userAnswer,
    setUserAnswer,
    isAnswered,
    isSubmitting,
    resultData,
    handleAnswerSubmit,
    fetchNextQuestion,
  };
};