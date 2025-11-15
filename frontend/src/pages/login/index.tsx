import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginForm } from "@/features/auth/application/LoginForm";
import { RegisterForm } from "@/features/auth/application/RegisterForm";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/");
  };

  const toggleClass = (current: Mode) =>
    cn(
      "rounded-md px-4 py-2 text-sm font-semibold transition-colors",
      mode === current ? "bg-brand-600 text-white" : "text-slate-400 hover:text-slate-200"
    );

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-md">
        <Card className="shadow-xl shadow-black/40">
          <header className="mb-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">daily-stock</p>
            <h1 className="mt-2 text-2xl font-bold text-white">
              {mode === "login" ? "ログイン" : "アカウント登録"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {mode === "login"
                ? "登録済みのメールアドレスでサインインしてください。"
                : "必要事項を入力してアカウントを作成します。"}
            </p>
          </header>

          <div className="mb-6 grid grid-cols-2 gap-3 bg-slate-900 p-1">
            <button type="button" className={toggleClass("login")} onClick={() => setMode("login")}>
              ログイン
            </button>
            <button
              type="button"
              className={toggleClass("register")}
              onClick={() => setMode("register")}
            >
              新規登録
            </button>
          </div>

          {mode === "login" ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} />
          )}
        </Card>
      </div>
    </div>
  );
}
