// src/components/writings/prompts/WritingsPrompts.tsx
// =========================================================================
// HIGH-VOLUME EXAM PROMPT MENU EXPLORER MATRIX (POLISHED V1)
// =========================================================================
import React, { useEffect, useState } from 'react';
import { useGetExamPromptsListQuery, ExamPromptNode } from '../../../features/prompts/promptsApiSlice';
import { useGetUserSubmissionsListQuery } from '../../../features/submissions/submissionsApiSlice'; // ✅ ITEM 6: Done tracking link
import { CheckCircle2, Circle, ArrowRight, HelpCircle } from 'lucide-react';
import LoadingView from '../../layout/loadingScreen/LoadingScreen';
import './writingPrompts.css'; 
import { WritingMagnified } from './WritingMagnified';

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

      {/* ✅ CALL MODULAR ZOOM ENGINE CONSOLE SUB-COMPONENT */}
      {previewPrompt && (
        <WritingMagnified 
          prompt={previewPrompt} 
          onClose={() => setPreviewPrompt(null)} 
          onStartTask={() => {
            onSelectPrompt(previewPrompt);
            setPreviewPrompt(null);
          }}
        />
      )}

    </div>
  );
};