// src/components/quiz/dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Lightbulb, X } from 'lucide-react'; // ✅ NEW: Sleek toggle icons
import { QuestionData, SubmissionResult } from '../../../features/questions/questionApiSlice';
import { selectCurrentUserElo, updateUserMetrics } from '../../../features/auth/authSlice';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import './dashboard.css';

const KIND_URL_MAPPING: Record<number, string> = { 0: 'multiple_choice', 1: 'open_cloze', 2: 'word_formation', 3: 'sentence_cloze' };
const KIND_LABELS: Record<number, string> = { 0: 'Multiple Choice', 1: 'Open Cloze', 2: 'Word Formation', 3: 'Sentence Cloze' };

const CAMBRIDGE_INSTRUCTIONS: Record<number, string> = {
  0: "Select the correct option bubble to complete the blank space.",
  1: "Type the exact single missing word into the open field slot (Use exactly ONE word).",
  2: "Use the provided root word token to derive the correct modifier form for the blank.",
  3: "Complete the second sentence so it closely mirrors the first. Use between 3 and 5 words."
};

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

  // ✅ ITEM 3: Minimal boolean toggle to swap info view for alternative solutions list
  const [showAlternativeAnswers, setShowAlternativeAnswers] = useState<boolean>(false);

  useEffect(() => {
    setShowAlternativeAnswers(false); // Reset to default metrics view on question mount
  }, [puzzle?.id]);

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

      {/* 📊 BOX 2: DONUT HOLE ACCURACY */}
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

      {/* 🔍 BOX 3: DYNAMIC CLUES & INLINE TOGGLES */}
      <div className="sidebar_analytics_box square_box split_content layout_box_centered_items" style={{ position: 'relative' }}>
        {isAnswered && resultData ? (
          <div className="stats_metrics_flow animate_fade_in text_center_align_items" style={{ width: '100%', height: '100%' }}>
            
            {/* ✅ ITEM 3 FIXED: Conditional micro icon button appears ONLY if multiple solutions exist! */}
            {resultData.correct_answers && resultData.correct_answers.length > 1 && (
              <button 
                type="button" 
                className="dashboard_micro_bulb_toggle_btn"
                onClick={() => setShowAlternativeAnswers(!showAlternativeAnswers)}
                title={showAlternativeAnswers ? "Back to stats info" : "Reveal alternative solutions"}
              >
                {showAlternativeAnswers ? <X size={16} /> : <Lightbulb size={16} />}
              </button>
            )}

            {!showAlternativeAnswers ? (
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
                  {resultData.correct_answers.map((ans, idx) => (
                    <span key={idx} className="solution_alternative_chip">{ans}</span>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          /* ✅ ITEM 2 FIXED: Completely removed the "Instructions:" heading string layer. Pure, minimal narrative! */
          <div className="stats_metrics_flow text_center_align_items" style={{ padding: '4px 10px' }}>
            <p className="instruction_body_narrative_text" style={{ textAlign: 'center', fontSize: '0.85rem', lineHeight: '1.45', color: '#475569', fontWeight: '500' }}>
              {CAMBRIDGE_INSTRUCTIONS[puzzle.kind] || "Analyze the phrase patterns carefully and enter your answer parameters."}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;