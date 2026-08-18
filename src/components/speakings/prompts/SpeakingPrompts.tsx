// src/components/speakings/prompts/SpeakingsPrompts.tsx
// =========================================================================
// HIGH-VOLUME EXAM PROMPT MENU EXPLORER MATRIX (MODAL ALIGNED)
// =========================================================================
import React, { useState, useEffect } from 'react';
import { useGetExamPromptsListQuery, ExamPromptNode } from '../../../features/prompts/promptsApiSlice';
import { useGetUserSubmissionsListQuery } from '../../../features/submissions/submissionsApiSlice';
import { CheckCircle2, Circle, ArrowRight, HelpCircle, FileText } from 'lucide-react';
import LoadingView from '../../layout/loadingScreen/LoadingScreen';
import './speakingPrompts.css';
import { SpeakingMagnified } from './SpeakingMagnified';

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

      {/* ✅ CALL MODULAR ZOOM ENGINE CONSOLE SUB-COMPONENT */}
      {previewPrompt && (
        <SpeakingMagnified 
          prompt={previewPrompt} 
          onClose={() => setPreviewPrompt(null)} 
          onStartTask={() => {
            onSelectPrompt(previewPrompt);
            setPreviewPrompt(null);
          }}
        />
      )}
    </div>
  )
}