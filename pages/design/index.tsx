import Link from "next/link";

export default function DesignPatterns() {
  return (
    <div className="flex flex-col space-y-10">
      <Link href={"/design/redacted"}>
        <a>Redacted</a>
      </Link>

      <Link href={"/design/toast"}>
        <a>Toast</a>
      </Link>
    </div>
  );
}
