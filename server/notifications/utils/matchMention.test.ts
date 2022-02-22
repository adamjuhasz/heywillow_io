import matchMention from "./matchMention";

describe("Matches handle to email", () => {
  it("works", () => {
    expect(matchMention("adam@heywillow.io", ["@mike", "@adam"])).toStrictEqual(
      true
    );
  });

  it("ignores fuzzy match", () => {
    expect(
      matchMention("adam.juhasz@heywillow.io", ["@mike", "@adam"])
    ).toStrictEqual(false);
  });

  it("noamrlizes caps", () => {
    expect(matchMention("Adam@heywillow.io", ["@mike", "@adam"])).toStrictEqual(
      true
    );

    expect(matchMention("adam@heywillow.io", ["@mike", "@Adam"])).toStrictEqual(
      true
    );
  });
});
