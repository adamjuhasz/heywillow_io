import * as postmarkImport from "postmark";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var postmark: postmarkImport.ServerClient | undefined;
}

export const postmark: postmarkImport.ServerClient =
  global.postmark ||
  new postmarkImport.Client(process.env.POSTMARK_SERVER_API_TOKEN as string);

if (process.env.NODE_ENV !== "production") global.postmark = postmark;
