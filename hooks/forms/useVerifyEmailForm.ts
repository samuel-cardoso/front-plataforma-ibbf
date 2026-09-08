import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyEmailFormSchema,
  type VerifyEmailFormData,
} from "@/lib/zod/schemas/authFormSchema";

export function useVerifyEmailForm(
  t: (key: string) => string,
  defaultEmail = "",
  defaultCode = ""
) {
  return useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailFormSchema(t)),
    defaultValues: { email: defaultEmail, code: defaultCode },
  });
}
