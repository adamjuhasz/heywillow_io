import type { DemoThread } from "./Types";

import { robinHoodThread1, robinHoodThread2 } from "./Threads/Robinhood";
import { onboarding1 } from "./Threads/Onboarding1";
import {
  onboarding2ThreadOne,
  onboarding2ThreadTwo,
} from "./Threads/Onboarding2";
import { onboarding3ThreadOne } from "./Threads/Onboarding3";
import { onboarding4ThreadOne } from "./Threads/Onboarding4";

export const threads: DemoThread[] = [
  ...[onboarding1],
  ...[onboarding2ThreadOne, onboarding2ThreadTwo],
  ...[onboarding3ThreadOne],
  ...[onboarding4ThreadOne],
  ...[robinHoodThread1, robinHoodThread2],
];

export default threads;
