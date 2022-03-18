interface MiniTeamMember {
  id: number | bigint;
  Profile: {
    email: string;
  };
}

export default function getTeamMemberMentions<TM extends MiniTeamMember>(
  mentionedTeamMembers: number[],
  teamMembers: TM[]
): TM[] {
  if (mentionedTeamMembers.length === 0) {
    return [];
  }

  if (mentionedTeamMembers.includes(0)) {
    return teamMembers;
  }

  return teamMembers.filter((tm) =>
    mentionedTeamMembers.includes(Number(tm.id))
  );
}
