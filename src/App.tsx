/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FileExplorer from "./components/FileExplorer";
import UploadsPopup from "./features/uploads/UploadsPopup";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigationStore } from "./stores/navigationStore";
import { r2Service } from "./services/r2Service";
import { Lock, KeyRound } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AppContent() {
  const { buckets, activeBucketName, setBuckets, setActiveBucketName, theme } =
    useNavigationStore();
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(
    !!localStorage.getItem("r2_access_password"),
  );
  const [passwordInput, setPasswordInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync theme with document class list
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Load buckets on boot
  const {
    data: bucketsData,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["buckets"],
    queryFn: () => r2Service.listBuckets(),
    retry: false,
    enabled: isPasswordValid,
  });

  useEffect(() => {
    if (queryError) {
      localStorage.removeItem("r2_access_password");
      setIsPasswordValid(false);
      setErrorMsg("Sessão expirada ou senha inválida.");
    }
  }, [queryError]);

  useEffect(() => {
    if (bucketsData && bucketsData.length > 0) {
      setBuckets(bucketsData);
      if (!activeBucketName) {
        // Default to the first bucket in the list
        setActiveBucketName(bucketsData[0].name);
      }
    }
  }, [bucketsData, activeBucketName, setBuckets, setActiveBucketName]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setIsVerifying(true);
    setErrorMsg("");

    const success = await r2Service.verifyPassword(passwordInput);
    if (success) {
      localStorage.setItem("r2_access_password", passwordInput);
      setIsPasswordValid(true);
      setErrorMsg("");
      refetch();
    } else {
      setErrorMsg("Senha incorreta. Tente novamente.");
    }
    setIsVerifying(false);
  };

  if (!isPasswordValid) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 font-sans transition-colors relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-7 shadow-2xl flex flex-col items-center gap-5 relative z-10 transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
          <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
            <Lock className="h-5.5 w-5.5 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="text-center flex flex-col gap-1.5">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              R2 Explorer
            </h2>
            <p className="text-xs text-zinc-550 dark:text-zinc-400">
              Insira a senha de acesso para abrir o painel
            </p>
          </div>

          <form onSubmit={handleVerify} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 relative">
              <input
                type="password"
                placeholder="Senha de acesso"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                className="w-full h-10 px-3.5 pr-10 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-hidden focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition-all font-sans"
              />
              <KeyRound className="h-4 w-4 text-zinc-400 dark:text-zinc-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {errorMsg && (
              <span className="text-[11px] font-medium text-red-650 dark:text-red-400 bg-red-50/55 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 px-3 py-1.5 rounded-md text-left">
                {errorMsg}
              </span>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full h-10 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2">
              {isVerifying ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              ) : (
                "Acessar Explorer"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-50/50 dark:bg-zinc-950 flex flex-col font-sans select-none overflow-hidden transition-colors">
      {/* MAIN LAYOUT CANVAS FRAME */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col overflow-hidden">
        <FileExplorer />
      </main>

      {/* Floating Upload popups & queues */}
      <UploadsPopup />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
