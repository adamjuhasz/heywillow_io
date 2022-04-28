interface Props {
  size?: "small" | "normal" | "large";
  shape?: "square" | "circle";
  type?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "alert"
    | "tertiary";

  variant?: "normal" | "shadow" | "ghost";
  loading?: boolean;
  disabled?: boolean;
}

export default function Button(props: React.PropsWithChildren<Props>) {
  let size = "";
  let loadingSize = "";
  let shape = "";
  let color = "";
  let variant = "";

  switch (props.shape) {
    case "circle":
      shape = "aspect-square rounded-full";
      break;

    case "square":
      shape = "aspect-square rounded-md";
      break;

    case undefined:
      shape = "rounded-md";
      break;
  }

  switch (props.shape) {
    case "circle":
    case "square":
      switch (props.size) {
        case "small":
          size = "h-7";
          loadingSize = "h-3 w-3";
          break;

        case undefined:
        case "normal":
          size = "h-11";
          loadingSize = "h-4 w-4";
          break;

        case "large":
          size = "h-16";
          loadingSize = "h-6 w-6";
          break;
      }
      break;

    default:
      switch (props.size) {
        case "small":
          size = "py-1 px-3 h-max";
          loadingSize = "h-3 w-3";
          break;

        case undefined:
        case "normal":
          size = "py-2 px-3 h-max";
          loadingSize = "h-4 w-4";
          break;

        case "large":
          size = "py-4 px-3 h-max";
          loadingSize = "h-6 w-6";
          break;
      }
  }

  switch (props.type) {
    case "alert":
      color = alertColor;
      break;

    case "error":
      color = errorColor;
      break;

    case "secondary":
      color = [secondaryColor, hoverColor].join(" ");
      break;

    case "success":
      color = successColor;
      break;

    case "tertiary":
      color = tertiaryColor;
      break;

    case "warning":
      color = warningColor;
      break;

    case "primary":
    default:
      color = [primaryColor, hoverColor].join(" ");
      break;
  }

  switch (props.variant) {
    case "shadow":
      variant = "hover:-translate-y-1 ";
      break;

    case "ghost":
      switch (props.type) {
        case "alert":
          color = ghostAlertColor;
          break;

        case "error":
          color = ghostErrorColor;
          break;

        case "secondary":
          color = ghostSecondaryColor;
          break;

        case "success":
          color = ghostSuccessColor;
          break;

        case "tertiary":
          color = ghostTertiaryColor;
          break;

        case "warning":
          color = ghostWarningColor;
          break;

        case "primary":
        default:
          color = ghostPrimaryColor;
          break;
      }
      break;

    case "normal":
    default:
      break;
  }

  return (
    <button
      disabled={props.loading || props.disabled}
      className={[
        "flex items-center justify-center border font-normal transition disabled:cursor-not-allowed",
        size,
        shape,
        color,
        variant,
        disabledColor,
      ].join(" ")}
    >
      {props.loading && (
        <Loading className={["mr-1", loadingSize, loadingColor].join(" ")} />
      )}{" "}
      {props.children}
    </button>
  );
}

interface LoadingProps {
  className: string;
}

export function Loading(props: LoadingProps) {
  return (
    <svg
      className={`-ml-1 animate-spin ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

// customize for specific themes
const primaryColor = "border-zinc-100 bg-zinc-100 text-zinc-900";
const hoverColor =
  "hover:bg-transparent hover:text-zinc-100 hover:border-zinc-100";
const secondaryColor = "text-zinc-500 border-zinc-600";
const successColor =
  "border-blue-500 bg-blue-500 text-white hover:bg-transparent hover:text-blue-500";
const errorColor =
  "border-red-600 bg-red-600 text-white hover:bg-transparent hover:text-red-600";
const alertColor =
  "border-pink-600 bg-pink-600 text-white hover:bg-transparent hover:text-pink-600";
const warningColor =
  "border-yellow-500 bg-yellow-500 text-white hover:bg-transparent hover:text-yellow-500";
const tertiaryColor =
  "border-purple-700 bg-purple-700 text-white hover:bg-transparent hover:text-purple-700";
const ghostPrimaryColor =
  "text-zinc-100 hover:bg-zinc-100 hover:bg-opacity-10 border-transparent";
const ghostAlertColor =
  "text-pink-600 hover:bg-pink-600 hover:bg-opacity-20 border-transparent";
const ghostErrorColor =
  "text-red-600 hover:bg-red-600 hover:bg-opacity-20 border-transparent";
const ghostSecondaryColor =
  "text-zinc-500 hover:bg-zinc-100 hover:bg-opacity-20 border-transparent";
const ghostSuccessColor =
  "text-blue-500 hover:bg-blue-500 hover:bg-opacity-20 border-transparent";
const ghostTertiaryColor =
  "text-purple-700 hover:bg-purple-700 hover:bg-opacity-20 border-transparent";
const ghostWarningColor =
  "text-yellow-500 hover:bg-yellow-500 hover:bg-opacity-20 border-transparent";
const disabledColor =
  "disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-700";
const loadingColor = "text-zinc-300";
