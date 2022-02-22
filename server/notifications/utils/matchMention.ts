export default function matchMention(
  email: string,
  mentions: string[]
): boolean {
  const handleMatch = email.match(/^([^@]*)/g);
  if (handleMatch === null) {
    return false;
  }
  const handle = `@${handleMatch[0]}`.toLowerCase();
  return mentions.findIndex((v) => v.toLowerCase() === handle) !== -1;
}
