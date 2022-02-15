import HashIds from "hashids";

export const hashids = new HashIds(
  process.env.HASHIDS_SALT || "",
  parseInt(process.env.HASHIDS_PADDING as string, 10)
);

export default hashids;
