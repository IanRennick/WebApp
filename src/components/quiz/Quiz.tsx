import React from 'react';
import Puzzle from './puzzle/Puzzle';
import Dashboard from './dashboard/Dashboard';
import { CommentSection } from '../comments/CommentSection';
import { useQuizEngine } from '../../hooks/quiz/useQuizEngine';
import './quiz.css';

const Quiz: React.FC = () => {
  const engine = useQuizEngine();

  if (engine.isLoading) return <div className="puzzle_container"><h2>Loading exercise universe...</h2></div>;
  if (engine.isError || !engine.puzzle) return <div className="puzzle_container"><h2>Failed to connect to backend routers.</h2></div>;

  return (
    <div className="quiz_layout_grid">
      
      {/* 🧩 COLUMN 1: LEFT WORKSPACE PANEL (Holds core puzzle and comment discussions) */}
      <div className="quiz_main_column">
        
        {/* Core Exercise Viewport Card */}
        <Puzzle engine={engine} />

        {/* Discussion Board (Revealed Post-Submission) */}
        {engine.isAnswered && engine.puzzle.comments && (
          <CommentSection 
            commentableId={engine.puzzle.id} 
            commentableType="Question" 
            rootComments={engine.puzzle.comments} 
          />
        )}
        
      </div>

      {/* 📊 COLUMN 2: RIGHT REAL-TIME ANALYTICS DASHBOARD PANEL */}
      <div className="quiz_sidebar_column">
        <Dashboard 
          puzzle={engine.puzzle}
          isAnswered={engine.isAnswered}
          resultData={engine.resultData}
        />
      </div>

    </div>
  );
};

export default Quiz;