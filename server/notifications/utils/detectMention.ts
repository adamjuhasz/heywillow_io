export default function detectMention(str: string): string[] {
  const regex = /\B@([0-9a-zA-Z])*/gm;

  return Array.from(str.matchAll(regex), (m) => m[0].toLowerCase());
}
