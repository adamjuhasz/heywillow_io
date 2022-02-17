export default function WillowLogo(props: { className: string }) {
  return (
    <svg
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${props.className}`}
    >
      <circle
        cx="300"
        cy="300"
        r="255"
        stroke="currentColor"
        strokeWidth="40"
      />
      <circle cx="399" cy="240" r="75" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M111.013 387C143.949 458.426 216.185 508 300 508C383.815 508 456.051 458.426 488.987 387H443.747C414.297 435.556 360.937 468 300 468C239.063 468 185.703 435.556 156.253 387H111.013Z"
        fill="currentColor"
      />
      <rect
        x="214.995"
        y="141"
        width="70"
        height="140"
        transform="rotate(45 214.995 141)"
        fill="currentColor"
      />
      <rect
        x="116"
        y="240"
        width="70"
        height="140"
        transform="rotate(-45 116 240)"
        fill="currentColor"
      />
    </svg>
  );
}
