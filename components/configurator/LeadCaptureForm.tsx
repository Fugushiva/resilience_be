"use client";

import { useState, useRef } from "react";
import { captureLead } from "@/lib/supabase/actions";

interface LeadCaptureFormProps {
  kitId?: string | null;
  source?: string;
}

/**
 * Email capture form with GDPR consent checkbox.
 * Submits via Server Action (captureLead).
 */
export function LeadCaptureForm({
  kitId,
  source = "kit_result",
}: LeadCaptureFormProps) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    setErrorMsg("");

    // Add hidden fields
    if (kitId) formData.set("kit_id", kitId);
    formData.set("source", source);

    const result = await captureLead(formData);

    if (result.success) {
      setStatus("success");
      formRef.current?.reset();
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Erreur inconnue");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-forest/5 border border-forest/20 rounded-xl px-5 py-4 text-center">
        <p className="text-sm font-medium text-forest">
          Merci ! Vous recevrez nos conseils de préparation.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="votre@email.be"
          autoComplete="email"
          disabled={status === "submitting"}
          className="flex-1 px-4 py-3 rounded-full border border-sand-dark/40 bg-white text-sm text-ink placeholder:text-ink-muted/40 focus:outline-none focus:border-forest/60 focus:ring-1 focus:ring-forest/20 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-6 py-3 bg-forest text-paper rounded-full text-sm font-medium hover:bg-forest-mid transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {status === "submitting" ? "Envoi..." : "Recevoir le guide"}
        </button>
      </div>

      {/* GDPR consent */}
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="consent"
          value="true"
          required
          className="mt-0.5 w-4 h-4 rounded border-sand-dark/40 text-forest focus:ring-forest/20"
        />
        <span className="text-xs text-ink-muted leading-relaxed">
          J'accepte de recevoir des emails de Survikit. Vous pouvez vous
          désinscrire à tout moment. Conforme au RGPD.{" "}
          <a href="/privacy" className="underline hover:text-forest">
            Politique de confidentialité
          </a>
        </span>
      </label>

      {status === "error" && (
        <p className="text-xs text-red-600" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
