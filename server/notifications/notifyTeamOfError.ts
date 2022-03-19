import { prisma } from "utils/prisma";
import sendPostmarkEmail from "server/postmark/sendPostmarkEmail";
import { logger } from "utils/logger";

export default async function notifyTeamOfError(
  teamId: number | bigint,
  errorName: string,
  errorMessage: string
) {
  const teamMembers = await prisma.teamMember.findMany({
    where: { teamId: teamId },
    select: { role: true, Profile: { select: { email: true } } },
  });

  const promises = teamMembers.map(async (tm) => {
    void logger.warn(
      `Sending Error Action Required email to ${tm.Profile.email} about ${errorName}`,
      {
        teamId: Number(teamId),
        email: tm.Profile.email,
        role: tm.role,
        errorName: errorName,
        errorMessage: errorMessage,
      }
    );
    await sendPostmarkEmail({
      to: tm.Profile.email,
      subject: `[Willow] [Action Required] ${errorName}`,
      textBody: [
        "Uh Oh! Looks like we have an issue",
        "",
        `${errorName}`,
        "",
        `${errorMessage}`,
        `- Willow (https://heywillow.io)`,
      ],
      htmlBody: [
        "<h1>Uh Oh! Looks like we have an issue<h2><br>",
        "<br>",
        `<h2>${errorName}</h2><br>`,
        "<br>",
        `<p>${errorMessage}</p>`,
        "<br>",
        `- <a href="https://heywillow.io">Willow</a>`,
      ],
    });
  });

  await Promise.allSettled(promises);
}
