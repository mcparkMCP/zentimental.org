"use client";

// Placeholder for future Whisper integration
// Flow: MediaRecorder → /api/transcribe → Whisper → text
export function useVoiceInput() {
  return {
    isListening: false,
    isSupported: false,
    startListening: () => {},
    stopListening: () => {},
    transcript: "",
  };
}
