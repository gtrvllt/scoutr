"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const hasSession = !!data.session;
      if (!hasSession) router.replace("/login");
      setChecking(false);
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return <div className="p-4 text-sm text-gray-500">Vérification de la session…</div>;
  }

  return <>{children}</>;
}
