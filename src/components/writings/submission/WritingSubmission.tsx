// src/components/writings/submission/WritingSubmission.tsx
// =========================================================================
// POLISHED MODULAR TEXT COMPOSITION WORKSPACE CANVAS VIEW
// =========================================================================
import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, LayoutGrid } from 'lucide-react';
import { ExamPromptNode } from '../../../features/prompts/promptsApiSlice';
import { useSubmissionEngine } from '../../../hooks/submissions/useSubmissionEngine'; // ✅ IMPORT HOOK
import './writingSubmission.css';

interface WritingSubmissionProps {
  prompt: ExamPromptNode;
  onLeaveWorkspace: () => void;
}

export const WritingSubmission: React.FC<WritingSubmissionProps> = ({ prompt, onLeaveWorkspace }) => {
  const [showPromptPane, setShowPromptPane] = useState<boolean>(true);

  // ✅ HOOK INJECTION: Extract clean ready-to-use attributes in a single line
  const {
    essayText,
    setEssayText,
    saveStatus,
    currentWordCount,
    isSubmitDisabled,
    isSubmitting,
    handleFinalEssaySubmission
  } = useSubmissionEngine(prompt, onLeaveWorkspace);

  return (
    <div className="essay_workspace_grid_container" style={{ marginTop: '10px' }}>
      
      {/* 🧭 LEFT SIDEBAR: PROMPT DIRECTIONS PANELS */}
      <div className={`essay_workspace_prompt_sidebar ${showPromptPane ? 'panel_open' : 'panel_hidden'}`}>
        <div className="prompt_sidebar_inner_content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span className="prompt_badge_tier">{prompt.level} • {prompt.assignment_type.toUpperCase()}</span>
            <button type="button" className="toolbar_utility_icon_only_btn" onClick={() => setShowPromptPane(false)} title="Hide guidelines panel">
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

      {/* 🖥️ RIGHT SIDEBAR: LONGFORM PARSING EDITING FIELD TEXTAREA */}
      <div className="essay_workspace_editor_column">
        <div className="editor_workspace_top_toolbar_strip">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button type="button" className="toolbar_utility_icon_only_btn open_pane_trigger_btn" onClick={onLeaveWorkspace} title="Return to available prompts list catalog">
              <LayoutGrid size={16} />
            </button>
            {!showPromptPane && (
              <button type="button" className="toolbar_utility_icon_only_btn open_pane_trigger_btn" onClick={() => setShowPromptPane(true)} title="Show guidelines panel">
                <Eye size={16} />
              </button>
            )}
          </div>

          {/* Symmetrical cloud sync state badges */}
          <div className="editor_autosave_status_badge">
            {saveStatus === 'typing' && <span className="save_indicator text_white_50" style={{ color: '#94a3b8' }}>Typing essay...</span>}
            {saveStatus === 'syncing' && <span className="save_indicator text_saving_pulse">Syncing with cloud database...</span>}
            {saveStatus === 'saved' && <span className="save_indicator text_saved_solid">✓ All changes saved to server</span>}
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
          <div className={`editor_live_word_counter_badge ${currentWordCount === 0 ? 'count_normal' : (isSubmitDisabled ? 'count_under_warning' : 'count_normal')}`}>
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