import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/auth";

export default function ConfirmEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
