import { GetServerSideProps } from "next";
import { PrismaClient } from "@prisma/client";

import prismaToJSON from "server/prismaToJSon";

export const getServerSideProps: GetServerSideProps<Props> = async (
  _context
) => {
  const prisma = global?.prisma || new PrismaClient();

  const inboxes = await prisma.inbox.findMany({
    select: { id: true, emailAddress: true },
  });

  const outJSON = prismaToJSON(inboxes);

  return {
    props: {
      inboxes: outJSON,
    },
  };
};

interface Props {
  inboxes: { id: number; emailAddress: string }[];
}

export default function InboxList(props: Props) {
  return (
    <div className="flex flex-col p-3">
      {props.inboxes.map((i) => (
        <div key={i.id} className="flex">
          <div className="font-bold">{i.id}</div>
          <div className="ml-3">{i.emailAddress}</div>
        </div>
      ))}
    </div>
  );
}
