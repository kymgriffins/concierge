"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { Button } from "@/components/ui/button";

type Toast = { id?: string; title?: string; description?: string; type?: "info" | "success" | "error" };

const ToastContext = React.createContext<{ showToast: (t: Toast) => void } | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = (t: Toast) => {
    setToasts((s) => [...s, { id: String(Date.now()), ...t }]);
  };

  const remove = (id: string) => setToasts((s) => s.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <ToastPrimitive.Provider>
        <div className="fixed z-50 right-4 bottom-6 space-y-2">
          {toasts.map(t => (
            <ToastPrimitive.Root key={t.id!} open onOpenChange={() => remove(t.id!)}>
              <ToastPrimitive.Title className="font-medium">{t.title}</ToastPrimitive.Title>
              {t.description && <ToastPrimitive.Description className="text-sm">{t.description}</ToastPrimitive.Description>}
              <div className="mt-2 flex justify-end">
                <Button size="sm" variant="ghost" onClick={() => remove(t.id!)}>Close</Button>
              </div>
            </ToastPrimitive.Root>
          ))}
        </div>
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
