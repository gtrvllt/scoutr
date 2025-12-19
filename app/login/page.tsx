"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function signInWithGoogle() {
    try {
      setLoading(true);
      setErrorMsg(null);
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      // Redirection gérée par Supabase vers Google puis retour /auth/callback
    } catch (err: any) {
      setErrorMsg(err?.message || "Une erreur est survenue");
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 360, margin: "40px auto", textAlign: "center" }}>
      <h1>Connexion</h1>
      {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}
      <button type="button" onClick={signInWithGoogle} disabled={loading} style={{ marginTop: 12 }}>
        {loading ? "Redirection…" : "Continuer avec Google"}
      </button>
      <p style={{ marginTop: 16, fontSize: 12, color: "#666" }}>
        Nous ajouterons l’email/mot de passe plus tard.
      </p>
    </main>
  );
}