// src/components/stats/StatsView.tsx
// =========================================================================
// REAL-TIME PERFORMANCE ANALYTICS CONSOLE DASHBOARD (MODULAR REFRACTORED)
// =========================================================================
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';
import { useGetUserPerformanceStatsQuery, RadarDataNode } from '../../features/stats/statsApiSlice';
import { RadarCard } from './RadarCard';
import { ZoomModal } from './ZoomModal';
import './statsView.css';

interface ZoomedChartConfig {
  title: string;
  dataSet: RadarDataNode[];
  fillCol: string;
  strokeCol: string;
}

const StatsView: React.FC = () => {
  const { data: stats, isLoading, isError } = useGetUserPerformanceStatsQuery();
  const [zoomedChart, setZoomedChart] = useState<ZoomedChartConfig | null>(null);

  if (isLoading) return <div className="stats_loading_container"><h2>Compiling your academic performance records...</h2></div>;
  if (isError || !stats) return <div className="stats_loading_container"><h2>Failed to connect to the performance metrics router.</h2></div>;

  const overallAccuracy = stats.total_done > 0 ? Math.round((stats.total_correct / stats.total_done) * 100) : 0;
  const isPositiveDelta = stats.daily_delta >= 0;

  console.log(zoomedChart);

  return (
    <div className="stats_dashboard_master_container animate_fade_in">
      
      {/* 📊 TIER 1: CORE PROFILE METRIC SNAPSHOT STRIPS */}
      <div className="stats_metrics_row_grid">
        <div className="stats_snapshot_card">
          <span className="snapshot_meta_label">Global Performance</span>
          <div className="snapshot_main_value_row">
            <h2 className="snapshot_numeric_value">{stats.global_rating} <span className="elo_label_text">Elo</span></h2>
            <span className={`snapshot_delta_badge ${isPositiveDelta ? 'delta_up' : 'delta_down'}`}>
              {isPositiveDelta ? `+${stats.daily_delta}` : stats.daily_delta} today
            </span>
          </div>
        </div>

        <div className="stats_snapshot_card">
          <span className="snapshot_meta_label">Training Balance</span>
          <div className="snapshot_main_value_row">
            <h2 className="snapshot_numeric_value">{stats.total_correct} <span className="fraction_divider_text">/ {stats.total_done}</span></h2>
            <span className="snapshot_secondary_subtext_label">Puzzles Solved</span>
          </div>
        </div>

        <div className="stats_snapshot_card">
          <span className="snapshot_meta_label">Session Accuracy</span>
          <div className="snapshot_main_value_row">
            <h2 className="snapshot_numeric_value">{overallAccuracy}<span className="percent_sign_text">%</span></h2>
            <div className="snapshot_accuracy_bar_track_wrapper">
              <div className="snapshot_accuracy_bar_fill_line" style={{ width: `${overallAccuracy}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 🕸️ TIER 2: DECOUPLED COMPONENT 2X2 RADAR GRID PANEL */}
      <div className="stats_radar_matrix_2x2_grid">
        <RadarCard title="Multiple Choice" dataSet={stats.radar_charts.multiple_choice} fillCol="#3b82f6" strokeCol="#2563eb" onZoom={() => setZoomedChart({ title: "Multiple Choice", dataSet: stats.radar_charts.multiple_choice, fillCol: "#3b82f6", strokeCol: "#2563eb" })} />
        <RadarCard title="Open Cloze" dataSet={stats.radar_charts.open_cloze} fillCol="#10b981" strokeCol="#059669" onZoom={() => setZoomedChart({ title: "Open Cloze", dataSet: stats.radar_charts.open_cloze, fillCol: "#10b981", strokeCol: "#059669" })} />
        <RadarCard title="Word Formation" dataSet={stats.radar_charts.word_formation} fillCol="#f59e0b" strokeCol="#d97706" onZoom={() => setZoomedChart({ title: "Word Formation", dataSet: stats.radar_charts.word_formation, fillCol: "#f59e0b", strokeCol: "#d97706" })} />
        <RadarCard title="Sentence Cloze" dataSet={stats.radar_charts.sentence_cloze} fillCol="#8b5cf6" strokeCol="#7c3aed" onZoom={() => setZoomedChart({ title: "Sentence Cloze", dataSet: stats.radar_charts.sentence_cloze, fillCol: "#8b5cf6", strokeCol: "#7c3aed" })} />
      </div>

      {/* 📈 TIER 3: THE EVOLUTIONARY CURVE TRACKER */}
      <div className="stats_timeline_chart_full_card">
        <h3 className="timeline_card_main_heading">Historical Proficiency Evolution</h3>
        <p className="timeline_card_sub_heading">Tracks categorical scaling relative to your global rating timeline</p>
        <div style={{ width: '100%', height: '320px', marginTop: '20px' }}>
          <ResponsiveContainer>
            <LineChart data={stats.elo_history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#e2e8f0" tickLine={false} />
              <YAxis domain={['dataMin - 50', 'dataMax + 50']} tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#e2e8f0" tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.85rem', fontWeight: 600 }} />
              <Line type="monotone" dataKey="globalRating" name="Master Elo" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="mcRating" name="Multiple Choice" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="ocRating" name="Open Cloze" stroke="#059669" strokeWidth={2} dot={{ r: 2 }} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="wfRating" name="Word Formation" stroke="#d97706" strokeWidth={2} dot={{ r: 2 }} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="scRating" name="Sentence Cloze" stroke="#7c3aed" strokeWidth={2} dot={{ r: 2 }} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ DECOUPLED HOOK INJECTION: Renders your zoomed radar charts overlay seamlessly with zero formatting conflicts! */}
      {zoomedChart && (
        <ZoomModal
          title={zoomedChart.title}
          dataSet={zoomedChart.dataSet}
          fillCol={zoomedChart.fillCol}
          strokeCol={zoomedChart.strokeCol}
          onClose={() => setZoomedChart(null)}
        />
      )}

    </div>
  );
};

export default StatsView;