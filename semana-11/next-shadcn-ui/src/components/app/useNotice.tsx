"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SuccessAlert } from "./FormParts";

// Mensaje de confirmación que aparece arriba de cada pestaña y se oculta solo a los 4 segundos
export function useNotice() {
  const [message, setMessage] = useState("");
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((text: string) => {
    window.clearTimeout(timer.current);
    setMessage(text);
    timer.current = window.setTimeout(() => setMessage(""), 4000);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { notice: <SuccessAlert message={message} />, show };
}
