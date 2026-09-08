import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormData,
} from "@/lib/zod/schemas/authFormSchema";

export function useResetPasswordForm(
  t: (key: string) => string,
  defaultEmail = "",
  defaultCode = ""
) {
  return useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema(t)),
    defaultValues: { email: defaultEmail, code: defaultCode, newPassword: "", confirmPassword: "" },
  });
}
