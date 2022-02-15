import type { NextApiRequest, NextApiResponse } from "next";
import { defaultTo, isArray, isString } from "lodash";

interface IncomingBody {
  category: string;
  related: { category: string; id: string }[];
  id: string;
  attributes: Record<string, never>;
}

async function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {
  const authParts = defaultTo(req.headers.authorization, "").split(" ");
  if (authParts.length !== 2) {
    return res.status(401).json({ error: "No API Token" });
  }
  const token = authParts[1];

  const incomingBody: IncomingBody = req.body;
  if (!isString(incomingBody.category)) {
    return res.status(400).json({ error: "Category must be string" });
  }
  if (!isString(incomingBody.id)) {
    return res.status(400).json({ error: "Id must be string" });
  }
  if (!isArray(incomingBody.related)) {
    return res.status(400).json({ error: "Related must be an array" });
  }
  try {
    incomingBody.related.forEach((r) => {
      if (!isString(r.category)) {
        throw new Error("Related.category must be a string");
      }

      if (!isString(r.id)) {
        throw new Error("Related.id must be a string");
      }
    });
  } catch (e: unknown) {
    return res.status(400).json({ error: (e as Error).message });
  }

  console.log(
    token,
    incomingBody.category,
    incomingBody.id,
    incomingBody.related
  );

  res.status(200).json({});
}

export default handler;
