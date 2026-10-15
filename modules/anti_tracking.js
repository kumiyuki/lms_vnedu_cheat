import { Logger, Network } from "kumiyui";

let is_toggled = false;

Network.register_network_hook("before", (req) => {
  if (!is_toggled) return;
  const url = req?.args[0];
  console.log(url)
  if (
    url.includes("/user/logged") ||
    url.includes("console-smartux.vnpt.vn/i/bulk")
  ) return {
    // dropping connection might leak website application's memory (so just return a response).
    "body": "{}",
    "status": "200",
    // bans the client from sending request to the server
    "send_to_server": false
  }

})

/**
 * @param {object} options
 * @param {Logger} options.logger
 */
export const anti_tracking = () => {
  const main = (args, toggle) => {
    is_toggled = toggle
  }

  return {
    command_name: "anti tracking",
    command: "anti_tracking",
    aliases: ["anti_track", "a!track"],
    description: "prevent lms.vnedu.vn from sending telemetry data back to their server",
    is_toggle: true,
    callback_fn: main
  }
}