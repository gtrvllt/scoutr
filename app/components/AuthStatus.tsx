"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LogoutButton from "./LogoutButton";

export default function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub?.subscription.unsubscribe();
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      {email ? (
        <>
          <span>Connecté: {email}</span>
          <LogoutButton />
        </>
      ) : (
        <a href="/login" className="underline">Se connecter</a>
      )}
    </div>
  );
}