import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  stages?: string[];
  currentStageIndex?: number;
  message?: string;
  subtext?: string;
}

const defaultStages = [
  'Understanding your situation...',
  'Extracting relevant factual details...',
  'Cross-referencing statutory authorities...',
  'Finding relevant sources...',
  'Structuring potentially relevant rights...',
  'Preparing your possible pathways...',
];

export const LoadingState: React.FC<LoadingStateProps> = ({
  stages = defaultStages,
  message,
  subtext = 'Please allow a few moments while we organize the legal information framework.',
}) => {
  const [stageIndex, setStageIndex] = useState<number>(0);

  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1 < stages.length ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(interval);
  }, [stages, message]);

  const activeStage = message || stages[stageIndex];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto"
    >
      <div className="relative flex items-center justify-center mb-6">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
        <Loader2 className="absolute h-5 w-5 text-slate-900" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 transition-all duration-300">
        {activeStage}
      </h3>

      <p className="mt-2 text-sm text-slate-500 max-w-sm leading-relaxed">
        {subtext}
      </p>

      {/* Stage indicators */}
      {!message && stages.length > 1 && (
        <div className="mt-6 flex items-center gap-1.5" aria-hidden="true">
          {stages.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= stageIndex ? 'w-6 bg-slate-900' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
