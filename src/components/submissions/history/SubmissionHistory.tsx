// src/components/submissions/WritingsHistoryDetail.tsx
// =========================================================================
// POLYMORPHIC STUDENT SUBMISSION ASSESSMENT REVIEW PORTAL (AUDIO FIXED)
// =========================================================================
import React from 'react';
import { Award, User, Clock, Bookmark } from 'lucide-react';
import { SubmissionPayloadNode } from '../../../features/prompts/promptsApiSlice';
import { CommentSection } from '../../comments/CommentSection';
import './submissionHistory.css'; 

interface SubmissionHistoryProps {
  submission: SubmissionPayloadNode;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ submission }) => {
  const isSpeakingTask = submission.prompt_type === 'speaking';

  const getScoreColor = (val: number): string => {
    if (val >= 4.0) return '#16a34a'; 
    if (val >= 3.0) return '#d97706'; 
    return '#dc2626'; 
  };

  // Safe numeric sanitizer conversion loops
  const criteriaRows = Object.entries(submission.scores || {}).map(([key, value]) => ({
    name: key.replace('_', ' '),
    val: Number(value || 0) 
  }));

  const globalColor = getScoreColor(submission.final_result || 0);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Upper Core Review Workspace Layer Split Row */}
      <div className="submission_detail_review_grid">
        
        {/* 📝 PANEL 1: STUDENT ANSWER ARCHIVE VIEW (LEFT COLUMN) */}
        <div className="speakings_workspace_left_directive_column">
          <div className="card bg-white border border-secondary border-opacity-20 p-4 rounded shadow-sm">
            <div className="detail_review_header_row" style={{ marginBottom: '14px' }}>
              <span 
                className="prompt_badge_tier" 
                style={{ 
                  background: isSpeakingTask ? '#fdf4ff' : '#f0fdf4', 
                  color: isSpeakingTask ? '#701a75' : '#16a34a', 
                  border: `1px solid ${isSpeakingTask ? '#fae8ff' : '#dcfce7'}` 
                }}
              >
                ✓ {submission.prompt_type.toUpperCase()} ASSESSMENT
              </span>
              <div className="detail_review_timestamp_badge">
                <Clock size={14} /> Evaluated {submission.timestamp}
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
              {submission.prompt_title}
            </h3>
            
            {/* ✅ CONDITION SPLIT: Render either essay text block highlighters or audio photo contexts */}
            {!isSpeakingTask ? (
              <div 
                className="p-3 bg-dark bg-opacity-5 rounded border border-secondary border-opacity-20 font-monospace graded_essay_payload_display_box" 
                dangerouslySetInnerHTML={{ __html: submission.student_payload }}
              />
            ) : (
              <div className="student_history_audio_playback_card" style={{ padding: '16px' }}>
    
                {/* ✅ FIXED GRAPHIC: Stripped out the ternary address prefix layers completely!
                    Since Rails already transmits an absolute URL, passing the string variable directly 
                    restores the photographic canvas layout instantly without clipping anomalies. */}
                <div className="speakings_workspace_photo_frame" style={{ height: '260px', width: '100%', marginBottom: '16px', borderRadius: '8px' }}>
                  {submission.prompt_photo_url ? (
                    <img 
                      src={submission.prompt_photo_url} 
                      alt="Exam photographic challenge context" 
                    />
                  ) : (
                    <div className="p-4 text-muted small">No photographic assignment asset found</div>
                  )}
                </div>

                {/* Hardware-accelerated audio player */}
                <audio 
                  src={submission.audio_url || undefined} 
                  controls 
                  style={{ width: '100%', outline: 'none' }}
                />
              </div>
            )}
            
          </div>
        </div>

        {/* 📊 PANEL 2: METRICS SCORECARD & FEEDBACK NOTES (RIGHT COLUMN) */}
        <div className="speakings_workspace_right_recorder_column">
          
          {/* Global Average Display Card Deck */}
          <div className="card bg-white border border-secondary border-opacity-20 p-4 rounded shadow-sm scorecard_average_display_badge">
            <Award size={28} style={{ color: globalColor, margin: '0 auto 8px auto' }} />
            <div className="scorecard_average_number_display" style={{ color: globalColor }}>
              {submission.final_result ? submission.final_result.toFixed(2) : '--'}
              <span>/ 5.0</span>
            </div>
            <div className="scorecard_evaluator_name_tag">
              <User size={12} /> Evaluator: {submission.corrector_name || "Academy Academic"}
            </div>
          </div>

          {/* Sub-Criteria Parameter Breakdown Scales */}
          <div className="card bg-white border border-secondary border-opacity-20 p-4 rounded shadow-sm">
            <div className="criteria_breakdown_metrics_stack">
              {criteriaRows.map((metric, idx) => {
                const metricColor = getScoreColor(metric.val);
                return (
                  <div key={idx} style={{ width: '100%' }}>
                    <div className="criteria_breakdown_label_row">
                      <span>{metric.name}</span>
                      <span style={{ color: metricColor }}>{metric.val.toFixed(1)} / 5</span>
                    </div>
                    <div className="criteria_slider_track_gauge_line">
                      <div 
                        className="criteria_slider_fill_bar" 
                        style={{ width: `${(metric.val / 5) * 100}%`, background: metricColor }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher Correction Rich-Text Notes Field */}
          <div className="card bg-white border border-secondary border-opacity-20 p-4 rounded shadow-sm" style={{ flex: 1 }}>
            <h4 className="teacher_feedback_header_title">
              <Bookmark size={14} /> Teacher Feedback Notes
            </h4>
            {submission.teacher_feedback_html ? (
              <div 
                className="p-3 bg-light rounded border font-sans text-dark leading-relaxed trix-content teacher_feedback_rich_text_viewport" 
                dangerouslySetInnerHTML={{ __html: submission.teacher_feedback_html }}
              />
            ) : (
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#94a3b8', margin: 0 }}>
                No structural feedback summary logged by your evaluator.
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Baseline Polymorphic Message timeline forum */}
      <div className="card bg-white border border-secondary border-opacity-20 p-4 rounded shadow-sm">
        <CommentSection commentableId={submission.id} commentableType="Submission" rootComments={[]} />
      </div>

    </div>
  );
};