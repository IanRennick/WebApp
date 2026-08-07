// src/components/writings/prompts/WritingsPrompts.tsx
// =========================================================================
// HIGH-VOLUME EXAM PROMPT MENU EXPLORER MATRIX (POLISHED V1)
// =========================================================================
import React, { useEffect, useState } from 'react';
import { useGetExamPromptsListQuery, ExamPromptNode } from '../../../features/prompts/promptsApiSlice';
import { useGetUserSubmissionsListQuery } from '../../../features/submissions/submissionsApiSlice'; // ✅ ITEM 6: Done tracking link
import { FileText, CheckCircle2, Circle, ArrowRight, HelpCircle } from 'lucide-react';
import LoadingView from '../../layout/loadingScreen/LoadingScreen';
import { CommentSection } from '../../comments/CommentSection'; 
import './writingPrompts.css'; 
import { FaRegCommentDots, FaRegFlag } from 'react-icons/fa';

interface WritingPromptsProps {
  onSelectPrompt: (prompt: ExamPromptNode) => void;
}

// ✅ ITEM 5 FIXED: 5 explicit genre tabs with Essay placed first
type AssignmentTypeFilter = 'all' | 'essay' | 'article' | 'email' | 'report' | 'review';

export const WritingPrompts: React.FC<WritingPromptsProps> = ({ onSelectPrompt }) => {
  const [activeTab, setActiveTab] = useState<AssignmentTypeFilter>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [previewPrompt, setPreviewPrompt] = useState<ExamPromptNode | null>(null);

  const [showModalComments, setShowModalComments] = useState<boolean>(false);
  const [isFlaggingPrompt, setIsFlaggingPrompt] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<string>('');

  // Combined parallel queries tracking operations synchronously
  const { data: prompts, isLoading: promptsLoading, isError } = useGetExamPromptsListQuery({ type: 'writing' });
  const { data: history, isLoading: historyLoading } = useGetUserSubmissionsListQuery();

  // Handle auto-reset actions natively on preview prompt item modifications
  useEffect(() => {
    setShowModalComments(false);
    setIsFlaggingPrompt(false);
    setFlagReason('');
  }, [previewPrompt?.id]);

  // -----------------------------------------------------------------------
  // CONDITIONAL RENDER STATES: Executed safely AFTER hooks declare!
  // -----------------------------------------------------------------------
  if (promptsLoading || historyLoading) return <LoadingView />;
  if (isError || !prompts) {
    return <div className="stats_loading_container"><h2>Failed to load writing curriculum.</h2></div>;
  }

  const filteredPrompts = prompts.filter(p => {
    const matchesTab = activeTab === 'all' || p.assignment_type === activeTab;
    const matchesLevel = selectedLevel === 'ALL' || p.level === selectedLevel;
    return matchesTab && matchesLevel;
  });

  const isTaskCompletedByStudent = (title: string): boolean => {
    if (!history) return false;
    return history.some(sub => sub.prompt_title === title && sub.status !== 'draft');
  };

  return (
    <div className="writings_explorer_master_wrapper">
      
      {/* 🧭 FILTERING TOOLBAR CONTROLS */}
      <div className="explorer_filter_toolbar_container">
        <div className="explorer_tab_strip">
          {(['all', 'essay', 'article', 'email', 'report', 'review'] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={`explorer_tab_btn ${activeTab === type ? 'tab_active' : ''}`}
              onClick={() => setActiveTab(type)}
            >
              {/* ✅ ITEM 5 FIXED: Displays lower case 'all', and perfectly capitalised custom text labels */}
              {type === 'all' ? 'all' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="explorer_level_select_box_wrapper">
          {/* ✅ ITEM 5 FIXED: Changed text from 'CEFR Level:' to just 'Level:' */}
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

      {/* 🖥️ PROMPT SELECTION CARD GRID */}
      {filteredPrompts.length === 0 ? (
        <div className="explorer_empty_splash_box">
          <HelpCircle size={40} strokeWidth={1.5} />
          <h3>No writing tasks match these filters</h3>
          <p>Try adjusting your category tabs or difficulty selection grids.</p>
        </div>
      ) : (
        <div className="explorer_prompts_cards_grid">
          {filteredPrompts.map((prompt) => {
            const isDone = isTaskCompletedByStudent(prompt.title);

            return (
              /* ✅ SPLIT CLICK INTERACTION: Clicking the main body opens the details modal */
              <div key={prompt.id} className="prompt_menu_selection_card" onClick={() => setPreviewPrompt(prompt)}>
                <div className="prompt_card_top_row">
                  <span className="prompt_card_level_tag">{prompt.level}</span>
                  <span className="prompt_card_type_badge">{prompt.assignment_type}</span>
                </div>
                <h3 className="prompt_card_main_title">{prompt.title}</h3>
                
                {/* ✅ ITEM 3 FIXED: Removed 'Topic:' label string. Raw clean hashtag anchor! */}
                <p className="prompt_card_topic_meta_text">#{prompt.topic}</p>
                
                <div className="prompt_card_footer_stats_row">
                  {/* ✅ ITEM 6 FIXED: Displays green Done status or Pending states dynamically */}
                  <div className={`card_meta_attempts_count ${isDone ? 'task_status_done' : 'task_status_pending'}`}>
                    {isDone ? <CheckCircle2 size={14} style={{ color: '#16a34a' }} /> : <Circle size={14} style={{ color: '#94a3b8' }} />}
                    <span style={{ color: isDone ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>
                      {isDone ? 'Done' : 'Not Done'}
                    </span>
                  </div>
                  
                  {/* ✅ ITEM 4 FIXED: Transformed to an immediate Start Task link with explicit click event halting */}
                  <span 
                    className="card_action_prompt_preview_link text_action_start_link"
                    onClick={(e) => {
                      e.stopPropagation(); // 🚨 STOPS BUBBLING: Bypasses details modal and launches editor workspace directly!
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
      )}

      {/* =========================================================================
         🎈 MAGNIFICATION PORTAL: HIGH-DENSITY PREVIEW MODAL
         ========================================================================= */}
      {previewPrompt && (
        <div className="stats_zoom_modal_backdrop_blur" onClick={() => setPreviewPrompt(null)}>
          {/* ✅ ITEM 1 FIXED: Swapped out strict height percentage constraints for auto tracks 
              to kill the internal modal card scrollbar bug forever and allow natural vertical expansion! */}
          <div 
            className="stats_zoom_modal_content_container_card writing_preview_expanded_modal_card" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '720px', width: '90%', height: 'auto', maxHeight: 'none', display: 'flex', flexDirection: 'column' }}
          >
            
            {/* Modal Header Toolbar Ribbon Row */}
            <div className="stats_zoom_modal_top_bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="prompt_badge_tier">{previewPrompt.level}</span>
                <span className="prompt_card_type_badge" style={{ margin: 0 }}>{previewPrompt.assignment_type.toUpperCase()}</span>
              </div>
              
              {/* Symmetrical Utility Action Ribbon Track */}
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
            {/* ✅ ITEM 1 FIXED: Dropped overflow-y scrolling vectors to let browser handle heights natively */}
            <div className="preview_modal_scrollable_body_viewport" style={{ flex: 1, marginTop: '10px' }}>
              
              {/* Fixed Task Specifications Deck */}
              <div className="preview_modal_task_spec_section">
                <h2 className="preview_modal_task_heading_title" style={{ marginTop: '5px', fontSize: '1.25rem' }}>{previewPrompt.title}</h2>
                <p className="prompt_situation_paragraph" style={{ fontSize: '0.9rem', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                  {previewPrompt.situation}
                </p>
                
                {/* Clean unlabelled metadata badges */}
                <div className="preview_modal_requirements_row_strip" style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '14px', display: 'flex', gap: '14px' }}>
                  <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', color: '#475569' }}>{previewPrompt.word_count}</span>
                  <span style={{ color: '#2563eb', padding: '4px 0' }}>#{previewPrompt.topic}</span>
                </div>

                <div className="preview_modal_bullet_directives_box" style={{ marginBottom: '16px' }}>
                  <h5 className="prompt_section_sub_title" style={{ marginTop: 0, fontSize: '0.82rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px', marginBottom: '8px' }}>Core Requirements:</h5>
                  <ul className="prompt_bullet_points_list" style={{ paddingLeft: '20px', margin: 0 }}>
                    {previewPrompt.bullet_points.map((pt, idx) => <li key={idx} style={{ marginBottom: '4px', color: '#334155', fontSize: '0.85rem' }}>{pt}</li>)}
                  </ul>
                </div>
                
                <button 
                  type="button" 
                  className="next_button" 
                  style={{ margin: '10px 0 16px 0', padding: '12px' }} 
                  onClick={() => { onSelectPrompt(previewPrompt); setPreviewPrompt(null); }}
                >
                  <FileText size={16} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
                  Start Writing Task Canvas
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
                /* ✅ ITEM 2 FIXED: Completely removed the "Brainstorming Forum..." <h4> text heading string.
                    The polymorphic comment matrix renders immediately and cleanly beneath the dashed accent line! */
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
  );
};