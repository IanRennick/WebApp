// src/hooks/quiz/useQuizEngine.ts
// =========================================================================
// STATELLES NAVIGATION URL INTERPRETER & ANTI-CHEAT ENGINE HOOK
// =========================================================================
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetRandomQuestionQuery, useSubmitAnswerMutation, SubmissionResult } from '../../features/questions/questionApiSlice';

export const useQuizEngine = () => {
  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode') || 'random';
  const kind = searchParams.get('kind') || '';
  const level = searchParams.get('level') || '';
  const tag = searchParams.get('tag') || '';

  const currentPathSignature = `${mode}_${kind}_${level}_${tag}`;
  const idStorageKey = `current_puzzle_id_${currentPathSignature}`;
  const statusStorageKey = `current_puzzle_status_${currentPathSignature}`;

  // 1. ATOMIC SYNCHRONIZED STORAGE READS WITH REFRESH GUARD
  const getInitialActiveId = (): number | null => {
    const savedId = localStorage.getItem(idStorageKey);
    const savedStatus = localStorage.getItem(statusStorageKey);

    if (savedId && savedStatus === 'answered') {
      // ✅ ANTI-CHEAT SHIELD ENFORCED: The user refreshed *after* submitting.
      // Wipe the stale tokens from the disk immediately to force a fresh puzzle draw!
      localStorage.removeItem(idStorageKey);
      localStorage.removeItem(statusStorageKey);
      return null;
    }

    return savedId ? parseInt(savedId, 10) : null;
  };

  const [activeFetchId, setActiveFetchId] = useState<number | null>(() => getInitialActiveId());
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [resultData, setResultData] = useState<SubmissionResult | null>(null);

  // Sync state resets on sidebar path clicks
  useEffect(() => {
    setActiveFetchId(getInitialActiveId());
    setUserAnswer('');
    setIsAnswered(false);
    setResultData(null);
  }, [idStorageKey]);

  // Network Query & Mutation Hooks
  const { data: puzzle, isLoading, isFetching, isError, error, refetch } = 
    useGetRandomQuestionQuery({ mode, kind, level, tag, id: activeFetchId });

  const [submitAnswerApi, { isLoading: isSubmitting }] = useSubmitAnswerMutation();

  // Cache Registration Lock (Locks on active fresh draw)
  useEffect(() => {
    if (puzzle && puzzle.id && !isFetching) {
      const currentDiskId = localStorage.getItem(idStorageKey);
      if (!currentDiskId) {
        localStorage.setItem(idStorageKey, puzzle.id.toString());
        localStorage.setItem(statusStorageKey, 'idle'); // Set starting status lock
        setActiveFetchId(puzzle.id);
      }
    }
  }, [puzzle, isFetching, idStorageKey, statusStorageKey]);

  // Answer Submission Controller
  const handleAnswerSubmit = async () => {
    if (!puzzle || !userAnswer.trim() || isAnswered) return;

    try {
      const response = await submitAnswerApi({
        id: puzzle.id,
        answer: userAnswer.trim(),
        mode: mode
      }).unwrap();

      setResultData(response);
      setIsAnswered(true);
      
      // ✅ LOCK STATUS ON DISK: Mark this key path as evaluated natively
      localStorage.setItem(statusStorageKey, 'answered');
    } catch (err) {
      console.error("Failed to commit answer submission:", err);
    }
  };

  // Next Puzzle Core Transition Action
  const fetchNextQuestion = async () => {
    localStorage.removeItem(idStorageKey);
    localStorage.removeItem(statusStorageKey); // Wipe status row clean
    
    setActiveFetchId(null);
    setUserAnswer('');
    setIsAnswered(false);
    setResultData(null);

    await refetch();
  };

  return {
    puzzle,
    mode,
    kind,
    isLoading,
    isError,
    error,
    userAnswer,
    setUserAnswer,
    isAnswered,
    isSubmitting,
    resultData,
    handleAnswerSubmit,
    fetchNextQuestion,
  };
};

// Define an explicit return type profile export so child components can type-hint props
export type QuizEngineHookReturn = ReturnType<typeof useQuizEngine>;