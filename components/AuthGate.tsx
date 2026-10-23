"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiUrl } from "@/lib/apiUrl";
import { authHeaders } from "@/lib/authClient";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const protectedPath = ["/profile", "/quiz", "/analyzing"].some((path) =>
    pathname.startsWith(path),
  );
  const [allowed, setAllowed] = useState(!protectedPath);

  useEffect(() => {
    if (!protectedPath) {
      setAllowed(true);
      return;
    }
    const controller = new AbortController();
    setAllowed(false);
    fetch(apiUrl("/api/auth/me"), {
      credentials: "include",
      headers: authHeaders(),
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.loggedIn) setAllowed(true);
        else router.replace("/");
      })
      .catch((error) => {
        if (error?.name !== "AbortError") router.replace("/");
      });
    return () => controller.abort();
  }, [pathname, protectedPath, router]);

  if (protectedPath && !allowed) {
    return (
      <div className="ait-screen flex items-center justify-center px-6 text-center">
        <p className="text-sm text-[#8B7A8E]">로그인 상태를 확인하고 있어요...</p>
      </div>
    );
  }
  return children;
}
