// src/components/chats/chatBubbleWidget/ChatBubbleWidget.tsx
// =========================================================================
// FLOATING APPS WIDGET HELPDESK MESSENGER V1 (DEDICATED NOTIFICATION BADGE)
// =========================================================================
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../hooks/hooks';
import { selectCurrentToken } from '../../../features/auth/authSlice';
import { useGetSupportRoomQuery } from '../../../features/chats/chatsApiSlice';
import { useChatRoom } from '../../../hooks/chats/useChatRoom';
import { MessageSquare, X, Send } from 'lucide-react';
import Badge from '@mui/material/Badge'; // ✅ IMPORT MUI BADGE
import './chatBubbleWidget.css';

export const ChatBubbleWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0); // ✅ TRACK LOCAL WIDGET BADGES
  
  const token = useAppSelector(selectCurrentToken);

  {/* 1. Resolve or generate the 1-on-1 private helpdesk room channel metadata */}
  const { data: roomData, isError: roomError } = useGetSupportRoomQuery(undefined, {
    skip: !token
  });

  const activeRoomId = roomData?.room_id;

  {/* 2. Delegate messaging sync and ActionCable streaming straight to the reusable hook */}
  const {
    messageText,
    setMessageText,
    messages,
    messagesLoading,
    isSending,
    messagesEndRef,
    dispatchMessage
  } = useChatRoom(activeRoomId, isOpen);

  // ✅ REAL-TIME WIDGET UNREAD INTERCEPTOR:
  // Monitors your messages list array cache. If a brand-new message lands from the admin 
  // while the chatbox is closed, it increments the local unread count state natively!
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // If the last message was sent by someone else (the Admin), count it as unread!
      if (!lastMessage.is_me) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  // ✅ INSTANT AUTO-CLEAR LOOP:
  // Wipes the unread counter back down to zero the exact millisecond the chat is opened!
  const handleOpenChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  {/* Security Gate: Skip rendering completely for unauthenticated public guests */}
  if (!token || roomError) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchMessage();
  };

  const adminMessageNode = messages.find(m => m.sender_username !== 'Admin' && !m.is_me);
  const activeAdminName = adminMessageNode?.sender_username || 'Admin';

  return (
    <div className="helpdesk_floating_widget_container">
      
      {/* EXPANDABLE HELPDESK WINDOW FRAME */}
      {isOpen && (
        <div className="helpdesk_chat_card_window shadow">
          
          {/* CONTROL HEADER */}
          <div className="helpdesk_chat_header_ribbon">
            
              <div className="helpdesk_online_status_sparkle_badge"></div>
              <div>
                <h4 className="helpdesk_title_string">{activeAdminName}</h4>
              </div>
            <button 
              type="button" 
              className="helpdesk_close_action_btn" 
              onClick={() => setIsOpen(false)}
              title="Minimize helpdesk panel"
            >
              <X size={16} />
            </button>
          </div>

          {/* MAIN MESSAGE TIMELINE DISPLAY CANVAS */}
          <div className="helpdesk_chat_timeline_canvas">
            {messagesLoading ? (
              <div className="helpdesk_chat_timeline_splash_loading">Retrieving message logs...</div>
            ) : messages.length === 0 ? (
              <div className="helpdesk_chat_timeline_splash_empty">
                👋 Hello! Type a query below to message our academy teachers or platform administrators.
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`helpdesk_message_row_balloon ${msg.is_me ? 'balloon_is_me' : 'balloon_is_them'}`}
                >
                  <div className="helpdesk_balloon_metadata_header_label">
                    {msg.sender_username} • {msg.timestamp}
                  </div>
                  <div className="helpdesk_balloon_text_body_string">
                    {msg.body}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* MESSAGE ENTRY INPUT COMPILER FOOTER FORM */}
          <form onSubmit={handleFormSubmit} className="helpdesk_chat_form_footer_compiler">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message here..."
              maxLength={1000}
              required
              disabled={isSending}
            />
            <button 
              type="submit" 
              className="helpdesk_send_action_submit_btn" 
              disabled={!messageText.trim() || isSending}
              title="Send message"
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}

      {/* FLOATING ACTION TRIGGER ROUND BUBBLE */}
      {/* ✅ FIXED DESIGN MATRIX: Nested inside a Material-UI Badge loop!
          Displays a premium floating unread bubble indicator specifically for helpdesk items 
          whenever the chatbox rests closed in the corner window floor. */}
      {!isOpen && (
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          max={9}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <button 
            type="button" 
            className="helpdesk_floating_trigger_bubble_launcher shadow"
            onClick={handleOpenChat}
            title="Open 1-on-1 support chat"
          >
            <MessageSquare size={22} />
          </button>
        </Badge>
      )}

    </div>
  );
};