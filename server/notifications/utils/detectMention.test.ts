import detectMention from "./detectMention";

describe("Detect mention in comment", () => {
  it("doesn't false positive", () => {
    expect(detectMention("not an email@domain.com")).toStrictEqual([]);
  });

  it("detects at beginning", () => {
    expect(detectMention("@mike")).toStrictEqual(["@mike"]);
  });

  it("detects 2", () => {
    expect(detectMention("@mike, @adam will lead the way")).toStrictEqual([
      "@mike",
      "@adam",
    ]);
  });

  it("detects 2 back to back", () => {
    expect(detectMention("@mike @adam will lead the way")).toStrictEqual([
      "@mike",
      "@adam",
    ]);
  });

  it("detects in the middle", () => {
    expect(detectMention("hey @mike, can you do this for me?")).toStrictEqual([
      "@mike",
    ]);
  });

  it("detects at the end", () => {
    expect(detectMention("I agrees, @mike")).toStrictEqual(["@mike"]);
  });

  it("normalizes caps", () => {
    expect(detectMention("I agrees, @Mike")).toStrictEqual(["@mike"]);
  });

  it("accepts hyphen", () => {
    expect(detectMention("I agrees, @Mike-perez")).toStrictEqual([
      "@mike-perez",
    ]);
  });
});
