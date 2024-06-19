import { Process, Tally } from "../assembly/index.ts";
import { JSON } from "json-as/assembly";

if (Process.isTallyVmMode()) {
  console.log('Hello');
  const reveals = Tally.getReveals();
  console.log(JSON.stringify(reveals));

  Process.exit_with_message(0, JSON.stringify(reveals));
} else {
  Process.exit_with_message(0, "hello,world!");
}
