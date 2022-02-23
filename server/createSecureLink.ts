import { prisma } from "utils/prisma";
import hashids from "server/hashids";

export default async function createSecureThreadLink(
  threadId: number | bigint,
  aliasId: number | bigint
) {
  const threadLink = await prisma.threadLink.upsert({
    where: {
      threadId_aliasEmailId: {
        threadId: threadId,
        aliasEmailId: aliasId,
      },
    },
    update: {},
    create: {
      threadId: threadId,
      aliasEmailId: aliasId,
    },
    include: {
      Thread: {
        select: {
          Team: { select: { Namespace: { select: { namespace: true } } } },
        },
      },
    },
  });

  console.log("threadLink", threadLink);

  const namespace = threadLink.Thread.Team.Namespace.namespace;
  const encodedTL = hashids.encode(threadLink.id);
  const host = `${process.env.PROTOCOL}://${process.env.DOMAIN}`;

  const secureURL = `${host}/p/${namespace}/secure-msg/${encodedTL}`;
  console.log("secureURL", secureURL);

  return secureURL;
}
