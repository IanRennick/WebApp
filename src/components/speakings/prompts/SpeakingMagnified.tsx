// src/components/speakings/prompts/SpeakingMagnified.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
import { FaRegCommentDots, FaRegFlag } from 'react-icons/fa';
import { ExamPromptNode } from '../../../features/prompts/promptsApiSlice';
import { CommentSection } from '../../comments/CommentSection';

interface SpeakingMagnifiedProps {
  prompt: ExamPromptNode;
  onClose: () => void;
  onStartTask: () => void;
}

export const SpeakingMagnified: React.FC<SpeakingMagnifiedProps> = ({ prompt, onClose, onStartTask }) => {
  const [showModalComments, setShowModalComments] = useState<boolean>(false);
  const [isFlaggingPrompt, setIsFlaggingPrompt] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<string>('');

  const flagInputRef = useRef<HTMLInputElement>(null);
  const commentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFlaggingPrompt) {
      setTimeout(() => {
        flagInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        flagInputRef.current?.focus();
      }, 80);
    }
  }, [isFlaggingPrompt]);

  useEffect(() => {
    if (showModalComments) {
      setTimeout(() => {
        commentContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }, [showModalComments]);

  return (
    <div className="stats_zoom_modal_backdrop_blur" onClick={onClose}>
      <div 
        className="stats_zoom_modal_content_container_card writing_preview_expanded_modal_card" 
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="stats_zoom_modal_top_bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="prompt_badge_tier" style={{ background: '#fae8ff', color: '#6b21a8' }}>{prompt.level}</span>
            <span className="prompt_card_type_badge" style={{ background: '#fef3c7', color: '#92400e', margin: 0 }}>SPEAKING EXAM</span>
          </div>
          <div className="puzzle_action_utility_strip" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: 'auto', marginRight: '16px' }}>
            <button type="button" className={`utility_strip_btn comment_active_btn ${showModalComments ? 'comments_open_blue' : ''}`} onClick={() => { setShowModalComments(!showModalComments); setIsFlaggingPrompt(false); }} title="Toggle Brainstorming Comments">
              <span className="comment_count_badge">0</span><FaRegCommentDots />
            </button>
            <button type="button" className={`utility_strip_btn danger_hover ${isFlaggingPrompt ? 'flag_active_red' : ''}`} onClick={() => { setIsFlaggingPrompt(!isFlaggingPrompt); setShowModalComments(false); }} title="Report Prompt Bug">
              <FaRegFlag />
            </button>
          </div>
          <button type="button" className="stats_zoom_modal_close_btn" onClick={onClose}>&times;</button>
        </div>

        <div className="preview_modal_scrollable_body_viewport" style={{ flex: 1, marginTop: '4px' }}>
          <div className="preview_modal_task_spec_section">
            <h2 className="preview_modal_task_heading_title" style={{ marginTop: '5px', fontSize: '1.25rem' }}>{prompt.title}</h2>
            <div className="speakings_workspace_photo_frame" style={{ height: '240px', marginBottom: '10px' }}>
              {prompt.photo_url ? (
                <img src={prompt.photo_url.startsWith('http') ? prompt.photo_url : `http://127.0.0.1:3000${prompt.photo_url}`} alt="Enlarged asset" />
              ) : (
                <div className="p-4 text-muted small">Photographic assignment directive reference</div>
              )}
            </div>
            <p style={{ fontStyle: 'italic', color: '#2563eb', fontWeight: 700, fontSize: '1.15rem', textAlign: 'center', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '0 0 10px 0' }}>
              "{prompt.question}"
            </p>
            <div className="preview_modal_requirements_row_strip" style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '12px', display: 'flex', gap: '14px' }}>
              <span style={{ color: '#d97706', padding: '2px 0' }}>#{prompt.topic}</span>
            </div>
            <button type="button" className="next_button" style={{ margin: '5px 0 10px 0', padding: '10px', background: '#d97706', borderColor: '#d97706' }} onClick={onStartTask}>
              <FileText size={16} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
              Start Speaking Recording Deck
            </button>
          </div>

          {isFlaggingPrompt && (
            <div className="text_input_wrapper comment_container animate_fade_in" style={{ padding: '14px', background: '#f8fafc', margin: '12px 0', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 8px 0', fontWeight: 'bold' }}>Report Prompt Typo or Bug:</p>
              <div className="form_row" style={{ display: 'flex', gap: '8px' }}>
                <input ref={flagInputRef} type="text" value={flagReason} onChange={(e) => setFlagReason(e.target.value)} className="puzzle_input" placeholder="Describe the issue..." style={{ flex: 1, padding: '8px 12px', fontSize: '0.9rem' }} autoFocus />
                <button type="button" className="comment_button" style={{ padding: '8px 16px' }} onClick={() => { alert("Report logged."); setIsFlaggingPrompt(false); setFlagReason(''); }}>Flag</button>
              </div>
            </div>
          )}

          {showModalComments && (
            <div ref={commentContainerRef} className="preview_modal_discussions_forum_divider_section animate_fade_in" style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '16px', marginTop: '16px', width: '100%', boxSizing: 'border-box' }}>
              <div className="modal_comments_wrapper_full_width" style={{ width: '100%' }}>
                <CommentSection commentableId={prompt.id} commentableType="Prompt" rootComments={[]} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};