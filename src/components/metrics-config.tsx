"use client";

import { useEffect } from "react";
import { configureMetrics } from "@/lib/metrics/client";

/** Diz ao navegador se a medição agregada está ligada (por padrão, não). */
export function MetricsConfig({ enabled }: { enabled: boolean }) {
  useEffect(() => configureMetrics(enabled), [enabled]);
  return null;
}
