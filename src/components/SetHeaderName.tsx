"use client";
import { useHeaderName, useSetHeaderName } from "@/hooks/useHeaderName";
import { useEffect } from "react";

export default function SetHeaderName({ name }: { name: string }) {
  const headerName = useHeaderName();
  const setHeaderName = useSetHeaderName();
  useEffect(() => {
    if (headerName !== name) {
      setHeaderName(name);
    }
  }, [name, headerName]);

  return null;
}
