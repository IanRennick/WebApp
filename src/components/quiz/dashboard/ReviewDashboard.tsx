// src/components/quiz/dashboard/ReviewDashboard.tsx
// =========================================================================
// BATCH REVIEW MODE PERFORMANCE METRICS ROW (MODULAR REFRACTORED)
// =========================================================================
import React from 'react';
import LinearProgress from '@mui/material/LinearProgress'; 
import { PieChart } from '@mui/x-charts/PieChart';
import { QuestionData, SubmissionResult } from '../../../features/questions/questionApiSlice';
import { QuestionInfoPanel } from './QuestionInfoPanel'; // ✅ NEW
import './dashboard.css';

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

  return (
    <div className="quiz_sidebar_container">
      
      {/* 📈 BOX 1: PROGRESS SPRINT TRACKER */}
      <div className="sidebar_analytics_box square_box layout_box_centered_items">
        <div className="minimal_elo_display" style={{ flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
          <span className="master_rating_value" style={{ fontSize: '1.4rem' }}>Review Queue</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Practice Session</span>
        </div>
        <div className="chart_container_box" style={{ marginTop: 'auto', paddingBottom: '4px' }}>
          <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 6, borderRadius: 5, backgroundColor: '#e2e8f0', '& .MuiLinearProgress-bar': { backgroundColor: '#2563eb' } }} />
        </div>
      </div>

      {/* 📊 BOX 2: FRACTIONS ACCURACY COUNTER */}
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

      {/* 🔍 ✅ FIXED: Shared component integration tracks variables perfectly across review mode */}
      <QuestionInfoPanel puzzle={puzzle} isAnswered={isAnswered} resultData={resultData} />

    </div>
  );
};

export default ReviewDashboard;