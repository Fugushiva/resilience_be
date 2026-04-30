"use client";

interface StepNavProps {
  onNext: () => void;
  onPrev?: () => void;
  nextLabel?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export function StepNav({
  onNext,
  onPrev,
  nextLabel = "Continuer →",
  isFirst,
  isLast,
}: StepNavProps) {
  return (
    <div className="flex items-center gap-4 mt-6 pt-6 border-t border-sand/40">
      {!isFirst && onPrev && (
        <button
          onClick={onPrev}
          className="px-5 py-3 rounded-full border border-sand-dark/60 text-sm font-medium text-ink-muted hover:border-forest/40 hover:text-forest transition-colors duration-200"
        >
          ← Retour
        </button>
      )}
      <button
        onClick={onNext}
        className={`flex-1 md:flex-none md:w-auto px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-300 ${
          isLast
            ? "bg-forest text-paper hover:bg-forest-mid"
            : "bg-night text-paper hover:bg-ink/80"
        }`}
      >
        {nextLabel}
      </button>
    </div>
  );
}
