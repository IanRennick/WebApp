// src/features/submissions/submissionsApiSlice.ts
// =========================================================================
// TEXT ESSAY SUBMISSION & AUTO-SAVE DATA CHANNEL (SUBMISSIONS API SLICE)
// =========================================================================
import { apiSlice } from '../../app/api/apiSlice';
import { SubmissionPayloadNode } from '../prompts/promptsApiSlice';

export interface CreateSubmissionArgs {
  prompt_id: number;
  student_payload: string;
  status: 'draft' | 'submitted';
}

export interface UpdateSubmissionArgs {
  id: number;
  student_payload: string;
  status: 'draft' | 'submitted';
}

export const submissionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌐 GET /api/v1/submissions -> Pulls down user's history list
    getUserSubmissionsList: builder.query<SubmissionPayloadNode[], void>({
      query: () => ({
        url: '/submissions',
        method: 'GET',
      }),
      providesTags: ['Submission' as any],
    }),

    // 🌐 GET /api/v1/submissions/:id -> Pulls down single focused essay + comments
    getSingleSubmissionDetails: builder.query<SubmissionPayloadNode, number>({
      query: (id) => ({
        url: `/submissions/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Submission' as any, id }],
    }),

    // 🌐 POST /api/v1/submissions -> Initializes a brand new draft or entry submission
    createNewSubmission: builder.mutation<{ message: string; id: number }, CreateSubmissionArgs>({
      query: (body) => ({
        url: '/submissions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Submission' as any],
    }),

    // 🌐 PATCH /api/v1/submissions/:id -> Autosaves running drafts seamlessly
    updateExistingSubmission: builder.mutation<{ message: string }, UpdateSubmissionArgs>({
      query: ({ id, ...body }) => ({
        url: `/submissions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Submission' as any, id }, 'Submission' as any],
    }),
  }),
});

export const {
  useGetUserSubmissionsListQuery,
  useGetSingleSubmissionDetailsQuery,
  useCreateNewSubmissionMutation,
  useUpdateExistingSubmissionMutation,
} = submissionsApiSlice;