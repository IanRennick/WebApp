import { apiSlice } from '../../app/api/apiSlice';

export interface ForumComment {
  id: number;
  parent_id: number | null;
  author: string;
  body: string;
  timestamp: string;
  likesCount: number; // ✅ NEW: Total votes counter track
  replies: ForumComment[];
}

export interface QuestionData {
  id: number;
  level: string;        
  kind: number;         
  subtype: number | null;
  main: string;         
  tags: string[];       
  comments: ForumComment[]; 
  options?: string[];   
  keyword?: string;     
  prompt?: string;      
  rating?: number;
}

interface QuestionQueryParams {
  mode?: string;    
  kind?: string;    
  level?: string;   
  tag?: string;     
  id?: number | null;
}

interface CreateCommentPayload {
  commentableId: number;        
  commentableType: string;      
  body: string;                 
  parentId?: number | null;     
}

interface CreateFlagPayload {
  commentableId: number;
  commentableType: 'Question' | 'Writing' | 'Comment';
  reportType: 'typo' | 'bad_cloze' | 'structural_bug' | 'offensive_comment';
  body: string;
}

export interface SubmissionResult {
  score: number;
  fully_correct: boolean;
  correct_answers: string[];
  user_new_rating: number;
  elo_change: number;
  already_solved: boolean;
  // ✅ NEW: Extended Rails Evaluator Service Parameters
  question_new_rating: number;
  category_kind_rating: number;
  category_subtype_rating: number;
}

export const questionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    getRandomQuestion: builder.query<QuestionData, QuestionQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.id) searchParams.append('id', params.id.toString());
        if (params.mode) searchParams.append('mode', params.mode);
        if (params.kind) searchParams.append('kind', params.kind);
        if (params.level) searchParams.append('level', params.level);
        if (params.tag) searchParams.append('tag', params.tag);

        return {
          url: `/questions/random?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: [{ type: 'Puzzle' as const }]
    }),

    submitAnswer: builder.mutation<SubmissionResult, { id: number; answer: string; mode: string }>({
      query: ({ id, answer, mode }) => ({
        url: `/questions/${id}/submit_answer`,
        method: 'POST',
        body: { answer, mode }
      }),
      invalidatesTags: [{ type: 'Puzzle' as const }]
    }),

    createComment: builder.mutation<any, CreateCommentPayload>({
      query: ({ commentableId, commentableType, body, parentId }) => ({
        url: '/comments',
        method: 'POST',
        body: {
          commentable_id: commentableId,
          commentable_type: commentableType,
          comment: { body },
          parent_id: parentId
        }
      }),
      invalidatesTags: [{ type: 'Puzzle' as const }]
    }),

    // Polymorphic Comment Liking Endpoint Mutation Node
    likeComment: builder.mutation<{ liked: boolean; like_count: number }, number>({
      query: (commentId) => ({
        url: `/comments/${commentId}/like`,
        method: 'POST'
      }),
      invalidatesTags: [{ type: 'Puzzle' as const }]
    }),

    // Polymorphic Content Flag Logging Endpoint Mutation Node
    createFlag: builder.mutation<{ message: string; id: number }, CreateFlagPayload>({
      query: (flagData) => ({
        url: '/flags',
        method: 'POST',
        body: {
          commentable_id: flagData.commentableId,
          commentable_type: flagData.commentableType,
          report_type: flagData.reportType,
          body: flagData.body
        }
      })
    }),

    // Extracts the batch array deck of historical missed question nodes
    getReviewQueue: builder.query<QuestionData[], void>({
      query: () => ({
        url: '/questions/review_queue', // Maps directly to your upcoming Rails route array
        method: 'GET'
      }),
      providesTags: [{ type: 'Puzzle' as const }]
    }),

  }),
});

export const { 
  useGetRandomQuestionQuery,
  useSubmitAnswerMutation,
  useCreateCommentMutation,
  useLikeCommentMutation,
  useCreateFlagMutation,
  useGetReviewQueueQuery
} = questionApiSlice;