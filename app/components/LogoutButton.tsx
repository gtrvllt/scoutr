"use client";

import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  async function onClick() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button onClick={onClick} className="px-3 py-1 border rounded">
      Se déconnecter
    </button>
  );
}