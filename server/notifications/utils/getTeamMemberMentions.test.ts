import getTeamMemberMentions from "./getTeamMemberMentions";

const adam = { id: 1, Profile: { email: "adam@heywillow.io" } };
const mike = { id: 2, Profile: { email: "mike@heywillow.io" } };

describe("Matches handle to email", () => {
  it("works for users", () => {
    expect(getTeamMemberMentions([1], [adam, mike])).toStrictEqual([adam]);
  });

  it("works for team with extra mention", () => {
    expect(getTeamMemberMentions([1, 0], [adam, mike])).toStrictEqual([
      adam,
      mike,
    ]);
  });

  it("works for team", () => {
    expect(getTeamMemberMentions([0], [adam, mike])).toStrictEqual([
      adam,
      mike,
    ]);
  });
});
