// src/components/comments/CommentsSection.tsx
// =========================================================================
// RECURSIVE DISCOVERY DISCUSSION HARNESS (COMMENTS COMPONENT V1)
// =========================================================================
import React, { useState } from 'react';
import { FaReply, FaRegHeart, FaHeart, FaRegFlag } from 'react-icons/fa';
import { ForumComment, useCreateCommentMutation, useLikeCommentMutation, useCreateFlagMutation } from '../../features/questions/questionApiSlice';
import './commentSection.css';

interface CommentSectionProps {
  commentableId: number;
  commentableType: 'Question' | 'Writing';
  rootComments: ForumComment[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ commentableId, commentableType, rootComments }) => {
  const [rootMessage, setRootMessage] = useState<string>('');
  const [submitComment, { isLoading }] = useCreateCommentMutation();

  const handleRootSubmit = async (e: React.BaseSyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (!rootMessage.trim()) return;

    try {
      await submitComment({ commentableId, commentableType, body: rootMessage.trim() }).unwrap();
      setRootMessage('');
    } catch (err) {
      console.error("Failed to commit root forum post:", err);
    }
  };

  return (
    <div className="global_comments_wrapper_card">
      <h3 className="comment_title">Comments ({rootComments.length})</h3>
      
      <form onSubmit={handleRootSubmit}>
        <div className="form_row">
          <textarea
            value={rootMessage}
            onChange={(e) => setRootMessage(e.target.value)}
            className="comment_input"
            placeholder="Join the discussion..."
          />
          <button className="comment_button" type="submit" disabled={isLoading}>
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      {rootComments.length > 0 && (
        <div className="mt-4">
          <CommentList commentableId={commentableId} commentableType={commentableType} comments={rootComments} />
        </div>
      )}
    </div>
  );
};

interface CommentListProps {
  commentableId: number;
  commentableType: 'Question' | 'Writing';
  comments: ForumComment[];
}

const CommentList: React.FC<CommentListProps> = ({ commentableId, commentableType, comments }) => {
  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="comment_thread">
          <CommentCard commentableId={commentableId} commentableType={commentableType} comment={comment} />
        </div>
      ))}
    </>
  );
};

interface CommentCardProps {
  commentableId: number;
  commentableType: 'Question' | 'Writing';
  comment: ForumComment;
}

const CommentCard: React.FC<CommentCardProps> = ({ commentableId, commentableType, comment }) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [areChildrenHidden, setAreChildrenHidden] = useState<boolean>(false);
  const [isFlagging, setIsFlagging] = useState<boolean>(false);
  const [flagReason, setFlagFlagReason] = useState<string>('');

  const [submitComment, { isLoading: isPostingReply }] = useCreateCommentMutation();
  const [triggerLike] = useLikeCommentMutation();
  const [triggerFlag, { isLoading: isFlaggingApi }] = useCreateFlagMutation();

  const handleReplySubmit = async (e: React.BaseSyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await submitComment({
        commentableId,
        commentableType,
        body: replyText.trim(),
        parentId: comment.id
      }).unwrap();
      setReplyText('');
      setIsReplying(false);
    } catch (err) {
      console.error("Failed to commit downstream child comment reply:", err);
    }
  };

  // ✅ ITEM B: Toggle Comment Liking
  const handleLikeClick = async () => {
    try {
      await triggerLike(comment.id).unwrap();
    } catch (err) {
      console.error("Failed to toggle comment like:", err);
    }
  };

  // ✅ ITEM C: Trigger Offensive Comment Flag Reporting
  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagReason.trim()) return;

    try {
      await triggerFlag({
        commentableId: comment.id,
        commentableType: 'Comment',
        reportType: 'offensive_comment',
        body: flagReason.trim()
      }).unwrap();
      setFlagFlagReason('');
      setIsFlagging(false);
      alert("Comment has been successfully flagged for administrator review.");
    } catch (err) {
      console.error("Failed to submit comment flag report:", err);
    }
  };

  return (
    <div>
      <div className="comment_container">
        
        <div className="comment_header">
          <span className="comment_name">{comment.author}</span>
          <span className="date">{comment.timestamp}</span>
        </div>

        {/* ✅ ITEM D: Text color class name maps to rich charcoal slate (#334155) for visible pop contrast */}
        <div className="message">{comment.body}</div>

        <div className="comment_footer">
          {/* ✅ FIXED: Added type="button" to drop standard HTML form submit hijacking behaviors */}
          <button type="button" className="icon_button" onClick={handleLikeClick}>
            {comment.likesCount > 0 ? <FaHeart style={{ color: '#dc2626' }} /> : <FaRegHeart />}
            <span>{comment.likesCount || 0}</span>
          </button>

          {/* ✅ FIXED: Added type="button" here as well */}
          <button type="button" className="icon_button" onClick={() => setIsReplying(prev => !prev)}>
            <FaReply /> Reply
          </button>

          {/* ✅ FIXED: Added type="button" here as well */}
          <button type="button" className="icon_button" onClick={() => setIsFlagging(prev => !prev)}>
            <FaRegFlag /> Flag
          </button>
        </div>

      </div>

      {/* Flag Report Text Field Box */}
      {isFlagging && (
        <div style={{ marginTop: '10px', marginLeft: '20px' }} className="comment_container">
          <form onSubmit={handleFlagSubmit}>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 6px 0' }}>Report Offensive Content:</p>
            <div className="form_row">
              <input
                type="text"
                value={flagReason}
                onChange={(e) => setFlagFlagReason(e.target.value)}
                className="comment_input"
                style={{ height: '40px' }}
                placeholder="Reason for flagging this post..."
                autoFocus
              />
              <button className="comment_button" type="submit" disabled={isFlaggingApi}>
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {isReplying && (
        <div style={{ marginTop: '10px', marginLeft: '20px' }}>
          <form onSubmit={handleReplySubmit}>
            <div className="form_row">
              <textarea
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="comment_input"
                placeholder={`Reply to ${comment.author}...`}
              />
              <button className="comment_button" type="submit" disabled={isPostingReply}>
                {isPostingReply ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <>
          <div className={`nested_thread ${areChildrenHidden ? 'hide' : ''}`}>
            <button className="collapse_line" onClick={() => setAreChildrenHidden(true)} />
            <div className="nested_comments">
              <CommentList commentableId={commentableId} commentableType={commentableType} comments={comment.replies} />
            </div>
          </div>

          <button
            className={`comment_button ${!areChildrenHidden ? 'hide' : ''}`}
            style={{ marginTop: '5px', padding: '5px 12px', fontSize: '0.85rem' }}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies ({comment.replies.length})
          </button>
        </>
      )}

    </div>
  );
};