// src/components/speakings/prompts/SpeakingsPrompts.tsx
// =========================================================================
// HIGH-VOLUME EXAM PROMPT MENU EXPLORER MATRIX (MODAL ALIGNED)
// =========================================================================
import React, { useState, useEffect } from 'react';
import { useGetExamPromptsListQuery, ExamPromptNode } from '../../../features/prompts/promptsApiSlice';
import { useGetUserSubmissionsListQuery } from '../../../features/submissions/submissionsApiSlice';
import { CheckCircle2, Circle, ArrowRight, HelpCircle, FileText } from 'lucide-react';
import { FaRegCommentDots, FaRegFlag } from 'react-icons/fa';
import LoadingView from '../../layout/loadingScreen/LoadingScreen';
import { CommentSection } from '../../comments/CommentSection';
import './speakingPrompts.css';

interface SpeakingPromptsProps {
  onSelectPrompt: (prompt: ExamPromptNode) => void;
}

export const SpeakingPrompts: React.FC<SpeakingPromptsProps> = ({ onSelectPrompt }) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [previewPrompt, setPreviewPrompt] = useState<ExamPromptNode | null>(null);

  // Symmetrical state variables matching your Writing Magnification Portal logic
  const [showModalComments, setShowModalComments] = useState<boolean>(false);
  const [isFlaggingPrompt, setIsFlaggingPrompt] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<string>('');

  const { data: prompts, isLoading: promptsLoading, isError } = useGetExamPromptsListQuery({ type: 'speaking' });
  const { data: history, isLoading: historyLoading } = useGetUserSubmissionsListQuery();

  // Automatically flush toggle states whenever a different prompt mounts
  useEffect(() => {
    setShowModalComments(false);
    setIsFlaggingPrompt(false);
    setFlagReason('');
  }, [previewPrompt?.id]);

  if (promptsLoading || historyLoading) return <LoadingView />;
  if (isError || !prompts) {
    return <div className="stats_loading_container"><h2>Failed to connect to speaking database.</h2></div>;
  }

  const filteredPrompts = prompts.filter(p => selectedLevel === 'ALL' || p.level === selectedLevel);

  const isTaskCompletedByStudent = (title: string): boolean => {
    if (!history) return false;
    return history.some(sub => sub.prompt_title === title && sub.status !== 'draft');
  };

  return (
    <div className="writings_explorer_master_wrapper" style={{ paddingTop: '0' }}>
      
      {/* LEVEL SELECTOR TOOLBAR */}
      <div className="explorer_filter_toolbar_container" style={{ justifyContent: 'flex-end' }}>
        <div className="explorer_level_select_box_wrapper">
          <label htmlFor="level-filter" className="filter_select_label">Level:</label>
          <select
            id="level-filter"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="explorer_native_select_dropdown"
          >
            <option value="ALL">All Levels</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </select>
        </div>
      </div>

      {/* COMPACT PHOTOGRAPHIC CARDS GRID */}
      <div className="explorer_prompts_cards_grid">
        {filteredPrompts.map((prompt) => {
          const isDone = isTaskCompletedByStudent(prompt.title);

          return (
            <div 
              key={prompt.id} 
              className="prompt_menu_selection_card speaking_prompt_menu_card" 
              onClick={() => setPreviewPrompt(prompt)}
            >
              <div className="prompt_card_top_row">
                <span className="prompt_card_level_tag" style={{ background: '#fae8ff', color: '#6b21a8' }}>{prompt.level}</span>
                <span className="prompt_card_type_badge" style={{ background: '#fef3c7', color: '#92400e' }}>SPEAKING</span>
              </div>
              
              <h3 className="prompt_card_main_title">{prompt.title}</h3>
              <p className="prompt_card_topic_meta_text" style={{ color: '#d97706' }}>#{prompt.topic}</p>
              
              <div className="prompt_card_footer_stats_row">
                <div className={`card_meta_attempts_count ${isDone ? 'task_status_done' : 'task_status_pending'}`}>
                  {isDone ? <CheckCircle2 size={14} style={{ color: '#16a34a' }} /> : <Circle size={14} style={{ color: '#94a3b8' }} />}
                  <span style={{ color: isDone ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>{isDone ? 'Done' : 'Not Done'}</span>
                </div>
                
                <span 
                  className="card_action_prompt_preview_link text_action_start_link" 
                  style={{ color: '#d97706' }}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onSelectPrompt(prompt);
                  }}
                >
                  Start Task <ArrowRight size={12} style={{ display: 'inline', marginLeft: '2px' }} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {previewPrompt && (
        <div className="stats_zoom_modal_backdrop_blur" onClick={() => setPreviewPrompt(null)}>
          <div 
            className="stats_zoom_modal_content_container_card writing_preview_expanded_modal_card" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '720px', width: '90%', height: 'auto', maxHeight: 'none', display: 'flex', flexDirection: 'column' }}
          >
            
            {/* Modal Header Toolbar Ribbon Row */}
            <div className="stats_zoom_modal_top_bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="prompt_badge_tier" style={{ background: '#fae8ff', color: '#6b21a8' }}>{previewPrompt.level}</span>
                <span className="prompt_card_type_badge" style={{ background: '#fef3c7', color: '#92400e', margin: 0 }}>SPEAKING EXAM</span>
              </div>
              
              {/* Symmetrical Action Ribbon Control Track */}
              <div className="puzzle_action_utility_strip" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: 'auto', marginRight: '16px' }}>
                <button 
                  type="button" 
                  className={`utility_strip_btn comment_active_btn ${showModalComments ? 'comments_open_blue' : ''}`}
                  onClick={() => setShowModalComments(!showModalComments)}
                  title="Toggle Brainstorming Comments"
                >
                  <span className="comment_count_badge">0</span>
                  <FaRegCommentDots />
                </button>

                <button 
                  type="button" 
                  className={`utility_strip_btn danger_hover ${isFlaggingPrompt ? 'flag_active_red' : ''}`}
                  onClick={() => setIsFlaggingPrompt(!isFlaggingPrompt)}
                  title="Report Prompt Bug"
                >
                  <FaRegFlag />
                </button>
              </div>

              <button type="button" className="stats_zoom_modal_close_btn" onClick={() => setPreviewPrompt(null)}>&times;</button>
            </div>

            {/* Core Modal Body Viewport */}
            <div className="preview_modal_scrollable_body_viewport" style={{ flex: 1, marginTop: '10px' }}>
              
              {/* Fixed Task Specifications Section */}
              <div className="preview_modal_task_spec_section">
                <h2 className="preview_modal_task_heading_title" style={{ marginTop: '5px', fontSize: '1.25rem' }}>{previewPrompt.title}</h2>
                
                {/* Magnified Image Context Box */}
                <div className="speakings_workspace_photo_frame" style={{ height: '280px', marginBottom: '14px' }}>
                  {previewPrompt.photo_url ? (
                    <img 
                      src={previewPrompt.photo_url.startsWith('http') ? previewPrompt.photo_url : `http://127.0.0.1:3000${previewPrompt.photo_url}`} 
                      alt="Enlarged exam asset scenario description" 
                    />
                  ) : (
                    <div className="p-4 text-muted small">Photographic assignment directive reference</div>
                  )}
                </div>

                {/* Central enlarged question segment */}
                <p style={{ fontStyle: 'italic', color: '#2563eb', fontWeight: 700, fontSize: '1.15rem', textAlign: 'center', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '0 0 14px 0' }}>
                  "{previewPrompt.question}"
                </p>
                
                {/* Metadata topic badge row */}
                <div className="preview_modal_requirements_row_strip" style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', gap: '14px' }}>
                  <span style={{ color: '#d97706', padding: '4px 0' }}>#{previewPrompt.topic}</span>
                </div>
                
                {/* Gateway Action Trigger Button */}
                <button 
                  type="button" 
                  className="next_button" 
                  style={{ margin: '10px 0 16px 0', padding: '12px', background: '#d97706', borderColor: '#d97706' }} 
                  onClick={() => { 
                    onSelectPrompt(previewPrompt); 
                    setPreviewPrompt(null); 
                  }}
                >
                  <FileText size={16} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
                  Start
                </button>
              </div>

              {/* Conditional Typo Reporting Box */}
              {isFlaggingPrompt && (
                <div className="text_input_wrapper comment_container animate_fade_in" style={{ padding: '14px', background: '#f8fafc', margin: '12px 0', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 8px 0', fontWeight: 'bold' }}>Report Prompt Typo or Bug:</p>
                  <div className="form_row" style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={flagReason}
                      onChange={(e) => setFlagReason(e.target.value)}
                      className="puzzle_input"
                      placeholder="Describe the issue..."
                      autoFocus
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.9rem' }}
                    />
                    <button type="button" className="comment_button" style={{ padding: '8px 16px' }} onClick={() => { alert("Report logged."); setIsFlaggingPrompt(false); setFlagReason(''); }}>Flag</button>
                  </div>
                </div>
              )}

              {/* Conditional Full-Width Polymorphic Forum Panel */}
              {showModalComments && (
                <div className="preview_modal_discussions_forum_divider_section animate_fade_in" style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '16px', marginTop: '16px', width: '100%', boxSizing: 'border-box' }}>
                  <div className="modal_comments_wrapper_full_width" style={{ width: '100%' }}>
                    <CommentSection commentableId={previewPrompt.id} commentableType="Prompt" rootComments={[]} />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}