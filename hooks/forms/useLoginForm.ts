import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, type LoginFormData } from "@/lib/zod/schemas/authFormSchema";

export function useLoginForm(t: (key: string) => string) {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema(t)),
    defaultValues: { email: "", password: "" },
  });
}
