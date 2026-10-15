import { Logger, Network } from "kumiyui";

let is_toggled = false;

Network.register_network_hook("after", async (req, res) => {
  if (!is_toggled) return;
  const url = req?.args[0];

  // using "return" will make the cheat ignores any instructions behind the "return" line
  // in this case: if the url doesn't include the api of exam, it allows the website to
  // fetch data from the server instead of going through the spoofing process.
  if (
    !url.includes("service/learnerForCourse/startBaiThi")
  ) return;

  // get the body of the response
  // always use the built-in json(), because the framework allows multiple hooks
  // to work on the same endpoint, so use json() and avoid manual parsing
  const body = await res.json();

  // set the data whjch makes the client believes that the exam doesn't have any limitation
  body.endTime = null;
  body.durationMinute = 0;

  // return the spoofed data back
  return { body };
})

/**
 * @param {object} options
 * @param {Logger} options.logger
 */
export const no_timer = () => {
  const main = (args, toggle) => {
    is_toggled = toggle
  }

  return {
    command_name: "no timer",
    command: "no_timer",
    aliases: ["no_time", "inf_time", "inftime", "inf!t"],
    description: "make the exam has infinite time",
    is_toggle: true,
    callback_fn: main
  }
}