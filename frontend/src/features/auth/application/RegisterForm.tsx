import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRegisterMutation } from "@/features/auth/application/useAuthMutations";
import type { AuthUser } from "@/features/auth/domain/types";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

const formSchema = z
  .object({
    name: z.string().min(1, "名前を入力してください"),
    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "性別を選択してください" })
    }),
    email: z.string().min(1, "メールアドレスを入力してください").email("メールアドレスの形式が正しくありません"),
    password: z.string().min(6, "6文字以上のパスワードを入力してください"),
    confirmPassword: z.string().min(1, "確認用パスワードを入力してください")
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "パスワードが一致しません"
  });

type FormValues = z.infer<typeof formSchema>;

type RegisterFormProps = {
  onSuccess?: (user: AuthUser) => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  const [formError, setFormError] = useState<string>();
  const { mutateAsync, isPending } = useRegisterMutation();

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(undefined);
    try {
      const { confirmPassword: ignoredConfirmPassword, ...payload } = values;
      void ignoredConfirmPassword;
      const user = await mutateAsync(payload);
      onSuccess?.(user);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "ユーザー登録中にエラーが発生しました");
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
        <label className="text-sm font-medium text-slate-100" htmlFor="register-name">
          名前
        </label>
        <input
          id="register-name"
          type="text"
          placeholder="山田 太郎"
          className={inputClass(!!form.formState.errors.name)}
          {...form.register("name")}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-100" htmlFor="register-gender">
          性別
        </label>
        <select
          id="register-gender"
          className={inputClass(!!form.formState.errors.gender)}
          {...form.register("gender")}
        >
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
        {form.formState.errors.gender ? (
          <p className="text-sm text-red-400">{form.formState.errors.gender.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-100" htmlFor="register-email">
          メールアドレス
        </label>
        <input
          id="register-email"
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
        <label className="text-sm font-medium text-slate-100" htmlFor="register-password">
          パスワード
        </label>
        <input
          id="register-password"
          type="password"
          className={inputClass(!!form.formState.errors.password)}
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-100" htmlFor="register-password-confirm">
          パスワード（確認）
        </label>
        <input
          id="register-password-confirm"
          type="password"
          className={inputClass(!!form.formState.errors.confirmPassword)}
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword ? (
          <p className="text-sm text-red-400">{form.formState.errors.confirmPassword.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "登録中..." : "アカウントを作成"}
      </Button>
    </form>
  );
}
