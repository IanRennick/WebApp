// src/components/writings/submission/WritingSubmission.tsx
// =========================================================================
// PREMIUM LONG-FORM COMPOSITION PANEL CANVAS (STAGE 3 ICON CONTROLS ARCHITECTURE)
// =========================================================================
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, LayoutGrid } from 'lucide-react'; // ✅ Imported LayoutGrid
import useLocalStorage from '../../../hooks/localStorage/useLocalStorage';
import { useCreateNewSubmissionMutation } from '../../../features/submissions/submissionsApiSlice';
import { ExamPromptNode } from '../../../features/prompts/promptsApiSlice';
import './writingSubmission.css';

interface WritingSubmissionProps {
  prompt: ExamPromptNode;
  onLeaveWorkspace: () => void; // ✅ Added close callback reference pointer link
}

export const WritingSubmission: React.FC<WritingSubmissionProps> = ({ prompt, onLeaveWorkspace }) => {
  const [essayText, setEssayText] = useLocalStorage<string>(`essay_draft_prompt_${prompt.id}`, '');
  const [showPromptPane, setShowPromptPane] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'typing'>('saved');

  const [createNewSubmission, { isLoading: isSubmitting }] = useCreateNewSubmissionMutation();

  const getWordCount = (text: string): number => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const currentWordCount = getWordCount(essayText);

  const extractWordRange = (rangeString: string) => {
    const matches = rangeString.match(/(\d+)-(\d+)/);
    if (matches) {
      return { min: parseInt(matches[10], 10), max: parseInt(matches[10], 10) };
    }
    return { min: 140, max: 260 };
  };

  const wordBounds = extractWordRange(prompt.word_count);
  const isSubmitDisabled = currentWordCount < wordBounds.min || currentWordCount > wordBounds.max || isSubmitting;

  useEffect(() => {
    if (!essayText.trim()) return;
    setSaveStatus('typing');
    const timer = setTimeout(() => { setSaveStatus('saved'); }, 1200);
    return () => clearTimeout(timer);
  }, [essayText]);

  const handleFinalEssaySubmission = async () => {
    if (isSubmitDisabled) return;
    try {
      await createNewSubmission({
        prompt_id: prompt.id,
        student_payload: essayText,
        status: 'submitted'
      }).unwrap();
      alert("🎉 Essay submitted successfully for administrator evaluation!");
      setEssayText('');
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    }
  };

  let wordCountColorClass = 'count_normal';
  if (currentWordCount > 0 && currentWordCount < wordBounds.min) wordCountColorClass = 'count_under_warning';
  if (currentWordCount > wordBounds.max) wordCountColorClass = 'count_overflow_danger';

  return (
    <div className="essay_workspace_grid_container" style={{ marginTop: '10px' }}>
      
      {/* 🧭 LEFT SIDEBAR INSTRUCTIONS VIEW */}
      <div className={`essay_workspace_prompt_sidebar ${showPromptPane ? 'panel_open' : 'panel_hidden'}`}>
        <div className="prompt_sidebar_inner_content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span className="prompt_badge_tier">{prompt.level} • {prompt.assignment_type.toUpperCase()}</span>
            <button 
              type="button" 
              className="toolbar_utility_icon_only_btn"
              onClick={() => setShowPromptPane(false)}
              title="Hide guidelines panel"
            >
              <EyeOff size={16} />
            </button>
          </div>

          <h2 className="prompt_sidebar_heading">{prompt.title}</h2>
          <div className="prompt_scrollable_criteria_wrapper">
            <p className="prompt_situation_paragraph">{prompt.situation}</p>
            <h5 className="prompt_section_sub_title">Required Focus Points:</h5>
            <ul className="prompt_bullet_points_list">
              {prompt.bullet_points.map((pt, idx) => <li key={idx}>{pt}</li>)}
            </ul>
            <h5 className="prompt_section_sub_title">Instructions Matrix:</h5>
            <ul className="prompt_bullet_points_list directive_list">
              {prompt.instructions.map((inst, idx) => <li key={idx}>{inst}</li>)}
            </ul>
          </div>
          <div className="prompt_sidebar_footer_bounds"><strong>{prompt.word_count}</strong></div>
        </div>
      </div>

      {/* 🖥️ RIGHT PLAIN-TEXT COMPOSITION FIELD CORE */}
      <div className="essay_workspace_editor_column">
        <div className="editor_workspace_top_toolbar_strip">
          
          {/* ✅ FIXED CONTROL RIBBON HUB: LayoutGrid and Eye actions sit combined side-by-side perfectly! */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* The structural exit component grid button icon */}
            <button
              type="button"
              className="toolbar_utility_icon_only_btn open_pane_trigger_btn"
              onClick={onLeaveWorkspace}
              title="Return to available prompts list catalog"
            >
              <LayoutGrid size={16} />
            </button>

            {!showPromptPane && (
              <button 
                type="button" 
                className="toolbar_utility_icon_only_btn open_pane_trigger_btn" 
                onClick={() => setShowPromptPane(true)}
                title="Show prompt guidelines panel"
              >
                <Eye size={16} />
              </button>
            )}
          </div>

          <div className="editor_autosave_status_badge">
            {saveStatus === 'typing' ? (
              <span className="save_indicator text_saving_pulse">Saving changes...</span>
            ) : (
              <span className="save_indicator text_saved_solid">✓ All changes saved</span>
            )}
          </div>
        </div>

        <textarea
          className="essay_workspace_textarea_field"
          placeholder="Type your formal Cambridge essay here... Press Enter to organize paragraphs and line breaks."
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          disabled={isSubmitting}
          autoFocus
        />

        <div className="editor_workspace_bottom_footer_actions_row">
          <div className={`editor_live_word_counter_badge ${wordCountColorClass}`}>
            Words: <strong>{currentWordCount}</strong> <span className="bounds_target_span_text">({prompt.word_count})</span>
          </div>
          
          <div className="editor_footer_action_buttons_group">
            <button 
              type="button" 
              className="editor_footer_btn btn_primary_blue" 
              onClick={handleFinalEssaySubmission} 
              disabled={isSubmitDisabled}
            >
              <CheckCircle size={16} /> Submit Essay
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};