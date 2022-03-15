import { IComment } from "components/Thread/CommentBox";

type TeamMember = IComment["TeamMember"] & { id: number };

export const adamTeamMember: TeamMember = {
  id: 1,
  Profile: {
    email: "adam@stealth.ai",
    firstName: "Adam",
    lastName: "Smith (PROD)",
  },
};

export const eileenTeamMember: TeamMember = {
  id: 2,
  Profile: {
    email: "eileen@stealth.ai",
    firstName: "Eileen",
    lastName: "Ng (ENG)",
  },
};

export const saoirseTeamMember: TeamMember = {
  id: 3,
  Profile: {
    email: "saoirse@stealth.ai",
    firstName: "Saoirse",
    lastName: "McKinley (ENG)",
  },
};
