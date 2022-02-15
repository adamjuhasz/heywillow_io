interface Props {
  actions: { text: string }[];
}

export default function ActionBox(props: Props) {
  return (
    <div>
      {props.actions.map((a, idx) => (
        <div key={`${a.text}-${idx}`}>
          <div className="flex items-center">
            <div className="relative mr-2 h-2 w-2 rounded-full bg-slate-300">
              {idx !== 0 ? (
                <div className="rounder-full absolute -top-4 left-[3px] h-[16px] w-[2px] bg-slate-300" />
              ) : (
                <></>
              )}
            </div>
            <div className="text-sm text-slate-400">{a.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
