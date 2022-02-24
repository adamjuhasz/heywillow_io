// https://datatracker.ietf.org/doc/html/rfc2822#section-2.1.1

export default function unwrapRFC2822(body: string): string {
  return body.replace(/\r\n(?!\r\n)/g, "");
}
