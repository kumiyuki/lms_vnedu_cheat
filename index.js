import { Command, Logger } from "kumiyui";
import { anti_cheat } from "./modules/anti_cheat";
import { anti_tracking } from "./modules/anti_tracking";
import { no_timer } from "./modules/no_timer";
import { get_answers } from "./modules/get_answers";
import { auto_finish } from "./modules/auto_finish";

// create a logger
const logger = new Logger({
  name: "lms_vnedu_cheat",
  level: Logger.LEVELS.info,
});

[
  anti_cheat(),
  anti_tracking(),
  no_timer(),

  // create a logger for get_answers
  get_answers({ logger: logger.child("g!ans") }),

  auto_finish()
].forEach((command) => {
  Command(command);
})