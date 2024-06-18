import { Process, Tally } from "../assembly/index.ts";
import { JSON } from "json-as/assembly";

if (Process.isTallyVmMode()) {
  const reveals = Tally.getReveals();

  Process.exit_with_message(0, JSON.stringify(reveals));
} else {
  Process.exit_with_message(0, "hello,world!");
}
