import { WORKFLOW_STEPS, type WorkflowStepId } from "@/lib/types";

export function ResultPanel({
  activeStep,
  completedSteps,
  onSelectStep,
}: {
  activeStep: WorkflowStepId;
  completedSteps: Set<WorkflowStepId>;
  onSelectStep: (id: WorkflowStepId) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gold/10">
        <h2 className="text-base font-display font-bold uppercase tracking-[0.4em] text-gold/90 text-emboss">
          Workflow
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {WORKFLOW_STEPS.map((step) => {
          const active = step.id === activeStep;
          const done = completedSteps.has(step.id);
          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`text-left rounded-lg px-3 py-2.5 text-[13px] tracking-wide transition-colors ${
                active
                  ? "bg-gold/15 text-gold-bright border border-gold/30"
                  : done
                    ? "text-ink/75 hover:bg-white/5 border border-transparent"
                    : "text-faint hover:bg-white/5 border border-transparent"
              }`}
            >
              {step.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
