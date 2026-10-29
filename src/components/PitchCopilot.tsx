import React from 'react';
import { SihScenario, PersonaRole } from '../types/index.ts';

interface PitchCopilotProps {
  scenarios: SihScenario[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
  onExecuteScenario: (scenario: SihScenario) => void;
  onReset: () => void;
  activeRole: PersonaRole;
}

export const PitchCopilot: React.FC<PitchCopilotProps> = ({
  scenarios,
  currentStepIndex,
  onSelectStep,
  onExecuteScenario,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const currentScenario = scenarios[currentStepIndex];

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 z-40 flex flex-col items-end gap-2">
      {/* Minimized Pill Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-10 px-3.5 rounded-full bg-[#0037b0] text-white shadow-xl flex items-center gap-2 border border-[#cad3ff]/40 hover:bg-[#1d4ed8] transition-all hover:scale-105"
        aria-label="Toggle SIH Jury Pitch Copilot"
      >
        <span className="material-symbols-outlined text-[18px] text-[#ffdcc3] animate-pulse">
          target
        </span>
        <span className="font-['Public_Sans'] text-[12px] font-bold tracking-wider">
          PITCH COPILOT
        </span>
        <span className="font-mono text-[11px] bg-[#1d4ed8] px-2 py-0.5 rounded-full text-white font-semibold">
          {currentStepIndex + 1} / {scenarios.length}
        </span>
        <span className="material-symbols-outlined text-[16px]">
          {isExpanded ? 'expand_more' : 'expand_less'}
        </span>
      </button>

      {/* Expanded Floating Card */}
      {isExpanded && (
        <div className="w-[calc(100vw-2rem)] sm:w-96 rounded-2xl bg-[#213145]/95 text-[#eaf1ff] backdrop-blur-xl shadow-2xl border border-[#747686]/40 p-3.5 transition-all animate-in slide-in-from-bottom-4 duration-200 flex flex-col gap-2.5">
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#747686]/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0037b0] flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-[17px]">military_tech</span>
              </div>
              <div>
                <div className="text-[10px] tracking-wider text-[#b7c4ff] uppercase font-bold font-mono">
                  SIH 2026 Jury Pitch Engine
                </div>
                <div className="text-[11px] text-white font-semibold font-mono">
                  Scenario {currentScenario.step} of {scenarios.length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-[#c4c5d7] hover:text-white p-1 rounded hover:bg-white/10"
                aria-label="Minimize Copilot"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Scenario Details */}
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#0037b0] text-white font-mono font-bold">
                {currentScenario.role}
              </span>
              <span className="text-[10px] text-[#ffdcc3] bg-[#6b3700]/60 px-2 py-0.5 rounded font-mono truncate max-w-[200px]">
                {currentScenario.req}
              </span>
            </div>

            <h4 className="text-[13px] font-bold text-white leading-snug font-['Public_Sans']">
              {currentScenario.title}
            </h4>
            <p className="text-[11px] text-white/80 leading-relaxed">{currentScenario.desc}</p>
          </div>

          {/* Target Metadata */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-black/30 p-2 rounded-lg border border-white/10">
            <div>
              <span className="text-[#c4c5d7] block text-[9px] uppercase">Target Entity</span>
              <span className="font-semibold text-[#b7c4ff] truncate block">
                {currentScenario.entity}
              </span>
            </div>
            <div>
              <span className="text-[#c4c5d7] block text-[9px] uppercase">Test Instrument</span>
              <span className="font-semibold text-white truncate block">{currentScenario.asset}</span>
            </div>
          </div>

          {/* One-Click Action Trigger */}
          <button
            onClick={() => onExecuteScenario(currentScenario)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-['Public_Sans'] text-[13px] font-bold shadow-md flex items-center justify-center gap-1.5 transition-all text-center border border-[#b7c4ff]/30 active:scale-95"
          >
            <span className="material-symbols-outlined text-[17px] text-[#ffdcc3]">
              {currentScenario.actionIcon}
            </span>
            <span>{currentScenario.actionText}</span>
          </button>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between pt-1 border-t border-[#747686]/30 text-[11px]">
            <button
              onClick={() => onSelectStep(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium flex items-center gap-0.5 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              <span>Back</span>
            </button>

            {/* Step Dots */}
            <div className="flex items-center gap-1">
              <button
                onClick={onReset}
                className="px-1.5 py-0.5 rounded text-[#c4c5d7] hover:text-[#ffdcc3] text-[10px] font-mono flex items-center gap-0.5"
                title="Reset Copilot to Step 1"
              >
                <span className="material-symbols-outlined text-[12px]">restart_alt</span>
              </button>
              <div className="flex items-center gap-1">
                {scenarios.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectStep(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentStepIndex
                        ? 'bg-[#b7c4ff] scale-125'
                        : 'bg-white/30 hover:bg-white/60'
                    }`}
                    title={`Go to Scenario ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() =>
                onSelectStep(Math.min(scenarios.length - 1, currentStepIndex + 1))
              }
              disabled={currentStepIndex === scenarios.length - 1}
              className="px-3 py-1 rounded-lg bg-[#0037b0] text-white font-semibold flex items-center gap-0.5 hover:bg-[#1d4ed8] disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-xs"
            >
              <span>Next</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
