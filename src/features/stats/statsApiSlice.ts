// src/features/stats/statsApiSlice.ts
// =========================================================================
// PERFORMANCE ANALYTICS DATA FETCHING GATEWAY (STATS API SLICE)
// =========================================================================
import { apiSlice } from '../../app/api/apiSlice';

export interface RadarDataNode {
  subject: string;
  rating: number;
  done: number;
  correct: number;
}

export interface HistoricalSnapshotNode {
  date: string;
  globalRating: number;
  mcRating: number;
  ocRating: number;
  wfRating: number;
  scRating: number;
}

export interface CategoryVolumeMeta {
  done: number;
  correct: number;
  rating: number;
}

export interface DashboardStatsResponse {
  global_rating: number;
  daily_delta: number;
  total_done: number;
  total_correct: number;
  elo_history: HistoricalSnapshotNode[];
  puzzle_types: Record<string, CategoryVolumeMeta>;
  radar_charts: {
    multiple_choice: RadarDataNode[];
    open_cloze: RadarDataNode[];
    word_formation: RadarDataNode[];
    sentence_cloze: RadarDataNode[];
  };
  tags: Record<string, any>;
}

export const statsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET /api/v1/stats -> Fetches pre-sorted analytics and radar structures
    getUserPerformanceStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: '/stats',
        method: 'GET',
      }),
      // Re-fetches fresh numbers whenever they finish an exercise puzzle cycle
      providesTags: ['Puzzle' as any] 
    }),
  }),
});

export const { useGetUserPerformanceStatsQuery } = statsApiSlice;