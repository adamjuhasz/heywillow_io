import getTeamMemberMentions from "./getTeamMemberMentions";

const adam = { id: 1, Profile: { email: "adam@heywillow.io" } };
const mike = { id: 2, Profile: { email: "mike@heywillow.io" } };

describe("Matches handle to email", () => {
  it("works for users", () => {
    expect(
      getTeamMemberMentions(["@adam"], [adam, mike], "paytgthr")
    ).toStrictEqual([adam]);
  });

  it("works for team with extra mention", () => {
    expect(
      getTeamMemberMentions(["@adam", "@paytgthr"], [adam, mike], "paytgthr")
    ).toStrictEqual([adam, mike]);
  });

  it("works for team", () => {
    expect(
      getTeamMemberMentions(["@paytgthr"], [adam, mike], "paytgthr")
    ).toStrictEqual([adam, mike]);
  });
});
