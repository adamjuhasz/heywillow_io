import { Body } from "pages/api/public/v1/message/secure";

export default async function submitMessage(toSend: Body) {
  const res = await fetch("/api/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toSend),
  });
  switch (res.status) {
    case 200:
      return res;

    default:
      console.error(res.status);
      throw new Error(`Request error ${res.status}`);
  }
}
