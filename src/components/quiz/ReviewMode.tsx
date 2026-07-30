// src/components/quiz/ReviewMode.tsx
// =========================================================================
// LOCAL BATCH REUSE INTERFACE CONTROLLER (REVIEW ENGINE MODULE)
// =========================================================================
import React, { useState, useEffect } from 'react';
import { useGetReviewQueueQuery, useSubmitAnswerMutation, SubmissionResult } from '../../features/questions/questionApiSlice';
import Puzzle from './puzzle/Puzzle';
import ReviewDashboard from './dashboard/ReviewDashboard';
import { CommentSection } from '../comments/CommentSection';
import './quiz.css';

const ReviewMode: React.FC = () => {
  const { data: queue, isLoading, isError } = useGetReviewQueueQuery();
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [resultData, setResultData] = useState<SubmissionResult | null>(null);
  const [sessionCorrectCount, setSessionCorrectCount] = useState<number>(0);
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);

  // Permanent Memory Tracker for Session Totals
  const [totalSessionCount, setTotalSessionCount] = useState<number | null>(null);

  const [submitAnswerApi, { isLoading: isSubmitting }] = useSubmitAnswerMutation();

  // Locks your original starting length the exact millisecond the database loads
  useEffect(() => {
    if (queue && totalSessionCount === null) {
      setTotalSessionCount(queue.length);
    }
  }, [queue, totalSessionCount]);

  // Auto-close discussion threads on question changes
  useEffect(() => {
    setCommentsVisible(false);
  }, [currentIndex]);

  if (isLoading) return <div className="puzzle_container"><h2>Extracting your review queue deck...</h2></div>;
  if (isError || !queue) return <div className="puzzle_container"><h2>Failed to load your review deck context.</h2></div>;
  
  if (queue.length === 0 && currentIndex === 0) {
    return (
      <div className="puzzle_container text_center" style={{ maxWidth: '600px', margin: '40px auto', padding: '40px' }}>
        <h2>✨ Queue Empty &amp; Immaculate!</h2>
        <p style={{ color: '#64748b', marginTop: '10px' }}>You have zero unresolved incorrect answers left to review right now. Exceptional work!</p>
      </div>
    );
  }

  const finalTotalCount = totalSessionCount !== null ? totalSessionCount : queue.length;

  if (currentIndex >= finalTotalCount || queue.length === 0) {
    return (
      <div className="puzzle_container text_center" style={{ maxWidth: '600px', margin: '40px auto', padding: '40px' }}>
        <h2>🏆 Review Sprint Complete!</h2>
        <p style={{ color: '#64748b', marginTop: '10px' }}>You have successfully navigated through all {finalTotalCount} items in this practice set!</p>
        <button className="next_button" style={{ marginTop: '20px' }} onClick={() => {
          setTotalSessionCount(null);
          setCurrentIndex(0);
        }}>Restart Queue Loop</button>
      </div>
    );
  }

  const activePuzzle = queue[currentIndex];

  const handleReviewAnswerSubmit = async () => {
    if (!userAnswer.trim() || isAnswered) return;

    try {
      const response = await submitAnswerApi({
        id: activePuzzle.id,
        answer: userAnswer.trim(),
        mode: 'review'
      }).unwrap();

      setResultData(response);
      setIsAnswered(true);

      if (response.fully_correct) {
        setSessionCorrectCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to commit review item submission:", err);
    }
  };

  const handleNextReviewQuestion = () => {
    window.scrollTo(0, 0);
    setUserAnswer('');
    setIsAnswered(false);
    setResultData(null);
    setCurrentIndex((prev) => prev + 1);
  };

  const mockEngineProps = {
    puzzle: activePuzzle,
    userAnswer,
    setUserAnswer,
    isAnswered,
    isSubmitting,
    resultData,
    handleAnswerSubmit: handleReviewAnswerSubmit,
    fetchNextQuestion: handleNextReviewQuestion
  };

  return (
    <div className="quiz_layout_grid">
      
      <div className="quiz_main_column">
        <Puzzle 
          key={activePuzzle.id} 
          engine={mockEngineProps} 
          commentsVisible={commentsVisible}
          setCommentsVisible={setCommentsVisible}
        />

        {commentsVisible && isAnswered && activePuzzle.comments && (
          <div className="quiz_comments_full_width_row">
            <CommentSection 
              commentableId={activePuzzle.id} 
              commentableType="Question" 
              rootComments={activePuzzle.comments} 
            />
          </div>
        )}
      </div>

      <div className="quiz_sidebar_column">
        <ReviewDashboard 
          puzzle={activePuzzle}
          currentIndex={currentIndex}
          totalInQueue={finalTotalCount}
          correctCount={sessionCorrectCount}
          isAnswered={isAnswered}
          resultData={resultData}
        />
      </div>

    </div>
  );
};

export default ReviewMode;