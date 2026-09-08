import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormData,
} from "@/lib/zod/schemas/authFormSchema";

export function useForgotPasswordForm(t: (key: string) => string) {
  return useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema(t)),
    defaultValues: { email: "" },
  });
}
