import emailWithoutHash from "./emailWithoutHash";

describe("Removes hash from email", () => {
  it("works", () => {
    expect(
      emailWithoutHash({
        Email: "willow-test+6@inbound.heywillow.io",
        MailboxHash: "6",
        Name: "",
      })
    ).toBe("willow-test@inbound.heywillow.io");
  });

  it("works without", () => {
    expect(
      emailWithoutHash({
        Email: "willow-test+123@inbound.heywillow.io",
        MailboxHash: "",
        Name: "",
      })
    ).toBe("willow-test+123@inbound.heywillow.io");
  });
});
