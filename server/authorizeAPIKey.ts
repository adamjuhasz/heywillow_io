import { NextApiRequest } from "next";
import includes from "lodash/includes";
import type { Team } from "@prisma/client";
import { Buffer } from "buffer";

import { prisma } from "utils/prisma";

export default async function authorizeAPIKey(
  req: NextApiRequest
): Promise<string | [Team, string]> {
  const authHeader = req.headers.authorization;
  if (authHeader === undefined || !includes(authHeader, "Basic ")) {
    return "No authorization header";
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [apiKey] = credentials.split(":");

  const team = await prisma.apiKey.findUnique({
    where: { id: apiKey },
    select: { Team: true, valid: true, id: true },
  });

  if (team === null) {
    return "API Key invalid; team issue";
  }

  if (team.valid === false) {
    return "API Key invalid; expired key";
  }

  return [team.Team, apiKey];
}
