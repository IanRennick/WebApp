import React from 'react';
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

interface RadarCardProps {
  title: string;
  dataSet: RadarDataNode[];
  fillCol: string;
  strokeCol: string;
  onZoom: () => void;
}

export const RadarCard: React.FC<RadarCardProps> = ({ title, dataSet, fillCol, strokeCol, onZoom }) => {
  const navigate = useNavigate();
  const hasData = dataSet.some(node => node.done > 0);

  const ClickableAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const subjectName = payload.value;
    const queryParam = SUBTYPE_PARAM_MAP[subjectName] || 'mc_others';

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0} y={0} dy={4} textAnchor="middle" className="radar_clickable_axis_link_label"
          onClick={(e) => {
            e.stopPropagation(); // Stops parent container click card zoom triggers
            navigate(`/quiz?subtype=${queryParam}`);
          }}
        >
          {subjectName}
        </text>
      </g>
    );
  };

  return (
    <div className="radar_card_wrapper interact_zoomable_card" onClick={onZoom} title="Click to magnify chart">
      <h4 className="radar_card_title">{title}</h4>
      <div style={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dataSet}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={<ClickableAxisTick />} />
            <PolarRadiusAxis angle={30} domain={['dataMin - 100', 'dataMax + 100']} tick={{ fill: '#94a3b8', fontSize: 9 }} />
            <Radar name="Proficiency" dataKey="rating" stroke={strokeCol} fill={fillCol} fillOpacity={hasData ? 0.35 : 0.08} />
            <Tooltip 
              contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', padding: '6px 10px' }}
              labelStyle={{ display: 'none' }}
              formatter={(value: any, name: any, props: any) => [
                `${props.payload.subject} ${value} (${props.payload.correct}/${props.payload.done})`
              ]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};