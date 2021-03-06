import slateToText from "./slateToText";

const paragraph1 =
  "Stimulate your mind as you test your typing speed with this standard English paragraph typing test. Watch your typing speed and accuracy increase as you learn about a variety of new topics! Over 40 typing test selections available.";
const paragraph2 =
  'If you don\'t like a test prompt, you can get a different (random) prompt with the "change test" button - or select a specific paragraph to type from the list below. To find out how fast you type, just start typing in the blank text box on the right of the test prompt. You will see your progress, including errors on the left side as you type. In order to complete the test and save your score, you need to get 100% accuracy. You can fix errors as you go, or correct them at the end with the help of the spell checker.';
describe("slateToText", () => {
  it("works with multiple paragraphs", () => {
    expect(
      slateToText([
        { type: "paragraph", children: [{ text: paragraph1 }] },
        { type: "paragraph", children: [{ text: paragraph2 }] },
        { type: "paragraph", children: [{ text: "" }] },
        {
          type: "paragraph",
          children: [
            {
              text: "This is bold line ",
            },
            {
              text: "This is underline line ",
            },
            {
              text: "This is italics line ",
            },
            {
              text: "This is strikeout",
            },
          ],
        },
        {
          type: "paragraph",
          children: [{ text: "Signature below that" }],
        },
      ]).join("\r\n")
    ).toEqual(
      `${paragraph1}\r\n` +
        `${paragraph2}\r\n` +
        "\r\n" +
        "This is bold line This is underline line This is italics line This is strikeout\r\n" +
        "Signature below that"
    );
  });

  it("works with mixed paragraphs", () => {
    expect(
      slateToText([
        { type: "paragraph", children: [{ text: "Paragraph 1" }] },
        {
          text: "This is bold line ",
        },
        {
          text: "This is underline line ",
        },
        {
          text: "This is italics line ",
        },
        {
          text: "This is strikeout",
        },
      ]).join("\r\n")
    ).toEqual(
      "Paragraph 1\r\nThis is bold line \r\nThis is underline line \r\nThis is italics line \r\nThis is strikeout"
    );
  });

  it("works for mentions ", () => {
    expect(
      slateToText([
        {
          type: "paragraph",
          children: [
            { text: "Try mentioning teammates, like " },
            {
              type: "mention",
              teamMemberId: 1,
              displayText: "Adam (Eng)",
              children: [{ text: "" }],
            },
          ],
        },
      ]).join("\r\n")
    ).toEqual(`Try mentioning teammates, like @Adam (Eng)`);
  });
});
