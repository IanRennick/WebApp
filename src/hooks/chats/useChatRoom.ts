// src/hooks/chats/useChatRoom.ts
// =========================================================================
// UNIVERSAL REAL-TIME CHAT ENGINE CORE HANDLER (INSTANT-BOTTOM OPEN FIXED)
// =========================================================================
import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../hooks';
import { selectCurrentToken } from '../../features/auth/authSlice';
import { 
  useGetChatMessagesQuery, 
  useSendChatMessageMutation 
} from '../../features/chats/chatsApiSlice';

export const useChatRoom = (roomId: number | undefined, isWindowOpen: boolean) => {
  const [messageText, setMessageText] = useState<string>('');
  const token = useAppSelector(selectCurrentToken);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // ✅ FIXED UX TRACKER: Keeps tabs on whether the window was just opened
  const wasClosedRef = useRef<boolean>(true);

  // 1. Core Real-Time Cache Sync Query
  const { data: chatData, isLoading: messagesLoading } = useGetChatMessagesQuery(roomId!, {
    skip: !roomId || !token
  });

  const [sendMessage, { isLoading: isSending }] = useSendChatMessageMutation();

  // Reset our window state reference tracker when the user toggles the chat box closed
  useEffect(() => {
    if (!isWindowOpen) {
      wasClosedRef.current = true;
    }
  }, [isWindowOpen]);

  // ✅ FIXED AUTOMATED SCROLL ENGINE:
  // Dynamically switches behaviors to execute an instant jump on load, 
  // but retains a premium smooth glide for new real-time text packets!
  useEffect(() => {
    if (isWindowOpen && chatData?.messages) {
      if (wasClosedRef.current) {
        // 🚀 FIRST OPEN FLASH: Execute a silent, instant hard jump right to the bottom!
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        wasClosedRef.current = false;
      } else {
        // 📡 ACTIVE SESSION STREAM: Glide smoothly down for brand-new incoming lines!
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [chatData?.messages, isWindowOpen]);

  const dispatchMessage = async () => {
    const trimmedText = messageText.trim();
    if (!trimmedText || !roomId || isSending) return;

    try {
      setMessageText('');
      await sendMessage({ roomId, body: trimmedText }).unwrap();
    } catch (err) {
      console.error("Stateless message pipeline dispatch failed:", err);
    }
  };

  return {
    messageText,
    setMessageText,
    messages: chatData?.messages || [],
    messagesLoading: messagesLoading && !!roomId,
    isSending,
    messagesEndRef,
    dispatchMessage
  };
};