import { gmail_v1 } from "@googleapis/gmail";

export default function getGoogleMessageEmailFromHeader(
  headerName: string,
  message: gmail_v1.Schema$Message
) {
  const header = message.payload?.headers?.find(
    (header) => header.name === headerName
  );

  if (!header) {
    return null;
  }

  const headerValue = header.value; // John Doe <john.doe@example.com>

  const email = headerValue?.substring(
    headerValue.lastIndexOf("<") + 1,
    headerValue.lastIndexOf(">")
  );

  return email; // john.doe@example.com
}
