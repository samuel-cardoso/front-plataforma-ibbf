import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, type RegisterFormData } from "@/lib/zod/schemas/authFormSchema";

export function useRegisterForm(t: (key: string) => string) {
  return useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema(t)),
    defaultValues: { email: "", password: "" },
  });
}
