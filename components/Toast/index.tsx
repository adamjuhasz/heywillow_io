import { PropsWithChildren, createContext, useContext, useState } from "react";

import useTimeout from "hooks/useTimeout";

type ToastType = { type: "string"; string: string };

interface ToastTypeStored extends ToastType {
  id: string;
}

interface ToastContext {
  addToast: (t: ToastType) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ToastContext = createContext<ToastContext>(undefined as any);
export default ToastContext;

interface InternalContext {
  removeToast: (id: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InternalContext = createContext<InternalContext>(undefined as any);

export function ToastProvider(props: PropsWithChildren<unknown>): JSX.Element {
  const [toasts, setToasts] = useState<ToastTypeStored[]>([]);
  const [hovering, setHovering] = useState(false);

  return (
    <ToastContext.Provider
      value={{
        addToast: (t) => {
          setToasts([
            ...toasts,
            { ...t, id: `${Math.round(Math.random() * 10000)}` },
          ]);

          return;
        },
      }}
    >
      {props.children}
      <InternalContext.Provider
        value={{
          removeToast: (id) => {
            setToasts([...toasts].filter((t) => t.id !== id));
          },
        }}
      >
        <div
          className="fixed bottom-4 right-4 h-fit"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {toasts.slice(-3).map((t, idx, arr) => (
            <ToastDisplay
              key={t.id}
              index={arr.length - 1 - idx}
              toast={t}
              fanOut={hovering}
            />
          ))}
        </div>
      </InternalContext.Provider>
    </ToastContext.Provider>
  );
}

interface ToastDisplayProps {
  toast: ToastTypeStored;
  index: number;
  fanOut: boolean;
}

function ToastDisplay({ index, ...props }: ToastDisplayProps) {
  const { removeToast } = useContext(InternalContext);
  useTimeout(() => {
    removeToast(props.toast.id);
  }, 3000);

  return (
    <div
      className={[
        "min-h-20 right-0 flex w-[420px] items-center justify-center rounded-lg border border-zinc-600 bg-black p-[24px] text-white",
        props.fanOut
          ? "mb-4"
          : index === 0
          ? "bottom-0 scale-100"
          : index === 1
          ? "-mb-[30px] scale-[.90]"
          : "-mb-[40px] scale-[0.75]",
      ].join(" ")}
    >
      {props.toast.string} - {index}
    </div>
  );
}
