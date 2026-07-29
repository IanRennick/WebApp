// src/components/quiz/dashboard/Dashboard.tsx
// =========================================================================
// REAL-TIME ANALYTICS DASHBOARD WITH PERSISTENT GLOBAL REDUX INTERCEPTIONS
// =========================================================================
import React, { useState, useEffect } from 'react';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { QuestionData, SubmissionResult } from '../../../features/questions/questionApiSlice';
import { selectCurrentUserElo, updateUserMetrics } from '../../../features/auth/authSlice'; // ✅ NEW
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks'; // ✅ NEW
import './dashboard.css';

interface DashboardProps {
  puzzle: QuestionData;
  isAnswered: boolean;
  resultData: SubmissionResult | null;
}

const Dashboard: React.FC<DashboardProps> = ({ puzzle, isAnswered, resultData }) => {
  const dispatch = useAppDispatch();
  
  // ✅ NEW: Read their true, live global starting Elo directly out of Redux!
  const globalUserElo = useAppSelector(selectCurrentUserElo);

  // --- Active Frontend Session Tracking States ---
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [eloHistory, setEloHistory] = useState<number[]>(() => [globalUserElo]); // Initialize line start points beautifully

  // ✅ FIXED: Initialize display cache dynamically using their true global Elo!
  const [lastDisplayElo, setLastDisplayElo] = useState<number>(() => globalUserElo);
  const [lastEloChange, setLastEloChange] = useState<number | null>(null);

  // Intercept backend result calculations on submission frames to increment session metrics
  useEffect(() => {
    if (isAnswered && resultData) {
      setTotalAnswered((prev) => prev + 1);
      if (resultData.fully_correct) setCorrectCount((prev) => prev + 1);
      
      setEloHistory((prev) => [...prev, resultData.user_new_rating]);
      setLastDisplayElo(resultData.user_new_rating);
      setLastEloChange(resultData.elo_change);

      dispatch(updateUserMetrics({
        rating: resultData.user_new_rating
      }));
    }
  }, [isAnswered, resultData, dispatch]);

  const incorrectCount = totalAnswered - correctCount;
  const accuracyPercentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return (
    <div className="quiz_sidebar_container">
      
      {/* 📈 BOX 1: ACCOUNT ELO OVERVIEW */}
      <div className="sidebar_analytics_box square_box">
        <div className="minimal_elo_display">
          <span className="master_rating_value">{lastDisplayElo}</span>
          {lastEloChange !== null && (
            <span className={`rating_change_badge ${lastEloChange >= 0 ? 'text_green' : 'text_red'}`}>
              ({lastEloChange >= 0 ? `+${lastEloChange}` : lastEloChange})
            </span>
          )}
        </div>
        
        <div className="chart_container_box" style={{ height: '40px', marginTop: 'auto' }}>
          <SparkLineChart
            data={eloHistory}
            height={40}
            color="#2563eb"
          />
        </div>
      </div>

      {/* 📊 BOX 2: SESSION ACCURACY ACCORDION */}
      <div className="sidebar_analytics_box square_box center_content">
        <div className="donut_wrapper_relative">
          {totalAnswered > 0 ? (
            <>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 'correct', value: correctCount, label: 'Correct', color: '#16a34a' },
                      { id: 'incorrect', value: incorrectCount, label: 'Incorrect', color: '#dc2626' },
                    ],
                    innerRadius: 28, 
                    outerRadius: 40,
                    paddingAngle: 2,
                    cornerRadius: 3,
                  },
                ]}
                width={100}
                height={100}
                hideLegend
              />
              <div className="donut_center_text_badge">{accuracyPercentage}%</div>
            </>
          ) : (
            <p className="placeholder_prompt_info_text">0% accuracy</p>
          )}
        </div>
        <p className="puzzles_cleared_subtext">Cleared: {totalAnswered}</p>
      </div>

      {/* 🔍 BOX 3: EXTRA QUESTION MATRIX CLUES */}
      <div className="sidebar_analytics_box square_box split_content">
        {isAnswered && resultData ? (
          <div className="stats_metrics_flow animate_fade_in">
            <p className="master_question_rating_title">
              {resultData.question_new_rating || puzzle.rating || 1200}
            </p>
            <p className="subtype_label_link" style={{ marginBottom: '6px' }}>
              Subtype Matrix: #{puzzle.subtype || 'Core'}
            </p>
            
            <div className="granular_elo_rows" style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
              <div>Format Elo: <strong style={{ color: '#0f172a' }}>{resultData.category_kind_rating}</strong></div>
              <div style={{ marginTop: '2px' }}>Grammar Elo: <strong style={{ color: '#0f172a' }}>{resultData.category_subtype_rating}</strong></div>
            </div>

            {resultData.correct_answers && resultData.correct_answers.length > 1 && (
              <div style={{ marginTop: '8px' }}>
                <ul className="correct_answers_chips_list">
                  {resultData.correct_answers.slice(0, 3).map((ans, idx) => (
                    <li key={idx} className="correct_chip_item">{ans}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="stats_metrics_flow">
            <p className="instruction_body_narrative_text">
              Instructions: Analyze the block. Click an option or type your missing token, then evaluate.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;