import { useState, useEffect, useRef, useCallback } from 'react';
import { AlgorithmStep, AnimationSpeed } from '../types';

interface UseAnimationReturn {
  currentStepIndex: number;
  isPlaying: boolean;
  speed: AnimationSpeed;
  currentStep: AlgorithmStep | null;
  totalSteps: number;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  restart: () => void;
  jumpToStep: (index: number) => void;
  setSpeed: (speed: AnimationSpeed) => void;
  progress: number;
}

export function useAnimation(steps: AlgorithmStep[]): UseAnimationReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<AnimationSpeed>(1);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const totalSteps = steps.length;

  const intervalMs = (speed: AnimationSpeed) => 1200 / speed;

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= intervalMs(speed)) {
        lastTimeRef.current = timestamp;
        setCurrentStepIndex(prev => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    },
    [speed, totalSteps]
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, animate]);

  // Stop playing when steps change (algorithm reset)
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    lastTimeRef.current = 0;
  }, [steps]);

  const play = useCallback(() => {
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [currentStepIndex, totalSteps]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const restart = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    lastTimeRef.current = 0;
  }, []);

  const jumpToStep = useCallback(
    (index: number) => {
      setIsPlaying(false);
      setCurrentStepIndex(Math.max(0, Math.min(index, totalSteps - 1)));
    },
    [totalSteps]
  );

  const currentStep = steps.length > 0 ? steps[currentStepIndex] ?? null : null;
  const progress = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return {
    currentStepIndex,
    isPlaying,
    speed,
    currentStep,
    totalSteps,
    play,
    pause,
    stepForward,
    stepBackward,
    restart,
    jumpToStep,
    setSpeed,
    progress,
  };
}
