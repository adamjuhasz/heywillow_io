import { prisma } from "utils/prisma";
import hashids from "server/hashids";
import { logger } from "utils/logger";

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

  logger.info("threadLink", {
    threadId: Number(threadId),
    aliasId: Number(aliasId),
    threadLink: Number(threadLink),
  });

  const namespace = threadLink.Thread.Team.Namespace.namespace;
  const encodedTL = hashids.encode(threadLink.id);
  const host = `${process.env.PROTOCOL}://${process.env.DOMAIN}`;

  const secureURL = `${host}/p/${namespace}/secure-msg/${encodedTL}`;
  logger.info("secureURL", {
    threadId: Number(threadId),
    aliasId: Number(aliasId),
    threadLink: Number(threadLink),
    secureURL: Number(secureURL),
  });

  return secureURL;
}
