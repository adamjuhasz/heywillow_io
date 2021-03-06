interface Props {
  className?: string;
  eyeClassName?: string;
}
export default function WillowLogo({
  eyeClassName = "fill-yellow-400",
  ...props
}: Props) {
  return (
    <svg
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${props.className || ""}`}
    >
      <circle
        cx="301.5"
        cy="300.5"
        r="257.5"
        stroke="currentColor"
        strokeWidth="44"
      />
      <circle cx="371.5" cy="240.5" r="47.5" className={eyeClassName} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M143.562 361C165.697 433.639 228.268 486 302 486C375.732 486 438.303 433.639 460.438 361H401.99C382.754 404.062 343.007 431 302 431C260.993 431 221.246 404.062 202.01 361H143.562Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M213.282 158L136 251.072L178.697 286.525L178.883 286.301L229.078 327.974L264.211 285.657L214.018 243.987L255.979 193.453L213.282 158Z"
        fill="currentColor"
      />
    </svg>
  );
}
