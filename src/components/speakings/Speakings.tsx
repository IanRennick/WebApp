// src/components/speakings/Speakings.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SpeakingPrompts } from './prompts/SpeakingPrompts';
import { SpeakingSubmission } from './submission/SpeakingSubmission';
import { ExamPromptNode } from '../../features/prompts/promptsApiSlice';

export const Speakings: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<ExamPromptNode | null>(null);
  
  // Safely auto-returns the user to the selection list if they tap the navbar link again
  const location = useLocation();
  useEffect(() => {
    setSelectedPrompt(null);
  }, [location.pathname, location.search, location.key]);

  return (
    <div className="speakings_master_coordinator_wrapper" style={{ width: '100%' }}>
      {selectedPrompt ? (
        <div className="active_submission_fade_wrapper">
          <SpeakingSubmission prompt={selectedPrompt} />
        </div>
      ) : (
        <div className="prompts_explorer_fade_wrapper">
          <SpeakingPrompts onSelectPrompt={(prompt) => setSelectedPrompt(prompt)} />
        </div>
      )}
    </div>
  );
};