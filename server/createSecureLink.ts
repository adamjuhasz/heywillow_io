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
  });

  console.log("threadLink", threadLink);

  const secureURL = `${process.env.PROTOCOL}://${
    process.env.DOMAIN
  }/secure/${hashids.encode(threadLink.id)}/message`;
  console.log("secureURL", secureURL);

  return secureURL;
}
