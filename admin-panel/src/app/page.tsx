"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@hooks/useAuth";

export default function IndexPage(): null {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  return null;
}
