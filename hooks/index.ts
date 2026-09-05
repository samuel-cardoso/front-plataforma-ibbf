// Barrel único de hooks. O resto do app deve importar SEMPRE de "@/hooks",
// nunca das libs diretamente (React, React Hook Form, TanStack Query, next/navigation,
// next-themes) nem dos arquivos internos de hooks/api, hooks/forms, hooks/ui, hooks/i18n —
// isso mantém um único ponto para trocar implementação sem reescrever imports no app inteiro.

export {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
  useReducer,
  useLayoutEffect,
  useId,
  useTransition,
  useOptimistic,
  useActionState,
  type ReactNode,
  type ComponentProps,
} from "react";
export * from "react-hook-form";
export * from "@tanstack/react-query";
export * from "next/navigation";
export * from "next-themes";

export * from "./api";
export * from "./forms";
export * from "./ui";
export * from "./i18n";
