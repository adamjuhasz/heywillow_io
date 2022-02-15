import geMessageText from "./getMessageText";

import exampleGmail from "./json/withattachments";
import withquote from "./json/withquote";
import withbase64 from "./json/withbase64";

describe("get message text", () => {
  it("works on email with attachments", () => {
    expect(geMessageText(exampleGmail)).toBe(
      `Y'all could use a social sharing card for sites like twitter:\r\n[image: image.png]\r\n\r\n[image: image.png]\r\n\r\nhttps://cards-dev.twitter.com/validator\r\n`
    );
  });

  it("works on email with quotes text", () => {
    expect(geMessageText(withquote)).toBe(`Same thread as “who is this"\r\n`);
  });

  it("works on email with quotes text", () => {
    expect(geMessageText(withbase64)).toBe(`One more time\r\n`);
  });
});
