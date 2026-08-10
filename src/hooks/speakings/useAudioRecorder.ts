// src/hooks/speakings/useAudioRecorder.ts
// =========================================================================
// HARDLOCKED HARDWARE MEDIA AUDIO RECORDER ENGINE HOOK (V1)
// =========================================================================
import { useState, useEffect, useRef } from 'react';

export const useAudioRecorder = (onTimeLimitReached: (blob: Blob) => void) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up device hardware allocations on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  // 1. Request hardware device capture permissions up-front safely
  const requestMicPermissions = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermissionError(null);
      return true;
    } catch (err) {
      console.error("Microphone hardware access violation:", err);
      setPermissionError("Microphone hardware permission denied. Please allow mic tracks in your browser layout.");
      return false;
    }
  };

  // 2. Start Recording Sequence
  const startRecording = async () => {
    const hasPermission = streamRef.current || (await requestMicPermissions());
    if (!hasPermission || !streamRef.current) return;

    audioChunksRef.current = [];
    setAudioBlob(null);
    setPreviewUrl(null);
    setRecordingSeconds(0);

    // Initialize media engine capturing standard compressed audio payloads
    const options = { mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4' };
    const recorder = new MediaRecorder(streamRef.current, options);
    
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const compiledBlob = new Blob(audioChunksRef.current, { type: options.mimeType });
      setAudioBlob(compiledBlob);
      setPreviewUrl(URL.createObjectURL(compiledBlob));
      
      // Auto-trigger completion hooks if they naturally ran all the way to 60 seconds
      if (recordingSeconds >= 60) {
        onTimeLimitReached(compiledBlob);
      }
    };

    recorder.start();
    setIsRecording(true);

    // ✅ GOAL MET: Strict, continuous interval timer. Zero pause capabilities allowed.
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 59) {
          // Hard cut execution at exactly 60 seconds!
          if (timerRef.current) clearInterval(timerRef.current);
          recorder.stop();
          setIsRecording(false);
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // 3. Absolute Cancellation/Stop Reset macro
  const stopAndResetRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
    setAudioBlob(null);
    setPreviewUrl(null);
  };

  return {
    isRecording,
    recordingSeconds,
    audioBlob,
    previewUrl,
    permissionError,
    startRecording,
    stopAndResetRecording
  };
};