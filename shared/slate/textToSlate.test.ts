import textToSlate from "./textToSlate";

const paragraph1 =
  "Stimulate your mind as you test your typing speed with this standard English paragraph typing test. Watch your typing speed and accuracy increase as you learn about a variety of new topics! Over 40 typing test selections available.";
const paragraph2 =
  'If you don\'t like a test prompt, you can get a different (random) prompt with the "change test" button - or select a specific paragraph to type from the list below. To find out how fast you type, just start typing in the blank textbox on the right of the test prompt. You will see your progress, including errors on the left side as you type. In order to complete the test and save your score, you need to get 100% accuracy. You can fix errors as you go, or correct them at the end with the help of the spell checker.';
describe("process html", () => {
  it("works ", () => {
    expect(
      textToSlate(
        `${paragraph1}\r\n` +
          `${paragraph2}\r\n` +
          "\r\n" +
          "Signature below that\r\n"
      )
    ).toEqual([
      { type: "paragraph", children: [{ text: paragraph1 }] },
      { type: "paragraph", children: [{ text: paragraph2 }] },
      { type: "paragraph", children: [{ text: "" }] },
      {
        type: "paragraph",
        children: [{ text: "Signature below that" }],
      },
    ]);
  });

  xit("works with PII", () => {
    expect(textToSlate("My SSN is 123-12-1234, can you try that?")).toEqual([
      {
        type: "paragraph",
        children: [{ text: "My SSN is 123-12-1234, can you try that?" }],
      },
    ]);
  });
});
