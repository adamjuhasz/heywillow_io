export default function LoadingThread() {
  return (
    <div className="mb-7 flex w-full flex-col">
      <div
        className={[
          "mx-12 h-14 w-56 rounded-2xl px-3 py-3 sm:min-w-[30%] sm:max-w-[60%]",
          "animate-pulse rounded-tl-none bg-zinc-800 text-zinc-50",
        ].join(" ")}
      />
      <div
        className={[
          "mx-12 h-14 w-56 self-end rounded-2xl px-3 py-3 sm:min-w-[30%] sm:max-w-[60%]",
          "animate-pulse rounded-tr-none bg-zinc-800 text-zinc-50",
        ].join(" ")}
      />
      <div
        className={[
          "mx-12 h-14 w-56 rounded-2xl px-3 py-3 sm:min-w-[30%] sm:max-w-[60%]",
          "animate-pulse rounded-tl-none bg-zinc-800 text-zinc-50",
        ].join(" ")}
      />
    </div>
  );
}
