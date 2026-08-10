// src/components/speakings/submission/SpeakingSubmission.tsx
// =========================================================================
// PREMIUM INTERACTIVE AUDIO COMPOSITION WORKSPACE CANVAS (FINAL POLISH)
// =========================================================================
import React, { useState } from 'react';
import { Mic, Square, CheckCircle, MessageSquare, Flag } from 'lucide-react';
import { ExamPromptNode } from '../../../features/prompts/promptsApiSlice';
import { useAudioRecorder } from '../../../hooks/speakings/useAudioRecorder';
import { useCreateNewSubmissionMutation } from '../../../features/submissions/submissionsApiSlice';
import { CommentSection } from '../../comments/CommentSection';
import './speakingSubmission.css';

interface SpeakingSubmissionProps {
  prompt: ExamPromptNode;
}

export const SpeakingSubmission: React.FC<SpeakingSubmissionProps> = ({ prompt }) => {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [isFlagging, setIsFlagging] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<string>('');

  const [createNewSubmission, { isLoading: isSubmitting }] = useCreateNewSubmissionMutation();

  const handleAutoTimeLimitReached = (blob: Blob) => {
    console.log("Audio auto-capped at 60s.", blob);
  };

  const {
    isRecording,
    recordingSeconds,
    audioBlob,
    previewUrl,
    permissionError,
    startRecording,
    stopAndResetRecording
  } = useAudioRecorder(handleAutoTimeLimitReached);

  const isSubmitDisabled = recordingSeconds < 60 || !audioBlob || isSubmitting;

  const formatTimeToken = (secs: number): string => {
    const remaining = secs % 60;
    return `0:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const handleFinalAudioSubmission = async () => {
    if (isSubmitDisabled || !audioBlob) return;
    try {
      const formData = new FormData();
      formData.append('prompt_id', prompt.id.toString());
      formData.append('status', 'submitted');
      formData.append('student_payload', `Completed 60s speech prompt response tracking (#${prompt.topic})`);
      formData.append('audio_clip', audioBlob, `student_voice_prompt_${prompt.id}.webm`);

      await createNewSubmission(formData as any).unwrap();
      alert("🎉 Voice recording successfully dispatched for administrative review!");
      stopAndResetRecording();
    } catch (err) {
      console.error(err);
      alert("Audio dispatch failed. Please retry.");
    }
  };

  return (
    <div className="writings_explorer_master_wrapper" style={{ padding: '0 12px 60px 10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Upper Core Workspace Panel Layer Split Row */}
      <div style={{ display: 'flex', width: '100%', gap: '24px', alignItems: 'stretch' }} className="speaking_submission_container">
        
        {/* 🧭 COLUMN 1: LEFT DIRECTIVE PANE CANVAS */}
        <div className="speakings_workspace_left_directive_column">
          <div className="card bg-white border border-secondary border-opacity-20 p-4 rounded shadow-sm">
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
              <span className="prompt_badge_tier" style={{ background: '#fdf4ff', color: '#701a75', border: '1px solid #fae8ff', margin: 0 }}>
                {prompt.level} SPEAKING EXAM
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 14px 0', lineHeight: '1.3' }}>
              {prompt.title}
            </h3>
            
            <div className="speakings_workspace_photo_frame">
              {prompt.photo_url ? (
                <img 
                  src={prompt.photo_url.startsWith('http') ? prompt.photo_url : `http://127.0.0.1:3000${prompt.photo_url}`} 
                  alt="Exam challenge directive asset" 
                />
              ) : (
                <div className="p-5 text-muted small">Photographic assignment card reference</div>
              )}
            </div>

            <p className="speakings_workspace_centered_question_block">
              "{prompt.question}"
            </p>
          </div>

          {/* Inline Flag Reporting Tray */}
          {isFlagging && (
            <div className="text_input_wrapper comment_container p-3" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', margin: 0 }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 6px 0', fontWeight: 'bold' }}>Report Question Typo:</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={flagReason} onChange={(e) => setFlagReason(e.target.value)} className="puzzle_input" placeholder="Describe the issue..." style={{ margin: 0 }} autoFocus />
                <button type="button" className="next_button" style={{ width: '80px', minWidth: '80px', margin: 0 }} onClick={() => { alert("Report logged."); setIsFlagging(false); setFlagReason(''); }}>Flag</button>
              </div>
            </div>
          )}
        </div>

        {/* 🎙️ COLUMN 2: RIGHT HAND RECORDER CONTROLLER SIDEBAR */}
        <div className="speakings_workspace_right_recorder_column">
          <div className="card bg-white border border-secondary border-opacity-20 p-4 rounded shadow-sm" style={{ height: '100%', justifyContent: 'center' }}>
            
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: isRecording ? '#dc2626' : '#0f172a', fontFamily: 'monospace', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
              <span className={isRecording ? 'text_recording_pulse_glow' : ''}>
                {formatTimeToken(recordingSeconds)}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '1.4rem', fontWeight: '500', marginLeft: '4px' }}>/ 1:00</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'center', marginBottom: '16px' }}>
              {!isRecording ? (
                <button type="button" className="editor_footer_btn btn_primary_blue" onClick={startRecording} disabled={isSubmitting}>
                  <Mic size={16} /> Start
                </button>
              ) : (
                <button type="button" className="editor_footer_btn" style={{ background: '#dc2626', color: '#fff' }} onClick={stopAndResetRecording}>
                  <Square size={14} /> Stop
                </button>
              )}

              <button type="button" className="next_button" onClick={handleFinalAudioSubmission} disabled={isSubmitDisabled}>
                <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Submit
              </button>
            </div>

            {previewUrl && !isRecording && (
              <div className="audio_preview_review_card_deck" style={{ marginBottom: '14px' }}>
                <audio src={previewUrl} controls />
              </div>
            )}

            <div className="puzzle_action_utility_strip" style={{ gap: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '14px', width: '100%', justifyContent: 'center', marginTop: '10px' }}>
              <button type="button" className={`utility_strip_btn ${showComments ? 'comments_open_blue' : ''}`} onClick={() => setShowComments(!showComments)} title="Toggle Comments Board">
                <MessageSquare size={18} />
              </button>
              <button type="button" className={`utility_strip_btn danger_hover ${isFlagging ? 'flag_active_red' : ''}`} onClick={() => !isRecording && setIsFlagging(!isFlagging)} title="Report Prompt Typo">
                <Flag size={18} />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ✅ ITEM B FIXED: Brainstorming Comments Board mounts at the true baseline rows, 
          expanding to 100% full width and never interrupting mobile card positioning layouts! */}
      {showComments && (
        <div className="card bg-white border border-secondary border-opacity-20 p-4 rounded shadow-sm animate_fade_in" style={{ width: '100%', boxSizing: 'border-box' }}>
          <CommentSection commentableId={prompt.id} commentableType="Prompt" rootComments={[]} />
        </div>
      )}

    </div>
  );
};