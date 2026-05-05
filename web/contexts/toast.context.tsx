import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { Toast, ToastKind } from "components/Toast";

interface ActiveToast {
  id: number;
  kind: ToastKind;
  msg: string;
}

interface IToastContext {
  showToast: (kind: ToastKind, msg: string) => void;
}

const ToastContext = createContext<IToastContext>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveToast | null>(null);

  const showToast = useCallback((kind: ToastKind, msg: string) => {
    setActive({ id: Date.now(), kind, msg });
  }, []);

  const dismiss = useCallback(() => {
    setActive(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {active && (
        <Toast
          key={active.id}
          kind={active.kind}
          msg={active.msg}
          onDone={dismiss}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
