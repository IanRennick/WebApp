// src/components/quiz/puzzle/Puzzle.tsx
// =========================================================================
// INTERACTIVE CORE INTERFACE DISPLAY GRID (PUZZLE MODULE V1)
// =========================================================================
import React, { useState, useEffect } from 'react';
import './puzzle.css';
import { useQuizEngine } from '../../../hooks/quiz/useQuizEngine';

// Mapping dictionary to safely translate your backend enum integers into UI labels
const KIND_LABELS: Record<number, string> = {
  0: 'Multiple Choice',
  1: 'Open Cloze',
  2: 'Word Formation',
  3: 'Sentence Cloze'
};

const Puzzle: React.FC = () => {
  // Pull our newly exposed interactive handles out of your upgraded custom hook engine
  const { 
    puzzle, 
    isLoading, 
    isError, 
    userAnswer, 
    setUserAnswer, 
    isAnswered, 
    isSubmitting,
    resultData, 
    handleAnswerSubmit, 
    fetchNextQuestion 
  } = useQuizEngine();

  // Local state helper tracking which specific multiple choice bubble was highlighted
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Clean up selection states whenever a completely new puzzle mounts onto the viewport
  useEffect(() => {
    setSelectedOption(null);
  }, [puzzle?.id]);

  if (isLoading) return <div className="puzzle_container"><h2>Loading next puzzle challenge...</h2></div>;
  if (isError || !puzzle) return <div className="puzzle_container"><h2>Failed to load question profile data.</h2></div>;

  // -----------------------------------------------------------------------
  // ACTION HANDLER SWITCH GATING
  // -----------------------------------------------------------------------
  const handlePrimaryActionClick = (): void => {
    if (!isAnswered) {
      handleAnswerSubmit();
    } else {
      window.scrollTo(0, 0);
      fetchNextQuestion();
    }
  };

  // Capture option clicks for Multiple Choice (Kind 0)
  const handleOptionClick = (optionText: string): void => {
    if (isAnswered) return; // Prevent changing your mind post-submission!
    setSelectedOption(optionText);
    setUserAnswer(optionText); // Sync selection directly to the hook's answer transmitter
  };

  return (
    <div className="puzzle_container">
      
      {/* Quiz Header Title - Maps integer enum numbers cleanly to display text labels */}
      <h1 className="puzzle_type">
        {KIND_LABELS[puzzle.kind] || 'Puzzle'} ({puzzle.level})
      </h1>
      <hr className="puzzle_type_hr"/>

      {/* Alphanumeric Keyword Root Token */}
      {puzzle.keyword && <h2 className="keyword">Keyword: {puzzle.keyword}</h2>}

      {/* Context Prompt Text Segment */}
      {puzzle.prompt && <h2 className="prompt">{puzzle.prompt}</h2>}

      {/* Primary Exercise Core Clause Sentence String */}
      <h2 className="puzzle_main">{puzzle.main}</h2>

      {/* ===================================================================
          LAYOUT TRACK A: INTERACTIVE OPTIONS SELECTION MATRIX (KIND 0)
          =================================================================== */}
      {puzzle.kind === 0 && puzzle.options && puzzle.options.length > 0 && (
        <ul>
          {puzzle.options.map((option: string, index: number) => {
            // Determine active highlight classes dynamically on the fly
            let optionClassName = 'puzzle_option';
            
            if (isAnswered) {
              if (option === selectedOption) {
                // Color it green or red based on the Rails answer grading math
                optionClassName += resultData?.fully_correct ? ' correct' : ' incorrect';
              } else if (resultData?.correct_answers?.includes(option)) {
                // Automatically reveal the correct choice in green if the student missed it
                optionClassName += ' correct';
              }
            } else if (option === selectedOption) {
              optionClassName += ' selected';
            }

            return (
              <li 
                key={index} 
                className={optionClassName}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            );
          })}
        </ul>
      )}

      {/* ===================================================================
          LAYOUT TRACK B: CLOZE & FORMATION OPEN TEXT SLOTS (KINDS 1, 2, 3)
          =================================================================== */}
      {puzzle.kind !== 0 && (
        <div className="text_input_wrapper">
          <input 
            className={`puzzle_input ${isAnswered ? (resultData?.fully_correct ? 'correct' : 'incorrect') : ''}`}
            type="text" 
            placeholder="Enter Answer"
            value={userAnswer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAnswer(e.target.value)}
            disabled={isAnswered} // Freeze the field so input parameters stay locked down
          />

          {/* POST-SUBMISSION CORRECT KEY COMPLIANCE BANNER */}
          {isAnswered && !resultData?.fully_correct && resultData?.correct_answers && resultData.correct_answers.length > 0 && (
            <div className="puzzle_option correct" style={{ marginTop: '15px' }}>
              Correct Answer: {resultData.correct_answers[0]}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Action Button Control Gate */}      
      <button 
        className="next_button" 
        onClick={handlePrimaryActionClick}
        disabled={isSubmitting || (!isAnswered && !userAnswer.trim())} // Block blank form submissions
      >
        {isSubmitting ? 'Evaluating...' : (isAnswered ? 'Next Question' : 'Submit')}
      </button>
      
    </div>
  );
};

export default Puzzle;