import { formatDistanceToNow } from "date-fns";

import CustomerTraitValue from "components/Customer/traits/Value";
import { CustomerTraitNode } from "components/Thread/Feed/Types";

interface MiniTraitNode {
  key: CustomerTraitNode["key"];
  value: CustomerTraitNode["value"];
  createdAt: CustomerTraitNode["createdAt"];
}

interface Props {
  node: MiniTraitNode;
}

export default function TraitChange({ node }: Props) {
  return (
    <div className="flex items-center text-xs text-zinc-500">
      <div className="mr-1 shrink-0 text-zinc-100">
        <span className="font-mono font-semibold ">{node.key}</span> changed to
      </div>
      {node.value === null ? (
        <div>Deleted</div>
      ) : (
        <CustomerTraitValue
          value={node.value}
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
