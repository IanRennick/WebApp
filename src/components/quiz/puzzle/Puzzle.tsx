// src/components/quiz/puzzle/Puzzle.tsx
// =========================================================================
// ENHANCED TRANSFORMATION PUZZLE PLAYER (AUTO-FOCUS & 2X2 GRID MATRIX V1)
// =========================================================================
import React, { useState, useEffect } from 'react';
import { FaRegCommentDots, FaRegFlag } from 'react-icons/fa'; 
import './puzzle.css';

const KIND_LABELS: Record<number, string> = {
  0: 'Multiple Choice',
  1: 'Open Cloze',
  2: 'Word Formation',
  3: 'Sentence Cloze'
};

interface PuzzleProps {
  engine: any;
  commentsVisible?: boolean;
  setCommentsVisible?: (val: boolean) => void;
}

const Puzzle: React.FC<PuzzleProps> = ({ engine, commentsVisible, setCommentsVisible }) => {
  const { 
    puzzle, userAnswer, setUserAnswer, isAnswered, isSubmitting, resultData, handleAnswerSubmit, fetchNextQuestion 
  } = engine;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFlaggingQuestion, setIsFlaggingQuestion] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<string>('');

  useEffect(() => {
    setSelectedOption(null);
    setIsFlaggingQuestion(false);
    setFlagReason('');
  }, [puzzle?.id]);

  if (!puzzle) return null;

  const handleFormSubmissionAction = (e: React.FormEvent): void => {
    e.preventDefault(); 
    if (!isAnswered) {
      if (userAnswer.trim()) handleAnswerSubmit();
    } else {
      window.scrollTo(0, 0);
      fetchNextQuestion();
    }
  };

  const handleOptionClick = (optionText: string): void => {
    if (isAnswered) return;
    setSelectedOption(optionText);
    setUserAnswer(optionText);
  };

  // ✅ HIGH-FIDELITY SUB-WORD TOKENS HIGHLIGHTER ENGINE
  // Analyzes prefix intersections to slice words into separate green and red tags!
  const renderPartialDiffLabel = (submitted: string, verified: string) => {
    const subClean = submitted.trim().toLowerCase();
    const verClean = verified.trim().toLowerCase();
    
    let matchLength = 0;
    while (matchLength < subClean.length && matchLength < verClean.length && subClean[matchLength] === verClean[matchLength]) {
      matchLength++;
    }

    if (matchLength > 0) {
      const greenPrefix = submitted.slice(0, matchLength);
      const redSuffix = submitted.slice(matchLength);
      return (
        <span className="diff_segmented_flow">
          <span className="part_correct_green">{greenPrefix}</span>
          {redSuffix && <span className="part_incorrect_red">{redSuffix}</span>}
        </span>
      );
    }
    return <span className="part_incorrect_red">{submitted}</span>;
  };

  const renderDynamicSentence = () => {
    if (!puzzle.main.includes('*')) {
      return <h2 className="puzzle_main">{puzzle.main}</h2>;
    }
    const [leftPart, rightPart] = puzzle.main.split('*');
    const baselineUnderscores = puzzle.kind === 3 ? '_________________________' : '____________';
    const firstCorrectAnswer = resultData?.correct_answers?.[0] || '';

    let embeddedText = userAnswer.trim() || baselineUnderscores;
    let textStateClass = 'sentence_blank_span';

    if (isAnswered && resultData) {
      if (resultData.fully_correct) {
        textStateClass += ' text_green_bold';
      } else {
        embeddedText = firstCorrectAnswer; // Force swap to correct solution string!
        textStateClass += ' text_blue_typing';
      }
    } else if (userAnswer.trim()) {
      textStateClass += ' text_blue_typing';
    }

    return (
      <h2 className="puzzle_main">
        {leftPart}
        <span className={textStateClass}>{embeddedText}</span>
        {rightPart}
      </h2>
    );
  };

  return (
    <form className="puzzle_container" onSubmit={handleFormSubmissionAction}>
      
      <div className="puzzle_card_header">
        <h1 className="puzzle_type">
          {KIND_LABELS[puzzle.kind] || 'Puzzle'} ({puzzle.level})
        </h1>
        
        <div className="puzzle_action_utility_strip">
          {isAnswered && puzzle.comments && (
            <button 
              type="button" 
              className={`utility_strip_btn comment_active_btn ${commentsVisible ? 'comments_open_blue' : ''}`}
              onClick={() => setCommentsVisible && setCommentsVisible(!commentsVisible)}
            >
              <span className="comment_count_badge">
                {puzzle.comments.length}
              </span>
              <FaRegCommentDots />
            </button>
          )}

          <button 
            type="button" 
            className={`utility_strip_btn danger_hover ${isFlaggingQuestion ? 'flag_active_red' : ''}`}
            onClick={() => setIsFlaggingQuestion(prev => !prev)}
          >
            <FaRegFlag />
          </button>
        </div>
      </div>
      <hr className="puzzle_type_hr"/>

      {isFlaggingQuestion && (
        <div className="text_input_wrapper comment_container" style={{ padding: '12px', background: '#f8fafc', marginBottom: '16px' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 6px 0', fontWeight: 'bold' }}>Report Question Typo or Bug:</p>
          <div className="form_row" style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="puzzle_input"
              placeholder="Describe the issue..."
              autoFocus
            />
            <button type="submit" className="comment_button">Flag</button>
          </div>
        </div>
      )}

      {puzzle.keyword && <h2 className="keyword">Keyword: <span className="keyword_token">{puzzle.keyword}</span></h2>}
      {puzzle.prompt && <p className="prompt">{puzzle.prompt}</p>}

      {renderDynamicSentence()}

      {/* Multiple Choice Options List (2x2 Grid) */}
      {puzzle.kind === 0 && puzzle.options && puzzle.options.length > 0 && (
        <ul className="options_list_wrapper">
          {puzzle.options.map((option: string, index: number) => {
            let optionClassName = 'puzzle_option';
            const isSelected = option === selectedOption;
            const isCorrectAlternative = resultData?.correct_answers?.includes(option);

            if (isAnswered) {
              if (isSelected) {
                optionClassName += resultData?.fully_correct ? ' correct' : ' incorrect';
              } else if (isCorrectAlternative) {
                optionClassName += ' correct';
              }
            } else if (isSelected) {
              optionClassName += ' selected';
            }

            return (
              <li key={index} className={optionClassName} onClick={() => handleOptionClick(option)}>
                {isAnswered && isSelected && !resultData?.fully_correct && resultData?.correct_answers?.[0] ? (
                  renderPartialDiffLabel(option, resultData.correct_answers[0])
                ) : (
                  option
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Open Entry Input Text Fields */}
      {puzzle.kind !== 0 && (
        <div className="text_input_wrapper">
          <input 
            className={`puzzle_input ${isAnswered ? (resultData?.fully_correct ? 'correct' : 'incorrect') : ''}`}
            type="text" 
            placeholder="Type answer..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={isAnswered}
            autoFocus
          />

          {isAnswered && !resultData?.fully_correct && resultData?.correct_answers && resultData.correct_answers.length > 0 && (
            <div className="puzzle_option correct" style={{ marginTop: '15px', fontWeight: 'bold' }}>
              {resultData.correct_answers[0]}
            </div>
          )}
        </div>
      )}

      <button 
        type="submit" 
        className="next_button" 
        disabled={isSubmitting || (!isAnswered && !userAnswer.trim())}
      >
        {isSubmitting ? 'Evaluating...' : (isAnswered ? 'Next Question' : 'Submit')}
      </button>
    </form>
  );
};

export default Puzzle;