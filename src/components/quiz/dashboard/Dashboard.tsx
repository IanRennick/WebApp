// src/components/quiz/dashboard/Dashboard.tsx
// =========================================================================
// REAL-TIME ANALYTICS DASHBOARD (MODULAR REFRACTORED ACCURACY PANELS)
// =========================================================================
import React, { useState, useEffect } from 'react';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { QuestionData, SubmissionResult } from '../../../features/questions/questionApiSlice';
import { selectCurrentUserElo, updateUserMetrics } from '../../../features/auth/authSlice';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import { QuestionInfoPanel } from './QuestionInfoPanel'; // ✅ NEW
import './dashboard.css';

interface DashboardProps {
  puzzle: QuestionData;
  isAnswered: boolean;
  resultData: SubmissionResult | null;
}

const Dashboard: React.FC<DashboardProps> = ({ puzzle, isAnswered, resultData }) => {
  const dispatch = useAppDispatch();
  const globalUserElo = useAppSelector(selectCurrentUserElo);

  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [eloHistory, setEloHistory] = useState<number[]>(() => [globalUserElo]);

  const [lastDisplayElo, setLastDisplayElo] = useState<number>(() => globalUserElo);
  const [lastEloChange, setLastEloChange] = useState<number | null>(null);

  useEffect(() => {
    if (isAnswered && resultData) {
      setTotalAnswered((prev) => prev + 1);
      if (resultData.fully_correct) setCorrectCount((prev) => prev + 1);
      setEloHistory((prev) => [...prev, resultData.user_new_rating]);
      setLastDisplayElo(resultData.user_new_rating);
      setLastEloChange(resultData.elo_change);
      dispatch(updateUserMetrics({ rating: resultData.user_new_rating }));
    }
  }, [isAnswered, resultData, dispatch]);

  const incorrectCount = totalAnswered - correctCount;
  const accuracyPercentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return (
    <div className="quiz_sidebar_container">
      
      {/* 📈 BOX 1: ACCOUNT ELO SNAPSHOT */}
      <div className="sidebar_analytics_box square_box layout_box_centered_items">
        <div className="minimal_elo_display">
          <span className="master_rating_value">{lastDisplayElo}</span>
          {lastEloChange !== null && (
            <span className={`rating_change_badge ${lastEloChange >= 0 ? 'text_green' : 'text_red'}`}>
              ({lastEloChange >= 0 ? `+${lastEloChange}` : lastEloChange})
            </span>
          )}
        </div>
        <div className="chart_container_box sparkline_grid_background_wrapper" style={{ height: '40px', marginTop: 'auto' }}>
          <SparkLineChart data={eloHistory} height={40} color="#2563eb" showTooltip showHighlight />
        </div>
      </div>

      {/* 📊 BOX 2: DONUT HOLE PERFORMANCE ACCURACY */}
      <div className="sidebar_analytics_box square_box center_content layout_box_centered_items">
        <div className="donut_wrapper_relative">
          {totalAnswered > 0 ? (
            <>
              <PieChart series={[{ data: [{ id: 'correct', value: correctCount, color: '#16a34a' }, { id: 'incorrect', value: incorrectCount, color: '#dc2626' }], innerRadius: 28, outerRadius: 40, paddingAngle: 2, cornerRadius: 3 }]} width={100} height={100} hideLegend />
              <div className="donut_center_text_badge">{accuracyPercentage}%</div>
            </>
          ) : (
            <PieChart series={[{ data: [{ id: 'empty', value: 1, color: '#e2e8f0' }], innerRadius: 28, outerRadius: 40 }]} width={100} height={100} hideLegend />
          )}
        </div>
        <p className="puzzles_cleared_subtext" style={{ marginTop: '6px' }}>Cleared: {totalAnswered}</p>
      </div>

      {/* 🔍 ✅ FIXED: Shared component injection tracks variables perfectly */}
      <QuestionInfoPanel puzzle={puzzle} isAnswered={isAnswered} resultData={resultData} />

    </div>
  );
};

export default Dashboard;