"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useConfiguratorStore, STEP_ORDER } from "@/lib/kit/store";
import { STEPS } from "@/lib/kit/types";
import { StepFoyer } from "./steps/StepFoyer";
import { StepLogement } from "./steps/StepLogement";
import { StepScenario } from "./steps/StepScenario";
import { StepSante } from "./steps/StepSante";
import { StepAutonomie } from "./steps/StepAutonomie";
import { ComputingScreen } from "./ComputingScreen";
import { useRouter } from "next/navigation";

const STEP_COMPONENTS = {
  foyer: StepFoyer,
  logement: StepLogement,
  scenario: StepScenario,
  sante: StepSante,
  autonomie: StepAutonomie,
};

export function ConfiguratorShell() {
  const { currentStep, isComputing, result } = useConfiguratorStore();
  const router = useRouter();
  const currentStepData = STEPS.find((s) => s.id === currentStep)!;
  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep];

  // Redirect to result if computed
  if (result) {
    router.push("/kit");
    return null;
  }

  if (isComputing) {
    return <ComputingScreen />;
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-0.5 bg-sand">
        <motion.div
          className="h-full bg-forest"
          animate={{ width: `${(currentStepData.progress / 5) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Step counter */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
        <span className="font-mono text-xs text-ink-muted tabular-nums">
          {String(currentStepData.progress).padStart(2, "0")} /{" "}
          {String(STEPS.length).padStart(2, "0")}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col pt-24 pb-20 px-6 md:px-12 max-w-2xl mx-auto w-full">
        {/* Step title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep + "-header"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <p className="text-label text-ink-muted mb-2">
              {currentStepData.subtitle}
            </p>
            <h1 className="font-display font-black text-ink text-[clamp(2rem,5vw,3.5rem)] leading-tight tracking-tight">
              {currentStepData.title}
            </h1>
          </motion.div>
        </AnimatePresence>

        {/* Step body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1"
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40">
        {STEP_ORDER.map((step, i) => (
          <div
            key={step}
            className={`rounded-full transition-all duration-300 ${
              i === stepIndex
                ? "w-4 h-1.5 bg-forest"
                : i < stepIndex
                ? "w-1.5 h-1.5 bg-forest/40"
                : "w-1.5 h-1.5 bg-sand-dark/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
