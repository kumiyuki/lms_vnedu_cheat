import { Logger, Hook, Network } from "kumiyui";

let is_toggled = false;
const cheat_reporter_urls = ["service/learnerV2/logAction", "service/learnerV2/khoaVongThi"];
const o_event_listener = document.addEventListener;

// hook event listener (cleanest approach and lighter than most hooking method)
// i don't have to inject anything into their application
const kokoro = ["visibilitychange", "resize", "leaving"];
Hook.hook({
  obj: document,
  prop: "addEventListener",
  options: {
    mask_hook: true,
    block_overwrite: true
  },
  new_value: (...data) =>{
    // only trigger these events if not toggle
    if (!is_toggled)
      return o_event_listener(...data);

    // normal hooking    
    if (data.length <= 0)
      return o_event_listener(...data);

    if (typeof data[0] !== "string")
      return o_event_listener(...data);

    // avoid application from listening to those events
    if (kokoro.includes(data[0] ?? ""))
      return;

    // listen normally
    return o_event_listener(...data);
  }
})

// hook network requests in order to stop lms.vnedu from sending tracking data back to their server
Network.register_network_hook("before", (req) => {
  // only trigger these events if not toggle
  if (!is_toggled) return;

  // get url and body
  const url = req?.args[0];
  const body = req?.args[1];
  const before_type = req?.before_type;

  // this hook doesn't need to modify the url, so only check if before type skipped to body
  if (before_type !== "body")
    return;

  // make sure it's FormData data type
  if (!(body instanceof FormData))
    return;

  // it's trying to lock the exam? block completely
  if (url?.includes( cheat_reporter_urls[1] ))
    return false;

  // check for report urls
  if (url?.includes( cheat_reporter_urls[0] )) {
    // no id of the test? i don't know what are they going to report
    if (!body.has("baiThiId") || !body.has("action") || !body.has("description"))
      return;

    const action = body.get("action") ?? "";

    // if the action is not submit, means that the client might try to send "visibilitychange" (triggered on fullscreen exit)
    // therefore, we should block the request
    if (action !== "submit")
      return false;
  }
})

/**
 * @param {object} options
 * @param {Logger} options.logger
 */
export const anti_cheat = () => {
  const main = (args, toggle) => {
    is_toggled = toggle;
  }

  return {
    command_name: "bypass anticheat",
    command: "bypass_anti_cheat",
    aliases: ["bypass_ac", "b!ac"],
    description: "stop lms.vnedu.vn from tracking whether you exit fullscreen or switch tabs.",
    is_toggle: true,
    callback_fn: main
  }
}