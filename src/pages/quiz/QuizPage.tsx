// src/pages/quiz/QuizPage.tsx
// =========================================================================
// LIGHTWEIGHT QUIZ PAGE CONTAINER VIEWPORT ROUTER HUB
// =========================================================================
import React from 'react';
import Quiz from '../../components/quiz/Quiz';

const QuizPage: React.FC = () => {
  return (
    <div className="quiz_page_container">
      <Quiz />
    </div>
  );
};

export default QuizPage;