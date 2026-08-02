// src/components/quiz/dashboard/QuestionInfoPanel.tsx
// =========================================================================
// UNIFIED QUIZ SUBTYPE/INSTRUCTION DATA PRESENTATION GRID PANEL (BOX 3)
// =========================================================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, X } from 'lucide-react';
import { QuestionData, SubmissionResult } from '../../../features/questions/questionApiSlice';

const KIND_URL_MAPPING: Record<number, string> = { 0: 'multiple_choice', 1: 'open_cloze', 2: 'word_formation', 3: 'sentence_cloze' };
const KIND_LABELS: Record<number, string> = { 0: 'Multiple Choice', 1: 'Open Cloze', 2: 'Word Formation', 3: 'Sentence Cloze' };

const CAMBRIDGE_INSTRUCTIONS: Record<number, string> = {
  0: "Select the correct option bubble to complete the blank space.",
  1: "Type the exact single missing word into the open field slot.",
  2: "Use the provided root word token to form a correct modifier word.",
  3: "Complete the second sentence so it closely mirrors the first. Use between 3 and 5 words."
};

// ✅ FIXED: Maps raw incoming Rails backend integer enums directly to clean string param codes
const SUBTYPE_INT_TO_PARAM: Record<number, string> = {
  0: 'mc_phrasals', 1: 'mc_collocations', 2: 'mc_dependence', 3: 'mc_definitions', 4: 'mc_others',
  5: 'oc_auxiliary_verbs', 6: 'oc_determiners', 7: 'oc_prepositions', 8: 'oc_articles', 9: 'oc_expressions',
  10: 'oc_quantifiers', 11: 'oc_conjunctions', 12: 'oc_relative_pronouns', 13: 'oc_others',
  14: 'wf_nouns', 15: 'wf_verbs', 16: 'wf_adverbs', 17: 'wf_adjectives',
  18: 'sc_conditionals', 19: 'sc_passive', 20: 'sc_reported_speech', 21: 'sc_unreal_past',
  22: 'sc_expressions', 23: 'sc_verb_patterns', 24: 'sc_linkers', 25: 'sc_comparisons', 26: 'sc_others'
};

// ✅ FIXED: Maps raw incoming Rails backend integer enums directly to beautiful presentation text labels
const SUBTYPE_INT_TO_LABEL: Record<number, string> = {
  0: 'Phrasals', 1: 'Collocations', 2: 'Dependence', 3: 'Definitions', 4: 'Other MC',
  5: 'Auxiliary Verbs', 6: 'Determiners', 7: 'Prepositions', 8: 'Articles', 9: 'Expressions',
  10: 'Quantifiers', 11: 'Conjunctions', 12: 'Relative Pronouns', 13: 'Other OC',
  14: 'Nouns', 15: 'Verbs', 16: 'Adverbs', 17: 'Adjectives',
  18: 'Conditionals', 19: 'Passive Voice', 20: 'Reported Speech', 21: 'Unreal Past',
  22: 'Expressions', 23: 'Verb Patterns', 24: 'Linkers', 25: 'Comparisons', 26: 'Other SC'
};

interface QuestionInfoPanelProps {
  puzzle: QuestionData;
  isAnswered: boolean;
  resultData: SubmissionResult | null;
}

export const QuestionInfoPanel: React.FC<QuestionInfoPanelProps> = ({ puzzle, isAnswered, resultData }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'answers'>('info');

  // Automatically reset back to default 'info' view whenever a new question mounts
  useEffect(() => {
    setActiveTab('info');
  }, [puzzle?.id]);

  // Decode the incoming database integer down to active display names and string query handles safely
  const subtypeInt = typeof puzzle.subtype === 'number' ? puzzle.subtype : parseInt(puzzle.subtype || '0', 10);
  const rawSubtypeParam = SUBTYPE_INT_TO_PARAM[subtypeInt] || 'mc_others';
  const cleanSubtypeLabel = SUBTYPE_INT_TO_LABEL[subtypeInt] || 'Core';

  return (
    <div className="sidebar_analytics_box square_box split_content layout_box_centered_items" style={{ position: 'relative' }}>
      {isAnswered && resultData ? (
        <div className="stats_metrics_flow animate_fade_in text_center_align_items" style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
          
          {/* Micro Toggle Button for Multiple Alternative Solutions */}
          {resultData.correct_answers && resultData.correct_answers.length > 1 && (
            <button 
              type="button" 
              className="dashboard_micro_bulb_toggle_btn"
              onClick={() => setActiveTab(activeTab === 'info' ? 'answers' : 'info')}
              title={activeTab === 'answers' ? "Back to stats info" : "Reveal alternative solutions"}
            >
              {activeTab === 'answers' ? <X size={14} /> : <Lightbulb size={14} />}
            </button>
          )}

          {activeTab === 'info' ? (
            <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <p className="master_question_rating_title" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                Puzzle: {resultData.question_new_rating || puzzle.rating || 1200}
              </p>

              <div className="clean_link_rows_container" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                <div>
                  <Link to={`/quiz?kind=${KIND_URL_MAPPING[puzzle.kind] || '0'}`} className="clean_dashboard_search_link">
                    {KIND_LABELS[puzzle.kind] || 'Choice'}
                  </Link>
                  <span className="unlinked_elo_number_text">: {resultData.category_kind_rating || 1200}</span>
                </div>
                <div style={{ marginTop: '3px' }}>
                  {/* ✅ FIXED: Clickable text points perfectly to the string param code, while label shows clean presentation English text! */}
                  <Link to={`/quiz?subtype=${rawSubtypeParam}`} className="clean_dashboard_search_link">
                    {cleanSubtypeLabel}
                  </Link>
                  <span className="unlinked_elo_number_text">: {resultData.category_subtype_rating || 1200}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard_scrollable_answers_drawer">
              <div className="chips_horizontal_row" style={{ justifyContent: 'center', gap: '4px' }}>
                {resultData.correct_answers?.map((ans, idx) => (
                  <span key={idx} className="solution_alternative_chip">{ans}</span>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* ✅ FIXED: Pre-submission view outputs STRICTLY the text instructions block, keeping the layout completely uncluttered! */
        <div className="stats_metrics_flow text_center_align_items" style={{ padding: '2px 4px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="instruction_body_narrative_text" style={{ textAlign: 'center', fontSize: '0.82rem', lineHeight: '1.45', color: '#475569', fontWeight: '500', margin: 0 }}>
            {CAMBRIDGE_INSTRUCTIONS[puzzle.kind] || "Analyze the phrase patterns carefully and enter your answer parameters."}
          </p>
        </div>
      )}
    </div>
  );
};