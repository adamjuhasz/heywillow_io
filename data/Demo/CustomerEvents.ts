import { subDays } from "date-fns";
import { subHours } from "date-fns";

interface DemoCustomerEvent {
  createdAt: Date;
  action: string;
  properties:
    | string
    | number
    | null
    | Record<string, string | boolean | number>
    | string[];
}
const customerEvents: DemoCustomerEvent[] = [
  {
    createdAt: subHours(subDays(new Date(), 2), 2),
    action: "Viewed Page",
    properties: { url: "https://stealth.ai/signup", name: "Sign up now" },
  },
  {
    createdAt: subDays(new Date(), 2),
    action: "Signed up",
    properties: { marketingSubscribed: true },
  },
  {
    createdAt: subDays(new Date(), 1),
    action: "Viewed Screen",
    properties: "Log in screen v2",
  },
];

export default customerEvents;
