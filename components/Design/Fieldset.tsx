import { Children } from "react";

interface FieldsetChild {
  type?: {
    __type?: string;
  };
}

const borderColor = "border-zinc-600";
const footerBgColor = "bg-zinc-800";
const footerTextColor = "text-zinc-400";

export default function Fieldset(props: React.PropsWithChildren<unknown>) {
  const children = Children.toArray(props.children);

  const title = children.filter(
    (child) => (child as FieldsetChild)?.type?.__type === Title.__type
  );
  const subtitle = children.filter(
    (child) => (child as FieldsetChild)?.type?.__type === Subtitle.__type
  );
  const footer = children.filter(
    (child) => (child as FieldsetChild)?.type?.__type === Footer.__type
  );

  const regularChildren = children.filter(
    (child) => ![...title, ...subtitle, ...footer].includes(child)
  );

  console.log(children, props.children, title);

  return (
    <div
      className={[
        "flex flex-col overflow-hidden rounded-md border",
        borderColor,
      ].join(" ")}
    >
      <div className="space-y-3 p-6">
        {title}
        {subtitle}
        <div>{regularChildren}</div>
      </div>
      {footer.length > 0 && (
        <div
          className={["border-t px-6 py-3", borderColor, footerBgColor].join(
            " "
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export function Title(props: React.PropsWithChildren<unknown>) {
  return <div className="text-xl font-medium">{props.children}</div>;
}
Title.__type = "Fieldset.Title";

export function Subtitle(props: React.PropsWithChildren<unknown>) {
  return <div className="text-base font-medium">{props.children}</div>;
}
Subtitle.__type = "Fieldset.Subtitle";

export function Footer(props: React.PropsWithChildren<unknown>) {
  const children = Children.toArray(props.children);

  const actions = children.filter(
    (child) => (child as FieldsetChild).type?.__type === FooterActions.__type
  );

  const regularChildren = children.filter(
    (child) => ![...actions].includes(child)
  );
  return (
    <div className={["flex justify-between", footerTextColor].join(" ")}>
      <div>{regularChildren}</div>
      <div>{actions}</div>
    </div>
  );
}
Footer.__type = "Fieldset.Footer";

export function FooterStatus(props: React.PropsWithChildren<unknown>) {
  return <div>{props.children}</div>;
}
FooterStatus.__type = "Fieldset.FooterStatus";

export function FooterActions(props: React.PropsWithChildren<unknown>) {
  return <div className="flex space-x-1">{props.children}</div>;
}
FooterActions.__type = "Fieldset.FooterActions";
