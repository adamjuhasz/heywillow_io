import uniqBy from "lodash/uniqBy";

import matchMention from "server/notifications/utils/matchMention";

interface MiniTeamMember {
  id: number | bigint;
  Profile: {
    email: string;
  };
}

export default function getTeamMemberMentions<TM extends MiniTeamMember>(
  mentions: string[],
  teamMembers: TM[],
  namespace: string
): TM[] {
  if (mentions.length === 0) {
    return [];
  }

  if (mentions.includes(`@${namespace}`)) {
    return teamMembers;
  }

  return uniqBy(
    teamMembers.filter((tm) => matchMention(tm.Profile.email, mentions)),
    (tm) => tm.id
  );
}
