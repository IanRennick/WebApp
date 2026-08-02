// src/components/quiz/Quiz.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Puzzle from './puzzle/Puzzle';
import Dashboard from './dashboard/Dashboard';
import ReviewQuiz from './ReviewMode'; 
import { CommentSection } from '../comments/CommentSection';
import { useQuizEngine } from '../../hooks/quiz/useQuizEngine';
import './quiz.css';
import LoadingScreen from '../layout/loadingScreen/LoadingScreen';

const Quiz: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isReviewMode = searchParams.get('mode') === 'review';

  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
  const randomEngine = useQuizEngine();

  // ✅ STEP E: Auto-close the discussion boards drawer the millisecond a brand-new card load handles execute
  useEffect(() => {
    setCommentsVisible(false);
  }, [randomEngine.puzzle?.id]);

  if (isReviewMode) {
    return <ReviewQuiz />;
  }

  if (randomEngine.isLoading) {
    return <LoadingScreen />;
  }

  if (randomEngine.isError || !randomEngine.puzzle) return <div className="puzzle_container"><h2>Failed to connect to backend routers.</h2></div>;

  return (
    <div className="quiz_layout_grid">
      
      <div className="quiz_main_column">
        <Puzzle 
          engine={randomEngine} 
          commentsVisible={commentsVisible}
          setCommentsVisible={setCommentsVisible}
        />
      </div>

      <div className="quiz_sidebar_column">
        <Dashboard 
          puzzle={randomEngine.puzzle}
          isAnswered={randomEngine.isAnswered}
          resultData={randomEngine.resultData}
        />
      </div>

      {commentsVisible && randomEngine.isAnswered && randomEngine.puzzle.comments && (
        <div className="quiz_comments_full_width_row">
          <CommentSection 
            commentableId={randomEngine.puzzle.id} 
            commentableType="Question" 
            rootComments={randomEngine.puzzle.comments} 
          />
        </div>
      )}

    </div>
  );
};

export default Quiz;