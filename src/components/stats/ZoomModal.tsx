// src/components/stats/ZoomModal.tsx
// =========================================================================
// DECOUPLED FULL-SCREEN OVERLAY PORTAL EXTENSION
// =========================================================================
import React from 'react';
import { createPortal } from 'react-dom'; // ✅ NEW: React Portal Engine
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { RadarDataNode } from '../../features/stats/statsApiSlice';

const SUBTYPE_PARAM_MAP: Record<string, string> = {
  "Phrasals": "mc_phrasals", "Collocations": "mc_collocations", "Dependence": "mc_dependence", "Definitions": "mc_definitions", "Others": "mc_others",
  "Auxiliary Verbs": "oc_auxiliary_verbs", "Determiners": "oc_determiners", "Prepositions": "oc_prepositions", "Articles": "oc_articles", 
  "Expressions": "oc_expressions", "Quantifiers": "oc_quantifiers", "Conjunctions": "oc_conjunctions", "Relative Pronouns": "oc_relative_pronouns",
  "Nouns": "wf_nouns", "Verbs": "wf_verbs", "Adverbs": "wf_adverbs", "Adjectives": "wf_adjectives",
  "Conditionals": "sc_conditionals", "Passive": "sc_passive", "Reported Speech": "sc_reported_speech", "Unreal Past": "sc_unreal_past",
  "Verb Patterns": "sc_verb_patterns", "Linkers": "sc_linkers", "Comparisons": "sc_comparisons"
};

interface ZoomModalProps {
  title: string;
  dataSet: RadarDataNode[];
  fillCol: string;
  strokeCol: string;
  onClose: () => void;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({ title, dataSet, fillCol, strokeCol, onClose }) => {
  const navigate = useNavigate();

  const ClickableAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const subjectName = payload.value;
    const queryParam = SUBTYPE_PARAM_MAP[subjectName] || 'mc_others';

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0} y={0} dy={4} textAnchor="middle" className="radar_clickable_axis_link_label"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
            navigate(`/quiz?subtype=${queryParam}`);
          }}
        >
          {subjectName}
        </text>
      </g>
    );
  };

  // ✅ FIXED VIEWPORT ATTACHMENT: Compiles the markup and teleports it directly to document.body
  return createPortal(
    <div className="stats_zoom_modal_backdrop_blur" onClick={onClose}>
      <div className="stats_zoom_modal_content_container_card" onClick={(e) => e.stopPropagation()}>
        
        <div className="stats_zoom_modal_top_bar">
          <h3 className="radar_card_title" style={{ fontSize: '1.3rem', margin: 0, textAlign: 'left' }}>{title} Detail Profile</h3>
          <button type="button" className="stats_zoom_modal_close_btn" onClick={onClose}>&times;</button>
        </div>

        <div style={{ width: '100%', height: '420px', marginTop: '10px' }}>
          <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dataSet}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="subject" tick={<ClickableAxisTick />} />
              <PolarRadiusAxis angle={30} domain={['dataMin - 100', 'dataMax + 100']} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
              <Radar name="Proficiency" dataKey="rating" stroke={strokeCol} fill={fillCol} fillOpacity={0.4} />
              <Tooltip 
                contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                labelStyle={{ display: 'none' }}
                formatter={(value: any, name: any, props: any) => [
                  `${props.payload.subject} ${value} (${props.payload.correct}/${props.payload.done})`
                ]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>,
    document.body // Teleport target node reference
  );
};