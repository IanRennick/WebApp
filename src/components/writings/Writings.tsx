// src/components/writings/Writings.tsx
// =========================================================================
// UNIFIED COHERENT ESSAY WORKSPACE PORTAL PAGE ROUTER (FIXED RE-CLICK SYSTEM)
// =========================================================================
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import { WritingPrompts } from './prompts/WritingPrompts';
import { WritingSubmission } from './submission/WritingSubmission';
import { ExamPromptNode } from '../../features/prompts/promptsApiSlice';

export const Writings: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<ExamPromptNode | null>(null);
  
  // ✅ ITEM 2 FIXED: Custom tracking engine listens to full changes on search queries & keys.
  // The millisecond a student taps 'Writings' on your navbar, the state drops its prompt object 
  // and safely pulls them out of the text editor back to your grids automatically!
  const location = useLocation();
  useEffect(() => {
    setSelectedPrompt(null);
  }, [location.pathname, location.search, location.key]);

  return (
    <div className="writings_master_coordinator_wrapper" style={{ width: '100%' }}>
      {selectedPrompt ? (
        <div className="active_submission_fade_wrapper">
          {/* ❌ REMOVED: Old unstyled '← All Writings' text line is erased completely! */}
          <WritingSubmission 
            prompt={selectedPrompt} 
            onLeaveWorkspace={() => setSelectedPrompt(null)} // Shared action callback tracker
          />
        </div>
      ) : (
        <div className="prompts_explorer_fade_wrapper">
          <WritingPrompts onSelectPrompt={(prompt) => setSelectedPrompt(prompt)} />
        </div>
      )}
    </div>
  );
};