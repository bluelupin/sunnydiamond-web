"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

type SpeechState = "idle" | "speaking";

const subscribers = new Set<() => void>();
let globalState: SpeechState = "idle";

function setGlobalState(state: SpeechState) {
  globalState = state;
  subscribers.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
}

function getSnapshot() {
  return globalState;
}

function getServerSnapshot() {
  return "idle" as SpeechState;
}

function getSupportedSnapshot() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function getSupportedServerSnapshot() {
  return false;
}

function subscribeToSupported() {
  return () => {};
}

export function useBrowserTextToSpeech(text: string) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isSupported = useSyncExternalStore(
    subscribeToSupported,
    getSupportedSnapshot,
    getSupportedServerSnapshot,
  );

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    window.speechSynthesis.getVoices();
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) {
      return;
    }

    window.speechSynthesis.cancel();
    setGlobalState("idle");
  }, [isSupported]);

  const speak = useCallback(() => {
    const trimmed = text.trim();
    if (!isSupported || !trimmed) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.onend = () => setGlobalState("idle");
    utterance.onerror = () => setGlobalState("idle");

    setGlobalState("speaking");
    window.speechSynthesis.speak(utterance);
  }, [isSupported, text]);

  const toggle = useCallback(() => {
    if (state === "speaking") {
      stop();
      return;
    }

    speak();
  }, [state, speak, stop]);

  useEffect(() => {
    return () => {
      if (globalState === "speaking") {
        window.speechSynthesis?.cancel();
        setGlobalState("idle");
      }
    };
  }, []);

  return {
    isSupported,
    isSpeaking: state === "speaking",
    toggle,
    stop,
  };
}
