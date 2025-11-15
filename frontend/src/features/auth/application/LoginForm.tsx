import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useLoginMutation } from "@/features/auth/application/useAuthMutations";
import type { AuthUser } from "@/features/auth/domain/types";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

const formSchema = z.object({
  email: z.string().min(1, "メールアドレスを入力してください").email("メールアドレスの形式が正しくありません"),
  password: z.string().min(1, "パスワードを入力してください")
});

type FormValues = z.infer<typeof formSchema>;

type LoginFormProps = {
  onSuccess?: (user: AuthUser) => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" }
  });
  const [formError, setFormError] = useState<string>();
  const { mutateAsync, isPending } = useLoginMutation();

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(undefined);
    try {
      const user = await mutateAsync(values);
      onSuccess?.(user);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "ログイン処理中にエラーが発生しました");
    }
  });

  const inputClass = (hasError?: boolean) =>
    cn(
      "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-400",
      hasError && "border-red-500 focus-visible:outline-red-500"
    );

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      {formError ? (
        <div className="rounded-lg border border-red-500 bg-red-950/50 px-3 py-2 text-sm text-red-100">{formError}</div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-100" htmlFor="login-email">
          メールアドレス
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          className={inputClass(!!form.formState.errors.email)}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-100" htmlFor="login-password">
          パスワード
        </label>
        <input
          id="login-password"
          type="password"
          className={inputClass(!!form.formState.errors.password)}
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "ログイン中..." : "ログイン"}
      </Button>
    </form>
  );
}
