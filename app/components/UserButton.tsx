"use client";

import "@/ui/global.css";
import User from "@/ui/icons/user.svg";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const UserButton = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log('ABC data.session', data.session)
      setIsLoggedIn(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => sub?.subscription.unsubscribe();
  }, []);

  async function handleClick() {
    if (isLoggedIn) {
      await supabase.auth.signOut();
      router.replace("/login");
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button type="button" onClick={handleClick} aria-label={isLoggedIn ? "Se déconnecter" : "Se connecter"}>

        <Image src={User} alt="utilisateur" />
        <div className="">{isLoggedIn ? "Se déconnecter" : "Se connecter"}</div>
      </button>
    </div>
  );
};

export default UserButton;
