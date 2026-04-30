"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STEPS_TEXT = [
  "Analyse de votre profil...",
  "Calcul des besoins en eau...",
  "Évaluation des risques...",
  "Sélection des articles...",
  "Optimisation du poids...",
  "Vérification de la couverture 72h...",
  "Finalisation du kit...",
];

export function ComputingScreen() {
  const [currentText, setCurrentText] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const total = 1800; // ms — matches store timeout
    const interval = total / STEPS_TEXT.length;

    const textTimer = setInterval(() => {
      setCurrentText((prev) =>
        prev < STEPS_TEXT.length - 1 ? prev + 1 : prev
      );
    }, interval);

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (total / 50), 98));
    }, 50);

    return () => {
      clearInterval(textTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6">
      {/* Animated logo pulse */}
      <motion.div
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-full bg-forest flex items-center justify-center mb-12"
      >
        <svg width="28" height="28" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1L9.5 5.5H13L10 8.5L11 13L7 10.5L3 13L4 8.5L1 5.5H4.5L7 1Z"
            fill="#F0EDE8"
            stroke="#F0EDE8"
            strokeWidth="0.3"
          />
        </svg>
      </motion.div>

      {/* Title */}
      <h2 className="font-display font-black text-ink text-3xl md:text-4xl text-center mb-3 tracking-tight">
        Calcul en cours.
      </h2>
      <p className="text-ink-muted text-sm text-center mb-12">
        Notre moteur analyse votre profil.
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-sm mb-6">
        <div className="h-0.5 bg-sand rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-forest rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-mono text-xs text-ink-muted">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Animated step text */}
      <div className="h-5">
        <motion.p
          key={currentText}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-xs text-ink-muted font-mono text-center"
        >
          {STEPS_TEXT[currentText]}
        </motion.p>
      </div>
    </div>
  );
}
