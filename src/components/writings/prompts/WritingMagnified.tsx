// src/components/writings/prompts/WritingMagnified.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
import { FaRegCommentDots, FaRegFlag } from 'react-icons/fa';
import { ExamPromptNode } from '../../../features/prompts/promptsApiSlice';
import { CommentSection } from '../../comments/CommentSection';

interface WritingMagnifiedProps {
  prompt: ExamPromptNode;
  onClose: () => void;
  onStartTask: () => void;
}

export const WritingMagnified: React.FC<WritingMagnifiedProps> = ({ prompt, onClose, onStartTask }) => {
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
        <div className="stats_zoom_modal_top_bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="prompt_badge_tier">{prompt.level}</span>
            <span className="prompt_card_type_badge" style={{ margin: 0 }}>{prompt.assignment_type.toUpperCase()}</span>
          </div>
          <div className="puzzle_action_utility_strip" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: 'auto', marginRight: '16px'}}>
            <button type="button" className={`utility_strip_btn comment_active_btn ${showModalComments ? 'comments_open_blue' : ''}`} onClick={() => { setShowModalComments(!showModalComments); setIsFlaggingPrompt(false); }}>
              <span className="comment_count_badge">0</span><FaRegCommentDots />
            </button>
            <button type="button" className={`utility_strip_btn danger_hover ${isFlaggingPrompt ? 'flag_active_red' : ''}`} onClick={() => { setIsFlaggingPrompt(!isFlaggingPrompt); setShowModalComments(false); }}>
              <FaRegFlag />
            </button>
          </div>
          <button type="button" className="stats_zoom_modal_close_btn" onClick={onClose}>&times;</button>
        </div>

        <div className="preview_modal_scrollable_body_viewport">
          <div className="preview_modal_task_spec_section">
            <h2 className="preview_modal_task_heading_title" style={{ marginTop: '5px', fontSize: '1.25rem' }}>{prompt.title}</h2>
            <p className="prompt_situation_paragraph" style={{ fontSize: '0.9rem', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: '1.5', margin: '0 0 12px 0' }}>
              {prompt.situation}
            </p>
            <div className="preview_modal_requirements_row_strip" style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '14px', display: 'flex', gap: '14px' }}>
              <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', color: '#475569' }}>{prompt.word_count}</span>
              <span style={{ color: '#2563eb', padding: '4px 0' }}>#{prompt.topic}</span>
            </div>
            <div className="preview_modal_bullet_directives_box" style={{ marginBottom: '16px' }}>
              <h5 className="prompt_section_sub_title" style={{ marginTop: 0, fontSize: '0.82rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px', marginBottom: '8px' }}>Core Requirements:</h5>
              <ul className="prompt_bullet_points_list" style={{ paddingLeft: '20px', margin: 0 }}>
                {prompt.bullet_points.map((pt, idx) => <li key={idx} style={{ marginBottom: '4px', color: '#334155', fontSize: '0.85rem' }}>{pt}</li>)}
              </ul>
            </div>
            <button type="button" className="next_button" style={{ margin: '10px 0 16px 0', padding: '12px' }} onClick={onStartTask}>
              <FileText size={16} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
              Start Writing Task Canvas
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