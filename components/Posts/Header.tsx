export default function PostHeader(props: React.PropsWithChildren<unknown>) {
  return (
    <div className=" border-b border-t border-zinc-600 bg-black px-2 pt-10 pb-10 text-3xl lg:px-0">
      <div className="mx-auto flex max-w-4xl flex-col">{props.children}</div>
    </div>
  );
}
