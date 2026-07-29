// src/components/quiz/puzzle/Puzzle.tsx
// =========================================================================
// ENTER-KEY UPGRADED TEXT-TRANSFORMING PUZZLE PLAYER VIEWPORTS CARD
// =========================================================================
import React, { useState, useEffect } from 'react';
import { FaRegCommentDots, FaRegFlag } from 'react-icons/fa'; 
import './puzzle.css';
import { QuizEngineHookReturn } from '../../../hooks/quiz/useQuizEngine';
import { useCreateFlagMutation } from '../../../features/questions/questionApiSlice';

const KIND_LABELS: Record<number, string> = {
  0: 'Multiple Choice',
  1: 'Open Cloze',
  2: 'Word Formation',
  3: 'Sentence Cloze'
};

interface PuzzleProps {
  engine: QuizEngineHookReturn;
}

const Puzzle: React.FC<PuzzleProps> = ({ engine }) => {
  const { 
    puzzle, userAnswer, setUserAnswer, isAnswered, isSubmitting, resultData, handleAnswerSubmit, fetchNextQuestion 
  } = engine;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // ✅ ITEM C: Local states to toggle the question flagging menu box open/shut
  const [isFlaggingQuestion, setIsFlaggingQuestion] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<string>('');
  const [triggerFlag, { isLoading: isFlaggingApi }] = useCreateFlagMutation();

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

  // ✅ ITEM C: Submit Question Content Flag
  const handleQuestionFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagReason.trim()) return;

    try {
      await triggerFlag({
        commentableId: puzzle.id,
        commentableType: 'Question',
        reportType: 'structural_bug', // Default whitelisted report type enum integer
        body: flagReason.trim()
      }).unwrap();
      setFlagReason('');
      setIsFlaggingQuestion(false);
      alert("Puzzle has been successfully flagged for administrator review.");
    } catch (err) {
      console.error("Failed to submit question flag report:", err);
    }
  };

  const renderDynamicSentence = () => {
    if (!puzzle.main.includes('*')) {
      return <h2 className="puzzle_main">{puzzle.main}</h2>;
    }

    const [leftPart, rightPart] = puzzle.main.split('*');
    const baselineUnderscores = puzzle.kind === 3 ? '_________________________' : '____________';

    let embeddedText = userAnswer.trim() || baselineUnderscores;
    let textStateClass = 'sentence_blank_span';

    if (isAnswered && resultData) {
      textStateClass += resultData.fully_correct ? ' text_green_bold' : ' text_red_bold';
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
              className="utility_strip_btn comment_active_btn" 
              aria-label="Open comment threads feed"
            >
              <FaRegCommentDots />
              {puzzle.comments.length > 0 && (
                <span className="comment_count_badge">{puzzle.comments.length}</span>
              )}
            </button>
          )}

          {/* ✅ ITEM C: Clickable Flag button toggles flag layout box open/shut */}
          <button 
            type="button" 
            className={`utility_strip_btn danger_hover ${isFlaggingQuestion ? 'flag_active_red' : ''}`}
            onClick={() => setIsFlaggingQuestion(prev => !prev)}
            aria-label="Flag question context glitch"
          >
            <FaRegFlag />
          </button>
        </div>
      </div>
      <hr className="puzzle_type_hr"/>

      {/* ✅ ITEM C: Question Flag Input Disclosure Card */}
      {isFlaggingQuestion && (
        <div className="text_input_wrapper comment_container" style={{ padding: '12px', background: '#f8fafc', marginBottom: '16px' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 6px 0', fontWeight: 'bold' }}>Report Question Typo or Bug:</p>
          <div className="form_row" style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="puzzle_input"
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              placeholder="Describe the issue with this puzzle..."
              autoFocus
            />
            <button 
              type="button" 
              className="comment_button" 
              onClick={handleQuestionFlagSubmit}
              disabled={isFlaggingApi || !flagReason.trim()}
            >
              Flag
            </button>
          </div>
        </div>
      )}

      {puzzle.keyword && <h2 className="keyword">Keyword: <span className="keyword_token">{puzzle.keyword}</span></h2>}
      {puzzle.prompt && <h2 className="prompt">{puzzle.prompt}</h2>}
      
      {renderDynamicSentence()}

      {/* Multiple Choice Option Blocks */}
      {puzzle.kind === 0 && puzzle.options && puzzle.options.length > 0 && (
        <ul className="options_list_wrapper">
          {puzzle.options.map((option: string, index: number) => {
            let optionClassName = 'puzzle_option';
            if (isAnswered) {
              if (option === selectedOption) {
                optionClassName += resultData?.fully_correct ? ' correct' : ' incorrect';
              } else if (resultData?.correct_answers?.includes(option)) {
                optionClassName += ' correct';
              }
            } else if (option === selectedOption) {
              optionClassName += ' selected';
            }

            return (
              <li key={index} className={optionClassName} onClick={() => handleOptionClick(option)}>
                {option}
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
            placeholder={puzzle.kind === 3 ? "Enter multiple words missing..." : "Enter missing word..."}
            value={userAnswer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAnswer(e.target.value)}
            disabled={isAnswered}
          />

          {isAnswered && !resultData?.fully_correct && resultData?.correct_answers && resultData.correct_answers.length > 0 && (
            <div className="puzzle_option correct" style={{ marginTop: '15px' }}>
              Correct Solution alternative: {resultData.correct_answers.join(' / ')}
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