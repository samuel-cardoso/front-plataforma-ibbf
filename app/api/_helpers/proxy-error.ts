import { NextResponse } from "next/server";
import { BackendHttpError } from "@/infra/api/config/backend-client";

export function handleProxyError(error: unknown) {
  if (error instanceof BackendHttpError) {
    return NextResponse.json(
      { success: false, code: error.code, message: error.message },
      { status: error.status }
    );
  }

  console.error("[BFF] Erro inesperado numa rota de API:", error);

  return NextResponse.json(
    { success: false, code: "INTERNAL_ERROR", message: "Ocorreu um erro inesperado." },
    { status: 500 }
  );
}
