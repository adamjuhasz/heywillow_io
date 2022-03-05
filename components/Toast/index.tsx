import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Transition } from "@headlessui/react";
import { addSeconds } from "date-fns";

import useTimeout from "hooks/useTimeout";

type ToastType =
  | { type: "string"; string: string }
  | { type: "error"; string: string }
  | { type: "active"; string: string };

interface ToastTypeStored {
  id: string;
  expiresAt: Date;
  timeout: number;
  toast: ToastType;
}

interface ToastContext {
  addToast: (t: ToastType, timeout?: number) => void;
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
  useEffect(() => {
    const int = setInterval(() => {
      const now = new Date();
      const newToasts = toasts.filter((t) => t.expiresAt > now);
      setToasts(newToasts);
    }, 100);

    return () => {
      clearInterval(int);
    };
  }, [toasts]);

  return (
    <ToastContext.Provider
      value={{
        addToast: (t, timeout = 3000) => {
          setToasts([
            ...toasts,
            {
              toast: t,
              id: `${Math.round(Math.random() * 10000)}`,
              expiresAt: addSeconds(new Date(), timeout / 1000),
              timeout: timeout,
            },
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
          {toasts[0] !== undefined ? (
            <ToastDisplay
              key={toasts[0].id}
              toast={toasts[0]}
              index={Math.min(toasts.length, 3) - 1}
              fanOut={hovering}
            />
          ) : (
            <></>
          )}
          {toasts[1] !== undefined ? (
            <ToastDisplay
              key={toasts[1].id}
              toast={toasts[1]}
              index={Math.min(toasts.length, 3) - 2}
              fanOut={hovering}
            />
          ) : (
            <></>
          )}
          {toasts[2] !== undefined ? (
            <ToastDisplay
              key={toasts[2].id}
              toast={toasts[2]}
              index={Math.min(toasts.length, 3) - 3}
              fanOut={hovering}
            />
          ) : (
            <></>
          )}
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
  const [visible, setVisibility] = useState(true);
  const { removeToast } = useContext(InternalContext);
  useTimeout(() => {
    setVisibility(false);
  }, props.toast.timeout - 500);

  const className = props.fanOut
    ? "mb-2 translate-y-0 scale-100"
    : index === 0
    ? "translate-y-0 scale-100 entered"
    : index === 1
    ? "translate-y-2/4 scale-[.90]"
    : "translate-y-full scale-[0.75]";

  return (
    <Transition
      appear={true}
      show={visible}
      enter="transform ease-in-out"
      enterFrom={index === 0 ? "opacity-0 translate-y-full" : className}
      enterTo={index === 0 ? "opacity-100 translate-y-0" : className}
      entered={className}
      leave="transform ease-in-out"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-full"
      afterLeave={() => {
        removeToast(props.toast.id);
      }}
      className={[
        "min-h-20 right-0 flex w-[420px] items-center justify-start rounded-lg border p-[24px]  transition-all duration-[500ms]",
        props.toast.toast.type === "error"
          ? "border-transparent bg-red-500 text-white shadow-md shadow-red-500/50"
          : props.toast.toast.type === "active"
          ? "border-transparent bg-blue-500 text-white shadow-md shadow-blue-500/50"
          : "border-zinc-600 bg-black text-white shadow-md shadow-black/50",
        className,
      ].join(" ")}
    >
      {props.toast.toast.string} - {index}
    </Transition>
  );
}
