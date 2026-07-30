// src/components/quiz/dashboard/ReviewDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress'; 
import { PieChart } from '@mui/x-charts/PieChart';
import { QuestionData, SubmissionResult } from '../../../features/questions/questionApiSlice';
import './dashboard.css';

const KIND_URL_MAPPING: Record<number, string> = { 0: 'multiple_choice', 1: 'open_cloze', 2: 'word_formation', 3: 'sentence_cloze' };
const KIND_LABELS: Record<number, string> = { 0: 'Multiple Choice', 1: 'Open Cloze', 2: 'Word Formation', 3: 'Sentence Cloze' };
const CAMBRIDGE_INSTRUCTIONS: Record<number, string> = {
  0: "Select the correct option bubble to complete the blank space.",
  1: "Type the exact single missing word into the open field slot.",
  2: "Use the provided root word token to form a correct modifier word.",
  3: "Complete the second sentence so it closely mirrors the first. Use between 3 and 5 words."
};

interface ReviewDashboardProps {
  puzzle: QuestionData;
  currentIndex: number;     
  totalInQueue: number;     
  correctCount: number;     
  isAnswered: boolean;
  resultData: SubmissionResult | null;
}

const ReviewDashboard: React.FC<ReviewDashboardProps> = ({
  puzzle, currentIndex, totalInQueue, correctCount, isAnswered, resultData
}) => {
  const displayCurrentNum = currentIndex + 1;
  const progressPercentage = totalInQueue > 0 ? Math.round((currentIndex / totalInQueue) * 100) : 0;
  
  const elementsAnsweredSoFar = currentIndex; 
  const incorrectCount = elementsAnsweredSoFar - correctCount;
  const sessionAccuracy = elementsAnsweredSoFar > 0 ? Math.round((correctCount / elementsAnsweredSoFar) * 100) : 0;

  const [activeTab, setActiveTab] = useState<'info' | 'answers'>('info');
  useEffect(() => { setActiveTab('info'); }, [puzzle?.id]);

  return (
    <div className="quiz_sidebar_container">
      
      <div className="sidebar_analytics_box square_box layout_box_centered_items">
        <div className="minimal_elo_display" style={{ flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
          <span className="master_rating_value" style={{ fontSize: '1.4rem' }}>Review Queue</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Practice Session</span>
        </div>
        <div className="chart_container_box" style={{ marginTop: 'auto', paddingBottom: '4px' }}>
          <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 6, borderRadius: 5, backgroundColor: '#e2e8f0', '& .MuiLinearProgress-bar': { backgroundColor: '#2563eb' } }} />
        </div>
      </div>

      <div className="sidebar_analytics_box square_box center_content layout_box_centered_items">
        <div className="donut_wrapper_relative">
          {elementsAnsweredSoFar > 0 ? (
            <>
              <PieChart series={[{ data: [{ id: 'correct', value: correctCount, color: '#16a34a' }, { id: 'incorrect', value: incorrectCount, color: '#dc2626' }], innerRadius: 28, outerRadius: 40, paddingAngle: 2, cornerRadius: 3 }]} width={100} height={100} hideLegend />
              <div className="donut_center_text_badge">{sessionAccuracy}%</div>
            </>
          ) : (
            <PieChart series={[{ data: [{ id: 'empty', value: 1, color: '#e2e8f0' }], innerRadius: 28, outerRadius: 40 }]} width={100} height={100} hideLegend />
          )}
        </div>
        <p className="puzzles_cleared_subtext" style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.85rem', marginTop: '4px' }}>
          {displayCurrentNum} / {totalInQueue}
        </p>
      </div>

      <div className="sidebar_analytics_box square_box split_content layout_box_centered_items">
        {isAnswered && resultData ? (
          <div className="stats_metrics_flow animate_fade_in text_center_align_items" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            <div className="dashboard_tab_header_strip">
              <button type="button" className={`tab_switch_btn ${activeTab === 'info' ? 'active_tab' : ''}`} onClick={() => setActiveTab('info')}>Info</button>
              <button type="button" className={`tab_switch_btn ${activeTab === 'answers' ? 'active_tab' : ''}`} onClick={() => setActiveTab('answers')}>Answers</button>
            </div>

            {activeTab === 'info' ? (
              <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                <p className="master_question_rating_title" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                  Puzzle: {resultData.question_new_rating || puzzle.rating || 1200}
                </p>

                <div className="clean_link_rows_container" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                  <div>
                    {/* ✅ FIXED: Only the category string is a link now; the numeric Elo number is normal text! */}
                    <Link to={`/quiz?kind=${KIND_URL_MAPPING[puzzle.kind] || '0'}`} className="clean_dashboard_search_link">
                      {KIND_LABELS[puzzle.kind] || 'Choice'}
                    </Link>
                    <span className="unlinked_elo_number_text">: {resultData.category_kind_rating || 1200}</span>
                  </div>
                  <div style={{ marginTop: '3px' }}>
                    <Link to={`/quiz?subtype=${puzzle.subtype || '0'}`} className="clean_dashboard_search_link">
                      Type {puzzle.subtype || 'Core'}
                    </Link>
                    <span className="unlinked_elo_number_text">: {resultData.category_subtype_rating || 1200}</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="dashboard_scrollable_answers_drawer">
                <div className="chips_horizontal_row" style={{ justifyContent: 'center', gap: '4px' }}>
                  {resultData.correct_answers?.map((ans, idx) => (
                    <span key={idx} className="solution_alternative_chip">{ans}</span>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="stats_metrics_flow text_center_align_items" style={{ padding: '4px' }}>
            <p className="clue_label_hint_text" style={{ color: '#2563eb', marginBottom: '4px', fontWeight: 'bold' }}>Instructions</p>
            <p className="instruction_body_narrative_text" style={{ textAlign: 'center', fontSize: '0.8rem', lineHeight: '1.4' }}>
              {CAMBRIDGE_INSTRUCTIONS[puzzle.kind] || "Analyze the core item context block and complete the blank spaces."}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ReviewDashboard;