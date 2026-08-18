// src/features/prompts/promptsApiSlice.ts
// =========================================================================
// CURRICULUM PROMPTS SEARCH DATA FILTER GATEWAY (PROMPTS API SLICE)
// =========================================================================
import { apiSlice } from '../../app/api/apiSlice';

export interface ExamPromptNode {
  id: number;
  level: string;
  prompt_type: 'writing' | 'speaking';
  title: string;
  topic: string;
  attempts_count: number;
  situation: string;
  word_count: string;
  bullet_points: string[];
  instructions: string[];
  assignment_type: 'essay' | 'review' | 'report' | 'article' | 'letter';
  question?: string;
  photo_url: string | null;
}

export interface SubmissionPayloadNode {
  id: number;
  prompt_id: number; 
  prompt_title: string;
  prompt_type: 'writing' | 'speaking';
  prompt_photo_url?: string | null; 
  status: 'draft' | 'submitted' | 'corrected';
  student_payload: string;
  audio_url?: string | null; 
  final_result: number | null;
  scores: Record<string, number>;
  teacher_feedback_html: string | null;
  corrector_name: string | null;
  timestamp: string;
}

export const promptsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/prompts?type=writing&level=B2 -> Pulls down available tasks
    getExamPromptsList: builder.query<ExamPromptNode[], { type: string; level?: string }>({
      query: (params) => ({
        url: '/prompts',
        method: 'GET',
        params,
      }),
    }),
    
    // GET /api/v1/prompts/:id -> Pulls down single focused prompt specs
    getSingleExamPrompt: builder.query<ExamPromptNode, number>({
      query: (id) => ({
        url: `/prompts/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetExamPromptsListQuery, useGetSingleExamPromptQuery } = promptsApiSlice;