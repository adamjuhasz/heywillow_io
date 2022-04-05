import { formatDistanceToNow } from "date-fns";

import CustomerTraitValue from "components/Customer/traits/Value";
import { CustomerEventNode } from "components/Thread/Feed/Types";

export interface MiniEventNode {
  action: CustomerEventNode["action"];
  properties: CustomerEventNode["properties"];
  createdAt: CustomerEventNode["createdAt"];
}

interface Props {
  node: MiniEventNode;
}

export default function Event({ node }: Props) {
  return (
    <div className="flex items-center text-xs text-zinc-500">
      <div className="mr-1 shrink-0 text-zinc-100">
        <span className="font-mono font-semibold">{node.action}</span>
      </div>
      {node.properties === null ? (
        <></>
      ) : (
        <CustomerTraitValue
          value={node.properties}
          className="break-all text-zinc-100 line-clamp-1"
        />
      )}
      <div className="ml-1 shrink-0">
        •{" "}
        {formatDistanceToNow(new Date(node.createdAt), {
          addSuffix: true,
        })}
      </div>
    </div>
  );
}
