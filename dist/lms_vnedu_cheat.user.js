// ==UserScript==
// @name            vnEdu LMS cheat
// @version         2026-10-20
// @namespace       https://github.com/kumiyuki/lms_vnedu_cheat/
// @description     cheat for saas lms.vnedu.vn
// @author          kumiyuki
// @include         /^https?:\/\/.*\.lms\.vnedu\.vn\/.*$/
// @require         https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.2/jszip.min.js
// @license         GPL-3.0
// @downloadURL     https://raw.githubusercontent.com/kumiyuki/lms_vnedu_cheat/refs/heads/main/dist/lms_vnedu_cheat.user.js
// @updateURL       https://raw.githubusercontent.com/kumiyuki/lms_vnedu_cheat/refs/heads/main/dist/lms_vnedu_cheat.user.js
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @run-at          document-start
// ==/UserScript==

"use strict";
// node_modules/kumiyui/modules/utils/dropin_console.js
var document2 = window.document;

class DropInConsole {
  constructor(commandHandler) {
    this.isOpen = false;
    this.commandHandler = commandHandler || ((cmd) => this.printLevel("error", `No handler: ${cmd}`));
    this._buildUI();
  }
  _buildUI() {
    const host = document2.createElement("div");
    host.style.position = "fixed";
    host.style.zIndex = "2147483647";
    const shadow = host.attachShadow({ mode: "open" });
    const container = document2.createElement("div");
    container.style.cssText = "position:fixed;bottom:0;left:0;width:100vw;height:50vh;background:#111;color:#fff;font-family:monospace;font-size:13px;box-shadow:0 -5px 15px rgba(0,0,0,0.5);display:flex;flex-direction:column;transform:translateY(100%);transition:transform 0.2s ease-in-out;box-sizing:border-box;";
    const header = document2.createElement("div");
    header.style.cssText = "background:#222;padding:8px 12px;display:flex;justify-content:space-between;border-bottom:1px solid #333;align-items:center;";
    const title = document2.createElement("span");
    title.style.cssText = "color:#aaa;font-weight:bold;";
    title.textContent = "\uD83D\uDEE0️ Terminal";
    const closeBtn = document2.createElement("button");
    closeBtn.style.cssText = "background:none;border:none;color:#f55;cursor:pointer;font-weight:bold;font-size:14px;padding:4px;";
    closeBtn.textContent = "✕ Close";
    closeBtn.addEventListener("click", () => this.toggle());
    header.appendChild(title);
    header.appendChild(closeBtn);
    this.output = document2.createElement("div");
    this.output.style.cssText = "flex:1;overflow-y:auto;padding:0;white-space:pre;line-height:1.4;";
    const inputContainer = document2.createElement("div");
    inputContainer.style.cssText = "background:#1a1a1a;padding:8px;border-top:1px solid #333;display:flex;align-items:center;";
    this.inputField = document2.createElement("input");
    this.inputField.type = "text";
    this.inputField.placeholder = "Type framework command...";
    this.inputField.style.cssText = "flex:1;background:#252525;border:1px solid #444;color:#0f0;font-family:monospace;font-size:14px;padding:8px 10px;border-radius:4px;outline:none;";
    this.inputField.addEventListener("keydown", (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (e.key === "Enter" && this.inputField.value) {
        const cmd = this.inputField.value.trim();
        if (cmd) {
          this.printLevel("log", `> ${cmd}`);
          this.commandHandler(cmd);
          this.inputField.value = "";
        }
      }
    }, { capture: true });
    ["input", "keyup", "change"].forEach((event) => {
      this.inputField.addEventListener(event, (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }, { capture: true });
    });
    inputContainer.appendChild(this.inputField);
    container.appendChild(header);
    container.appendChild(this.output);
    container.appendChild(inputContainer);
    shadow.appendChild(container);
    let is_added = false;
    const append_host = () => {
      if (is_added || !document2.body)
        return;
      document2.body.appendChild(host);
      is_added = true;
    };
    if (document2.body) {
      append_host();
    } else {
      const _obs = new MutationObserver((mutations, obs) => {
        if (document2.body) {
          append_host();
          obs.disconnect();
        }
      });
      _obs.observe(document2.documentElement, {
        childList: true,
        subtree: true
      });
      window.addEventListener("DOMContentLoaded", () => {
        if (document2.body)
          append_host();
        _obs.disconnect();
      });
    }
    this.panel = container;
  }
  toggle() {
    this.isOpen = !this.isOpen;
    this.panel.style.transform = this.isOpen ? "translateY(0)" : "translateY(100%)";
    if (this.isOpen) {
      setTimeout(() => this.inputField.focus(), 250);
    } else {
      this.inputField.blur();
    }
  }
  trace(...args) {
    this.printLevel("debug", ...args);
  }
  debug(...args) {
    this.printLevel("debug", ...args);
  }
  log(...args) {
    this.printLevel("log", ...args);
  }
  info(...args) {
    this.printLevel("log", ...args);
  }
  table(data) {
    this.printLevel("log", data);
  }
  warn(...args) {
    this.printLevel("warn", ...args);
  }
  error(...args) {
    this.printLevel("error", ...args);
  }
  printLevel(level, ...args) {
    const len = args.length;
    if (len === 0)
      return;
    const line = document2.createElement("div");
    line.style.cssText = "padding:6px 10px;border-bottom:1px solid #222;display:block;";
    if (level === "error") {
      line.style.cssText += "background-color:rgba(255,85,85,0.12);color:#ff6b6b;border-left:3px solid #ff5555;";
    } else if (level === "warn") {
      line.style.cssText += "background-color:rgba(255,180,84,0.1);color:#ffb454;border-left:3px solid #ffb454;";
    } else if (level === "debug") {
      line.style.cssText += "color:#7ec0ee;";
    }
    const fragment = document2.createDocumentFragment();
    const timeSpan = document2.createElement("span");
    timeSpan.style.cssText = "color:#555;margin-right:5px;";
    timeSpan.textContent = `[${new Date().toLocaleTimeString()}]`;
    fragment.appendChild(timeSpan);
    const firstArg = args[0];
    if (typeof firstArg === "string" && firstArg.includes("%c")) {
      const parts = firstArg.split("%c");
      const partsLen = parts.length;
      if (partsLen > 0) {
        const initialSpan = document2.createElement("span");
        initialSpan.textContent = parts[0];
        fragment.appendChild(initialSpan);
      }
      let styleIdx = 1;
      for (let i = 1;i < partsLen; i++) {
        const span = document2.createElement("span");
        span.textContent = parts[i];
        const styleVal = args[styleIdx];
        if (typeof styleVal === "string") {
          span.style.cssText = styleVal;
          styleIdx++;
        }
        fragment.appendChild(span);
      }
      for (let i = styleIdx;i < len; i++) {
        fragment.appendChild(document2.createTextNode(" "));
        fragment.appendChild(this._renderItem(args[i]));
      }
    } else {
      for (let i = 0;i < len; i++) {
        if (i > 0)
          fragment.appendChild(document2.createTextNode(" "));
        fragment.appendChild(this._renderItem(args[i]));
      }
    }
    line.appendChild(fragment);
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }
  _renderItem(item) {
    const span = document2.createElement("span");
    const type = typeof item;
    if (item === null) {
      span.textContent = "null";
      span.style.color = "#777";
    } else if (item === undefined) {
      span.textContent = "undefined";
      span.style.color = "#777";
    } else if (type === "object") {
      if (Array.isArray(item) && item.length > 0 && typeof item[0] === "object" && item[0] !== null) {
        span.appendChild(this._createAsciiTable(item));
      } else {
        try {
          span.textContent = JSON.stringify(item);
          span.style.color = "#a8ff60";
        } catch (e) {
          span.textContent = String(item);
        }
      }
    } else if (type === "number") {
      span.textContent = String(item);
      span.style.color = "#ffb454";
    } else if (type === "boolean") {
      span.textContent = String(item);
      span.style.color = "#ff55f3";
    } else {
      span.textContent = String(item);
    }
    return span;
  }
  _createAsciiTable(arrayData) {
    const pre = document2.createElement("pre");
    pre.style.cssText = "margin:5px 0;background:#1a1a1a;padding:6px;border-radius:4px;color:#55ffff;overflow-x:auto;white-space:pre;font-family:monospace;";
    try {
      const headers = ["(index)", ...new Set(arrayData.flatMap((obj) => Object.keys(obj)))];
      const rows = arrayData.map((obj, index) => headers.map((header) => header === "(index)" ? String(index) : String(obj[header] !== undefined ? obj[header] : "")));
      const colWidths = headers.map((header, colIdx) => Math.max(header.length, ...rows.map((row) => row[colIdx].length)));
      const makeDivider = () => "+" + colWidths.map((w) => "-".repeat(w + 2)).join("+") + `
`;
      const makeRowStr = (cells) => "| " + cells.map((cell, idx) => cell.padEnd(colWidths[idx])).join(" | ") + ` |
`;
      let tableStr = makeDivider() + makeRowStr(headers) + makeDivider();
      const rLen = rows.length;
      for (let i = 0;i < rLen; i++) {
        tableStr += makeRowStr(rows[i]);
      }
      tableStr += makeDivider();
      pre.textContent = tableStr;
    } catch (err) {
      pre.textContent = `[Table Error: ${err.message}]`;
      pre.style.color = "#ff5555";
    }
    return pre;
  }
}

// node_modules/kumiyui/modules/logger.js
var console2 = window.console;
var ui_console = null;
var VALID_LEVELS = new Set([10, 20, 30, 40, 50, Infinity]);
var LEVELS_INT = new Map([
  [10, "TRACE"],
  [20, "DEBUG"],
  [30, "INFO"],
  [40, "WARN"],
  [50, "ERROR"]
]);

class Logger {
  static LEVELS = {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    silent: Infinity
  };
  static COLORS = {
    10: "color: #888888;",
    20: "color: #06b6d4;",
    30: "color: #10b981; font-weight: bold;",
    40: "color: #f59e0b; font-weight: bold;",
    50: "color: #ef4444; font-weight: bold;"
  };
  constructor({ name = "kumiyui", level = "info", output_timestamp = false }) {
    this.name = name;
    this.output_timestamp = output_timestamp;
    if (typeof level === "number") {
      this.level_weight = VALID_LEVELS.has(level) ? level : 30;
    } else if (typeof level === "string") {
      this.level_weight = Logger.LEVELS[level] ?? 30;
    } else {
      this.level_weight = 30;
    }
  }
  set level(new_level) {
    if (typeof new_level === "number") {
      this.level_weight = VALID_LEVELS.has(new_level) ? new_level : 30;
    } else if (typeof new_level === "string") {
      this.level_weight = Logger.LEVELS[new_level] ?? 30;
    } else {
      this.level_weight = 30;
    }
  }
  child(child_name) {
    return new Logger({
      name: `${this?.name}:${child_name}`,
      level: this.level_weight
    });
  }
  _log(method, weight, args) {
    if (weight < this.level_weight)
      return;
    const prefix = `[${this?.name}]`;
    const allow_timestamp = this.output_timestamp;
    const output_styles = [];
    if (allow_timestamp === true)
      output_styles.push(Logger.COLORS[10]);
    output_styles.push(Logger.COLORS[weight ?? 30]);
    const timestamp_output = allow_timestamp === true ? `%c[${new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(11, 23)}]` + " " : "";
    const rendered_output = [`${timestamp_output}%c${LEVELS_INT.get(weight ?? 30)}`, ...output_styles, prefix];
    if (method === "table") {
      console2.log(...rendered_output);
      console2.table(...args);
      if (typeof ui_console.log !== "function" && typeof ui_console.table !== "function")
        return;
      ui_console.log(...rendered_output);
      ui_console.table(...args);
      return;
    }
    console2?.[method](...rendered_output, ...args);
    if (typeof ui_console?.[method] === "function")
      ui_console[method](...rendered_output, ...args);
  }
  trace(...args) {
    this._log("debug", 10, args);
  }
  debug(...args) {
    this._log("debug", 20, args);
  }
  info(...args) {
    this._log("info", 30, args);
  }
  table(...args) {
    this._log("table", 30, args);
  }
  warn(...args) {
    this._log("warn", 40, args);
  }
  error(...args) {
    this._log("error", 50, args);
  }
}
var _set_trigger_command_input = (trigger_command_input) => {
  ui_console = new DropInConsole(trigger_command_input);
  return ui_console;
};
var host = document.createElement("div");
host.style.cssText = "position:fixed!important;bottom:20px!important;right:20px!important;z-index:2147483647!important;width:40px!important;height:40px!important;pointer-events:none!important;";
var shadow_root = host.attachShadow({ mode: "closed" });
var trigger_div = document.createElement("div");
trigger_div.style.cssText = "display:none!important;pointer-events:auto!important;cursor:pointer!important;width:40px!important;height:40px!important;padding:8px!important;background-color:#000!important;opacity:.25!important;position:fixed!important;border-radius:10px!important;box-sizing:border-box!important;transition:opacity .2s ease!important;user-select:none!important;touch-action:none!important;";
var is_dragging = false;
var offset_x;
var offset_y;
var start_drag = (e) => {
  is_dragging = true;
  const client_x = e.touches ? e.touches[0].clientX : e.clientX;
  const client_y = e.touches ? e.touches[0].clientY : e.clientY;
  offset_x = client_x - trigger_div.offsetLeft;
  offset_y = client_y - trigger_div.offsetTop;
};
var move_drag = (e) => {
  if (!is_dragging)
    return;
  const client_x = e.touches ? e.touches[0].clientX : e.clientX;
  const client_y = e.touches ? e.touches[0].clientY : e.clientY;
  trigger_div.style.left = `${client_x - offset_x}px`;
  trigger_div.style.top = `${client_y - offset_y}px`;
};
var stop_drag = () => is_dragging = false;
trigger_div.addEventListener("touchstart", start_drag, { passive: true });
document.addEventListener("touchmove", move_drag, { passive: false });
document.addEventListener("touchend", stop_drag);
trigger_div.addEventListener("mousedown", start_drag);
document.addEventListener("mousemove", move_drag);
document.addEventListener("mouseup", stop_drag);
trigger_div.addEventListener("mouseenter", () => trigger_div.style.opacity = "0.8");
trigger_div.addEventListener("mouseleave", () => trigger_div.style.opacity = "0.25");
trigger_div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="#e3e3e3"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>`;
trigger_div.addEventListener("click", () => {
  if (ui_console)
    ui_console.toggle();
});
shadow_root.appendChild(trigger_div);
(document.documentElement || document.body).appendChild(host);
var curr_input_mode = null;
window.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== curr_input_mode) {
    curr_input_mode = e.pointerType;
    trigger_div.style.display = curr_input_mode === "touch" ? "block" : "none";
  }
});

// node_modules/kumiyui/modules/hook_masker.js
var logger = new Logger({ name: "kumiyui:hook_masker", level: Logger.LEVELS.info });
var _hooks = new Map;
var bypass_detection_hook = (hook_env) => {
  if (!hook_env || !hook_env?.Function?.prototype)
    return;
  const o_fn_c = hook_env?.Function?.prototype?.toString?.call?.bind(hook_env.Function.prototype.toString);
  try {
    const new_tostring_hook = (...args) => {
      for (const _obj of args) {
        if (typeof _obj !== "function")
          return;
      }
      if (args.length <= 0)
        return o_fn_c(...args);
      if (_hooks.has(args[0]))
        return _hooks.get(args[0]) || "function() { [native code] }";
      return o_fn_c(...args);
    };
    Object.defineProperty(hook_env.Function.prototype.toString, "call", {
      get: () => new_tostring_hook,
      set: () => new_tostring_hook,
      configurable: true
    });
    _hooks.set(hook_env.Function.prototype.toString, "function toString() { [native code] }");
  } catch (e) {
    logger.error(`failed to mask Function.prototype.call()`, e);
  }
  try {
    const obj_fn_c = hook_env?.Object?.prototype?.constructor?.toString;
    const new_obj_tostring_hook = (...args) => {
      if (args.length <= 0)
        return obj_fn_c(...args);
      if (_hooks.has(args[0]))
        return _hooks.get(args[0]) || "function() { [native code] }";
      return obj_fn_c(...args);
    };
    Object.defineProperty(hook_env.Object.prototype.constructor, "toString", {
      get: () => new_obj_tostring_hook,
      set: () => new_obj_tostring_hook,
      configurable: true
    });
  } catch (e) {
    logger.error(`failed to mask Function.prototype.constructor.toString()`, e);
  }
};
bypass_detection_hook(unsafeWindow || window);
var o_appendc = Element?.prototype?.appendChild;
Element.prototype.appendChild = function(...args) {
  if ((args.length ?? 0) <= 0)
    return o_appendc.apply(this, args);
  const child = args[0];
  const result = o_appendc.apply(this, args);
  if (child instanceof HTMLIFrameElement) {
    if (child?.contentWindow)
      bypass_detection_hook(child?.contentWindow);
    child?.addEventListener("load", () => {
      if (child?.contentWindow)
        bypass_detection_hook(child?.contentWindow);
    });
    try {
      Object.defineProperty(child, "contentWindow", {
        get: function() {
          const win = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "contentWindow").get.call(this);
          if (win) {
            try {
              if (!win.Function.prototype.toString.toString().includes("[native code]"))
                bypass_detection_hook(win);
            } catch (e) {
              logger.debug("(you can safely ignore this warning) this is a cross-origin frame. direct manipulation from here is blocked by the browser. detailed log:", e);
            }
          }
          return win;
        },
        configurable: true
      });
    } catch (e) {
      logger.error(`cross context navigation reset watcher threw error:`, e);
    }
  }
  return result;
};
var mask_hook = (fn, native_string) => {
  if (typeof fn !== "function")
    return;
  if (_hooks.has(fn))
    return;
  const hook_native = typeof native_string === "string" ? native_string : "function() { [native code] }";
  _hooks.set(fn, hook_native);
  const o_hasprop = fn?.hasOwnProperty;
  try {
    if (typeof o_hasprop === "function") {
      const modified_hasOwnProperty = function(...args) {
        if ((args.length ?? 0) <= 0)
          return o_hasprop.apply(this, args);
        if (args[0] === "toString" || args[0] === "hasOwnProperty")
          return false;
        return o_hasprop.apply(this, args);
      };
      Object.defineProperty(fn, "hasOwnProperty", {
        get: () => modified_hasOwnProperty,
        set: () => modified_hasOwnProperty,
        configurable: true
      });
      _hooks.set(fn.hasOwnProperty, "function hasOwnProperty() { [native code] }");
    }
  } catch (e) {
    logger.error(`failed to mask fn.hasOwnProperty()`, e);
  }
  try {
    const modified_toString = function() {
      return hook_native;
    };
    Object.defineProperty(fn, "toString", {
      get: () => modified_toString,
      set: () => modified_toString,
      configurable: true
    });
    _hooks.set(fn.toString, "function toString() { [native code] }");
  } catch (e) {
    logger.error(`failed to mask fn.toString()`, e);
  }
};

// node_modules/kumiyui/modules/hook.js
var o_fn_c = window?.Function?.prototype?.toString?.call?.bind(window?.Function?.prototype?.toString);
var logger2 = new Logger({ name: "kumiyui:hook", level: Logger.LEVELS.info });
var apply_raw_hook = ({ obj, prop, new_value, options, native_str }) => {
  try {
    Object.defineProperty(obj, prop, {
      value: new_value,
      writable: options?.block_overwrite === true ? false : true
    });
  } catch (e) {
    logger2.error(`failed to hook ${obj}[${prop}], error:`, e);
  }
  if (options?.mask_hook === true && native_str)
    return mask_hook(obj[prop], native_str);
};
var hook = ({
  obj,
  prop,
  new_value,
  options = {
    mask_hook: false,
    block_overwrite: false
  }
}) => {
  const native_str = typeof obj?.[prop] === "function" ? o_fn_c(obj?.[prop])?.toString() : null;
  if (obj === window)
    obj = typeof unsafeWindow !== "undefined" ? unsafeWindow : globalThis || window;
  apply_raw_hook({ obj, prop, new_value, options, native_str });
};

// node_modules/kumiyui/modules/network.js
var o_fetch = globalThis.fetch || window.fetch;
var o_send_beacon = globalThis?.navigator?.sendBeacon || window?.navigator?.sendBeacon;
var o_xhr = globalThis.XMLHttpRequest || window.XMLHttpRequest;
var logger3 = new Logger({ name: "kumiyui:hook_masker", level: Logger.LEVELS.info });
var await_after_hook = async (env) => {
  if (env?.readyState === 4 && env?._kumiyui_finished === true || env?._kumiyui_blocked === true)
    return;
  if (env?.readyState === 4 && !env._kumiyui_finished) {
    await new Promise((resolve) => {
      env?._kumiyui_change_listeners.push(resolve);
      if (env._kumiyui_finished === true || env._kumiyui_blocked === true) {
        const listener_index = env._kumiyui_change_listeners.indexOf(resolve);
        if (listener_index !== -1)
          env._kumiyui_change_listeners.splice(listener_index, 1);
        return resolve();
      }
    });
  }
};
var hook_registry = { before: [], after: [] };
var _init_network_hook = () => {
  hook({
    obj: window,
    prop: "fetch",
    new_value: async (...args) => {
      let context2 = { args, api: "fetch" };
      let short_circuit_response = null;
      let is_execution_blocked = false;
      let cached_json_body = [];
      let is_json_parsed = [];
      Object.defineProperty(context2, "json", {
        get() {
          if (is_json_parsed)
            return cached_json_body;
          const options = this?.args[1];
          if (options && options?.body && typeof options?.body === "string") {
            try {
              cached_json_body = JSON.parse(options?.body);
            } catch (e) {
              cached_json_body = null;
            }
          }
          is_json_parsed = true;
          return cached_json_body;
        },
        set(new_value) {
          cached_json_body = new_value;
          is_json_parsed = true;
          if (this?.args[0] instanceof Request) {
            this.args[0] = new Request(this.args[0], {
              method: this.args[0].method,
              headers: this.args[0].headers,
              body: JSON.stringify(new_value)
            });
          } else {
            this.args[1] = { ...this.args[1] };
            this.args[1].body = JSON.stringify(new_value);
            if (!this.args[1].method || this.args[1].method === "GET")
              this.args[1].method = "POST";
          }
        }
      });
      for (const hook of hook_registry.before) {
        try {
          let modification = null;
          try {
            modification = await hook(context2);
          } catch (e) {
            logger3.error(`cannot execute hook listener on window.fetch() hook (type: "before"), error:`, e);
          }
          if (typeof modification !== "undefined") {
            if (modification === false) {
              short_circuit_response = undefined;
              is_execution_blocked = true;
              break;
            }
            let _response2 = { status: 200, statusText: "OK", headers: new Headers };
            let response_body = null;
            if (modification && typeof modification === "object") {
              ["status", "statusText", "headers"].forEach((_res_key) => {
                if (typeof modification[_res_key] !== "undefined")
                  _response2[_res_key] = modification[_res_key];
              });
              response_body = modification?.body !== undefined ? modification.body : null;
            } else if (typeof modification === "string") {
              response_body = modification;
            }
            short_circuit_response = new Response(response_body, _response2);
            break;
          }
        } catch (e) {
          logger3.error(`failed to hook networt request (type: "before"), error:`, e);
        }
      }
      let response;
      if (short_circuit_response && !is_execution_blocked) {
        response = short_circuit_response;
      } else if (!short_circuit_response && is_execution_blocked === true) {
        response = undefined;
        return;
      } else {
        try {
          response = await o_fetch.apply(window, context2?.args);
        } catch (net_err) {
          logger3.log("failed to send real network request to the server.", net_err);
          throw net_err;
        }
      }
      const after_hooks = hook_registry?.after ?? [];
      for (let i = 0;i < after_hooks?.length; i++) {
        try {
          const hook = after_hooks[i];
          const is_last_hook = i === (after_hooks?.length ?? 0) - 1;
          const response_for_hook = is_last_hook ? response : response.clone();
          let modification = null;
          try {
            modification = await hook(context2, response_for_hook);
          } catch (e) {
            logger3.error(`cannot execute hook listener on window.fetch() hook (type: "after"), error:`, e);
          }
          if (typeof modification !== "undefined") {
            if (modification instanceof Response) {
              response = modification;
            } else {
              let _response2 = { status: 200, statusText: "OK", headers: new Headers };
              if (modification && typeof modification === "object" && (typeof modification["body"] !== "undefined" || typeof modification["status"] !== "undefined")) {
                ["status", "statusText", "headers"].forEach((_res_key) => {
                  if (typeof modification[_res_key] !== "undefined")
                    _response2[_res_key] = modification[_res_key];
                });
              }
              response = new Response(modification?.body, _response2);
            }
          }
        } catch (e) {
          logger3.error(`error on "after" hook, error:`, e);
        }
      }
      return response;
    },
    options: { mask_hook: true, block_overwrite: true }
  });
  if (window.navigator && o_send_beacon) {
    hook({
      obj: window.navigator,
      prop: "sendBeacon",
      new_value: (url, data) => {
        const context2 = { args: [url, data], api: "sendBeacon" };
        let is_blocked = false;
        Object.defineProperty(context2, "json", {
          get() {
            if (typeof this?.args[1] === "string") {
              try {
                return JSON.parse(this.args[1]);
              } catch (e) {}
              return null;
            }
          },
          set(value) {
            this.args[1] = JSON.stringify(value);
          }
        });
        for (const hook of hook_registry?.before) {
          try {
            let modification = null;
            try {
              modification = hook(context2);
            } catch (e) {
              logger3.error(`cannot execute hook listener on sendBeacon hook (type: "before"), error:`, e);
            }
            if (modification === false || modification && typeof modification === "object" && modification.status === 204) {
              is_blocked = true;
              break;
            }
          } catch (e) {
            logger3.error(`error on sendBeacon hook (type: "before"), error:`, e);
          }
        }
        if (is_blocked === true)
          return true;
        const result = o_send_beacon.apply(window.navigator, context2.args);
        for (const hook of hook_registry?.after) {
          try {
            hook(context2, result);
          } catch (e) {
            logger3.error(`cannot execute hook listener on sendBeacon hook (type: "after"), error:`, e);
          }
        }
        return result;
      },
      options: { mask_hook: true, block_overwrite: true }
    });
  }
  const xhr_hook_map = new WeakMap;
  hook({
    obj: window,
    prop: "XMLHttpRequest",
    new_value: class extends o_xhr {
      constructor() {
        super();
        let finished_state = false;
        const self = this;
        xhr_hook_map.set(this, {
          _kumiyui_queued_headers: [],
          _kumiyui_has_to_queue_response: false,
          _kumiyui_queued_response: null,
          _kumiyui_is_opened: false,
          _kumiyui_context: { args: ["", null], method: "GET", api: "xhr", before_state: null },
          _kumiyui_response: {
            status: null,
            statusText: null,
            headers: null,
            body: null,
            responseType: null,
            send_to_server: true
          },
          _kumiyui_blocked: false,
          _kumiyui_change_listeners: [],
          get _kumiyui_finished() {
            return finished_state;
          },
          set _kumiyui_finished(new_value) {
            if (finished_state === new_value)
              return;
            finished_state = new_value;
            if (new_value === true) {
              const state = xhr_hook_map.get(self);
              while (state?._kumiyui_change_listeners.length > 0) {
                const resolve_hook = state._kumiyui_change_listeners.shift();
                if (typeof resolve_hook === "function")
                  resolve_hook();
              }
            }
          }
        });
      }
      async open(method, url, ...args) {
        const state = xhr_hook_map.get(this);
        state._kumiyui_context.method = method;
        state._kumiyui_context.args[0] = url;
        state._kumiyui_context.before_state = "url";
        for (const hook2 of hook_registry?.before) {
          try {
            const modification = await hook2(state._kumiyui_context);
            let _response2 = { status: 200, statusText: "OK", headers: new Headers, body: null, send_to_server: false };
            if (typeof modification !== "undefined") {
              if (modification === false) {
                state._kumiyui_response = null;
                state._kumiyui_blocked = true;
                hook({ obj: this, prop: "send", new_value: () => {}, options: { mask_hook: true, block_overwrite: true } });
                break;
              }
              if (typeof modification === "object") {
                ["status", "statusText", "headers", "body", "send_to_server"].forEach((_res_key) => {
                  if (modification[_res_key] !== undefined)
                    _response2[_res_key] = modification[_res_key];
                  else if (_res_key === "send_to_server")
                    _response2["send_to_server"] = false;
                });
                state._kumiyui_response = _response2;
              } else if (typeof modification === "string") {
                _response2["body"] = modification;
                state._kumiyui_response = _response2;
              }
              break;
            }
          } catch (e) {
            logger3.error(`cannot execute hook listener on XHR hook (type: "before", first call), error:`, e);
          }
        }
        const open_native = super.open(method, state._kumiyui_context.args[0], ...args);
        state._kumiyui_is_opened = true;
        while (state._kumiyui_queued_headers.length > 0) {
          super.setRequestHeader(...state._kumiyui_queued_headers.shift());
        }
        if (state._kumiyui_has_to_queue_response === true) {
          super.send(state._kumiyui_queued_response);
        }
        return open_native;
      }
      setRequestHeader(...args) {
        const state = xhr_hook_map.get(this);
        if (!state._kumiyui_is_opened || super.readyState < 1) {
          state._kumiyui_queued_headers.push(args);
        } else {
          super.setRequestHeader(...args);
          try {
            super.setRequestHeader(...args);
          } catch (e) {
            logger3.error("cannot perform setRequestHeader() on xhr hook, error:", e);
          }
        }
      }
      get response() {
        const state = xhr_hook_map.get(this);
        if (state._kumiyui_response?.body === null)
          return !state._kumiyui_blocked ? super.response : null;
        const r_body = state._kumiyui_response?.body;
        const headers = state._kumiyui_response?.headers || {};
        const b_type = state._kumiyui_response?.responseType !== null ? state._kumiyui_response?.responseType : !state._kumiyui_blocked ? super.responseType : null;
        try {
          switch (b_type) {
            case "json":
              return JSON.parse(r_body);
            case "document":
              return new DOMParser().parseFromString(r_body, "text/html");
            case "arraybuffer":
              return new TextEncoder().encode(r_body).buffer;
            case "blob":
              const content_type_header = headers["content-type"] || headers["Content-Type"] || "";
              const mime_type = content_type_header.split(";")[0].replaceAll(" ", "") || "application/octet-stream";
              return new Blob([r_body], { type: mime_type });
            default:
              return r_body;
          }
        } catch (e) {
          logger3.error(`failed to parse property response, maybe server sent a malformed response, error:`, e);
          return null;
        }
      }
      get responseText() {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_response?.body !== null ? state._kumiyui_response.body : !state._kumiyui_blocked ? super.responseText : "";
      }
      get status() {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_response?.status !== null ? state._kumiyui_response.status : !state._kumiyui_blocked ? super.status : 0;
      }
      get statusText() {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_response?.statusText !== null ? state._kumiyui_response.statusText : !state._kumiyui_blocked ? super.statusText : 0;
      }
      get readyState() {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_blocked !== true ? super.readyState : 3;
      }
      getResponseHeader(...data) {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_response?.headers !== null ? (state._kumiyui_response.headers?.get ?? (() => {}))(...data) : !state._kumiyui_blocked ? super.getResponseHeader(...data) : null;
      }
      getAllResponseHeaders(...data) {
        const state = xhr_hook_map.get(this);
        return state._kumiyui_response?.headers !== null ? (state._kumiyui_response.headers?.getAll ?? (() => {}))(...data) : !state._kumiyui_blocked ? super.getAllResponseHeaders(...data) : "";
      }
      set onreadystatechange(on_state_change_fn) {
        super.onreadystatechange(async (..._o_args) => {
          const state = xhr_hook_map.get(this);
          await await_after_hook(state);
          if (typeof on_state_change_fn === "function") {
            try {
              on_state_change_fn(..._o_args);
            } catch (e) {
              logger3.error("cannot execute function onreadystatechange() on xhr hook, error:", e);
            }
          }
        });
      }
      set onload(onload_fn) {
        super.onload(async (..._o_args) => {
          const state = xhr_hook_map.get(this);
          await await_after_hook(state);
          if (typeof onload_fn === "function") {
            onload_fn(..._o_args);
            try {
              return super.send(context.args[1]);
            } catch (e) {
              logger3.error("cannot execute function onload() on xhr hook, error:", e);
            }
          }
        });
      }
      addEventListener(...args) {
        if (args[0] !== "readystatechange" && args[0] !== "load")
          return super.addEventListener(...args);
        super.addEventListener(args[0], async (..._o_args) => {
          const state = xhr_hook_map.get(this);
          await await_after_hook(state);
          if (typeof args[1] === "function") {
            try {
              args[1](..._o_args);
            } catch (e) {
              logger3.error("cannot execute function given on the second argument of addEventListener() at xhr hook, error:", e);
            }
          }
        });
      }
      async send(body) {
        const state = xhr_hook_map.get(this);
        state._kumiyui_context.args[1] = body;
        state._kumiyui_context.before_state = "body";
        const context2 = state._kumiyui_context;
        Object.defineProperty(this, "json", {
          get() {
            const r_body = context2?.args[1];
            if (typeof r_body === "string") {
              try {
                return JSON.parse(r_body);
              } catch (e) {
                logger3.error("cannot parse JSON with json() at xhr hook, error:", e);
              }
              return null;
            }
          },
          set(value) {
            context2.args[1] = JSON.stringify(value);
          }
        });
        for (const hook of hook_registry?.before) {
          try {
            const modification = await hook(context2);
            let _response2 = { status: 200, statusText: "OK", headers: new Headers, body: null, send_to_server: false };
            if (typeof modification !== "undefined") {
              if (modification === false) {
                state._kumiyui_response = null;
                state._kumiyui_blocked = true;
                break;
              }
              if (modification && typeof modification === "object") {
                ["status", "statusText", "headers", "body", "send_to_server"].forEach((_res_key) => {
                  if (modification[_res_key] !== undefined)
                    _response2[_res_key] = modification[_res_key];
                  else if (_res_key === "send_to_server")
                    _response2["send_to_server"] = false;
                });
                state._kumiyui_response = _response2;
              } else if (typeof modification === "string") {
                _response2["body"] = modification;
                state._kumiyui_response = _response2;
              }
              break;
            }
          } catch (e) {
            logger3.error(`cannot execute hook listener on XHR hook (type: "before", second call), error:`, e);
          }
        }
        if (state._kumiyui_blocked === true)
          return;
        super.addEventListener("readystatechange", async () => {
          if (hook_registry?.after?.length <= 0) {
            state._kumiyui_finished = true;
            return;
          }
          if (this.readyState === 4) {
            let simulated_res = new Response(super.response, {
              status: super.status,
              statusText: super.statusText,
              headers: new Headers((this.getAllResponseHeaders() || "").split(`\r
`).reduce((acc, line) => {
                const [k, v] = line.split(": ");
                if (k)
                  acc[k] = v;
                return acc;
              }, {}))
            });
            for (const hook of hook_registry?.after) {
              try {
                const clone = simulated_res.clone();
                let mod = null;
                try {
                  mod = await hook(context2, clone);
                } catch (e) {
                  logger3.error(`cannot execute hook listener on XHR hook (type: "before"), error:`, e);
                }
                if (typeof mod === "object") {
                  ["status", "statusText", "headers", "body", "send_to_server"].forEach((_res_key) => {
                    if (mod[_res_key] !== undefined)
                      _response[_res_key] = mod[_res_key];
                    else if (_res_key === "send_to_server")
                      _response["send_to_server"] = false;
                  });
                  state._kumiyui_response = _response;
                } else if (typeof mod === "string") {
                  _response["body"] = mod;
                  state._kumiyui_response = _response;
                }
                state._kumiyui_finished = true;
              } catch (e) {
                logger3.error(`error on XHR hook (type: "after"), error:`, e);
              }
            }
          }
        });
        if (!state._kumiyui_is_opened || super.readyState < 1) {
          state._kumiyui_has_to_queue_response = true;
          state._kumiyui_queued_response = context2.args[1];
        } else {
          try {
            if (state._kumiyui_blocked === true || state._kumiyui_response?.send_to_server === false)
              return;
            return super.send(context2.args[1]);
          } catch (e) {
            logger3.error("cannot perform send() on xhr hook, error:", e);
          }
        }
      }
    },
    options: { mask_hook: true, block_overwrite: true }
  });
};
_init_network_hook();
var register_network_hook = (type, callback) => {
  hook_registry[type]?.push(callback);
};

// node_modules/kumiyui/modules/store.js
var g_get;
var g_set;
var tmp_db = undefined;
if (typeof GM_getValue === "function" && typeof GM_setValue === "function") {
  g_get = (key, fallback) => typeof GM_getValue === "function" ? GM_getValue(key, fallback) : fallback;
  g_set = (key, val) => typeof GM_setValue == "function" ? GM_setValue(key, val) : null;
} else {
  tmp_db = new Map;
  g_get = (key, fallback) => tmp_db.has(key) ? tmp_db.get(key) : fallback;
  g_set = (key, val) => tmp_db.set(key, val);
}
var get = g_get;
var set = g_set;

// node_modules/kumiyui/modules/command.js
var b64_encode = window.btoa;
var prompt = window.prompt;
var alert = window.alert;
var trigger_keys = new Map([
  [
    ":",
    {
      altKey: false,
      ctrlKey: false,
      shiftKey: true
    }
  ]
]);
var commands = new Map;
var active_toggles = new Map;
var userscript_menu_id = new Map;
var commands_metad = [];
var logger4 = new Logger({ name: "kumiyui:command", level: Logger.LEVELS.info });
var trigger_command_input = (command_str) => {
  const user_input = typeof command_str !== "string" ? prompt("input command:")?.toString() : command_str;
  if (typeof user_input !== "string" || user_input?.replaceAll(" ", "") === "")
    return;
  const split_input = user_input.split(" ");
  const command = split_input[0]?.toLowerCase();
  const args = split_input.splice(1);
  if (command === "kumiyui.disabledevtoolhelp")
    return set("kumiyui_internal_set__disabledevtoolhelp", true);
  if (!commands.has(command))
    return;
  const command_obj = commands.get(command);
  const callback_fn = typeof command_obj === "object" ? command_obj?.callback_fn : command_obj;
  if (typeof callback_fn !== "function")
    return;
  const main_command = typeof command_obj === "object" ? command_obj?.command : command;
  const has_toggle = active_toggles.has(main_command);
  let is_toggled = undefined;
  if (has_toggle) {
    const toggle_status = active_toggles.get(main_command) === true ? false : true;
    active_toggles.set(main_command, toggle_status);
    set(`toggle.${b64_encode(main_command)}`, toggle_status);
    is_toggled = toggle_status;
    if (userscript_menu_id.has(main_command))
      userscript_menu({
        command: main_command,
        is_toggle: has_toggle,
        is_enabled: toggle_status
      });
  }
  try {
    callback_fn(args, is_toggled);
  } catch (e) {
    logger4.error("failed to execute callback_fn(), error:", e);
  }
};
var userscript_menu = ({ command, is_toggle, is_enabled }) => {
  if (!is_toggle)
    return;
  if (typeof GM_registerMenuCommand !== "function" || typeof GM_unregisterMenuCommand !== "function")
    return;
  if (userscript_menu_id.has(command)) {
    const menu_id = userscript_menu_id.get(command);
    GM_unregisterMenuCommand(menu_id);
    userscript_menu_id.delete(command);
  }
  let userscript_label = `${command}: ${is_enabled ? "enabled" : "disabled"}`;
  const new_menu_obj = GM_registerMenuCommand(userscript_label, () => {
    if (!is_toggle)
      return;
    const prev_toggle_status = get(`toggle.${b64_encode(command)}`) ?? false;
    const toggle_status = prev_toggle_status === true ? false : true;
    active_toggles.set(command, toggle_status);
    set(`toggle.${b64_encode(command)}`, toggle_status);
    const command_obj = commands.get(command);
    const callback_fn = typeof command_obj === "object" ? command_obj?.callback_fn : command_obj;
    try {
      callback_fn([], toggle_status);
    } catch (e) {
      logger4.error("failed to execute callback_fn(), error:", e);
    }
    return userscript_menu({ command, is_toggle, is_enabled: toggle_status });
  });
  userscript_menu_id.set(command, new_menu_obj);
};
window.addEventListener("keydown", (event) => {
  const active_element = document.activeElement;
  if (active_element && (active_element.tagName === "INPUT" || active_element.tagName === "TEXTAREA" || active_element.isContentEditable))
    return;
  const e_key = event.key.toLowerCase();
  if (trigger_keys.has(e_key)) {
    const requirements = trigger_keys.get(e_key);
    for (const require_key of Object.keys(requirements)) {
      if (require_key === "key")
        continue;
      if (event[require_key] !== requirements[require_key])
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    trigger_command_input();
  }
});
var Command = ({ command, aliases, command_name, description, is_toggle, callback_fn }) => {
  if (typeof command !== "string" || typeof aliases !== "object" || typeof description !== "string" || typeof callback_fn !== "function" || !Array.isArray(aliases))
    return;
  command = command?.toString()?.toLowerCase();
  if (command === "kumiyui.disabledevtoolhelp")
    return logger4.debug("you cannot register kumiyui.disabledevtoolhelp because it's a framework command.");
  if (!commands.has(command))
    commands.set(command, callback_fn);
  else
    return logger4.debug(`the command ${command} has already been defined.`);
  commands_metad.push({
    command_name: typeof command_name === "string" && command_name?.toString().replaceAll(" ") !== "" ? command_name : command,
    command,
    aliases: aliases.join("; "),
    description,
    is_toggle
  });
  const command_enabled = get(`toggle.${b64_encode(command)}`, false);
  if (is_toggle === true)
    active_toggles.set(command, command_enabled);
  const aliases_obj = { command, callback_fn };
  aliases.forEach((_alt) => {
    const alt = _alt?.toString()?.toLowerCase();
    if (!commands.has(alt))
      commands.set(alt, aliases_obj);
    else
      return logger4.debug(`failed to define alternative command because the command ${command} has already been defined.`);
  });
  if (is_toggle === true)
    userscript_menu({
      command,
      is_toggle,
      is_enabled: command_enabled
    });
  if (command_enabled) {
    try {
      callback_fn([], command_enabled);
    } catch (e) {
      logger4.error("failed to execute callback_fn(), error:", e);
    }
  }
};
Command({
  command: "help",
  aliases: ["h", "tasukete", "cmd", "cmds", "kumiyui:cmd", "kumiyui::cmd", "kumiyui:cmds", "kumiyui::cmds"],
  command_name: "help",
  description: "get a list of commands",
  is_toggle: false,
  callback_fn: () => {
    if (get("kumiyui_internal_set__disabledevtoolhelp") !== true) {
      alert(`please open console by using "kumiyui!c" command or use devtool's console (from browser).`);
      alert(`to disable this popup before "help" command, you need to use the "kumiyui.disabledevtoolhelp" command.`);
    }
    logger4.table(commands_metad);
  }
});
var ui_console2 = null;
var _set_drop_in_console = (drop_in_console) => ui_console2 = drop_in_console;
Command({
  command: "kumiyui.console",
  aliases: ["kumiyui.c", "kumiyui!console", "kumiyui!c", "kumiyui:console", "kumiyui:c", "kumiyui::console", "kumiyui::c"],
  command_name: "kumiyui.console",
  description: "toggle DropInConsole module",
  is_toggle: false,
  callback_fn: () => {
    if (typeof ui_console2.toggle === "function")
      ui_console2.toggle();
  }
});
// node_modules/kumiyui/kumiyui.js
_set_drop_in_console(_set_trigger_command_input(trigger_command_input));
var Hook = { hook, hook_masker: mask_hook };

// modules/anti_cheat.js
var is_toggled = false;
var cheat_reporter_urls = ["service/learnerV2/logAction", "service/learnerV2/khoaVongThi"];
var o_event_listener = document.addEventListener;
var kokoro = ["visibilitychange", "resize", "leaving"];
Hook.hook({
  obj: document,
  prop: "addEventListener",
  options: {
    mask_hook: true,
    block_overwrite: true
  },
  new_value: (...data) => {
    if (!is_toggled)
      return o_event_listener(...data);
    if (data.length <= 0)
      return o_event_listener(...data);
    if (typeof data[0] !== "string")
      return o_event_listener(...data);
    if (kokoro.includes(data[0] ?? ""))
      return;
    return o_event_listener(...data);
  }
});
register_network_hook("before", (req) => {
  if (!is_toggled)
    return;
  const url = req?.args[0];
  const body = req?.args[1];
  const before_type = req?.before_type;
  if (before_type !== "body")
    return;
  if (!(body instanceof FormData))
    return;
  if (url?.includes(cheat_reporter_urls[1]))
    return false;
  if (url?.includes(cheat_reporter_urls[0])) {
    if (!body.has("baiThiId") || !body.has("action") || !body.has("description"))
      return;
    const action = body.get("action") ?? "";
    if (action !== "submit")
      return false;
  }
});
var anti_cheat = () => {
  const main = (args, toggle) => {
    is_toggled = toggle;
  };
  return {
    command_name: "bypass anticheat",
    command: "bypass_anti_cheat",
    aliases: ["bypass_ac", "b!ac"],
    description: "stop lms.vnedu.vn from tracking whether you exit fullscreen or switch tabs.",
    is_toggle: true,
    callback_fn: main
  };
};

// modules/anti_tracking.js
var is_toggled2 = false;
register_network_hook("before", (req) => {
  if (!is_toggled2)
    return;
  const url = req?.args[0];
  if (url.includes("/user/logged") || url.includes("console-smartux.vnpt.vn/i/bulk"))
    return {
      body: "{}",
      status: "200",
      send_to_server: false
    };
});
var anti_tracking = () => {
  const main = (args, toggle) => {
    is_toggled2 = toggle;
  };
  return {
    command_name: "anti tracking",
    command: "anti_tracking",
    aliases: ["anti_track", "a!track"],
    description: "prevent lms.vnedu.vn from sending telemetry data back to their server",
    is_toggle: true,
    callback_fn: main
  };
};

// modules/no_timer.js
var is_toggled3 = false;
register_network_hook("after", async (req, res) => {
  if (!is_toggled3)
    return;
  const url = req?.args[0];
  if (!url.includes("service/learnerForCourse/startBaiThi"))
    return;
  const body = await res.json();
  body.endTime = null;
  body.durationMinute = 0;
  return { body };
});
var no_timer = () => {
  const main = (args, toggle) => {
    is_toggled3 = toggle;
  };
  return {
    command_name: "no timer",
    command: "no_timer",
    aliases: ["no_time", "inf_time", "inftime", "inf!t"],
    description: "make the exam has infinite time",
    is_toggle: true,
    callback_fn: main
  };
};

// modules/get_answers.js
var exam_detail = {
  contest_id: "",
  round_test_id: "",
  test_id: ""
};
var detailed_q_a = [];
var q_a = [];
register_network_hook("after", async (req, res) => {
  const url = req?.args[0];
  if (!url.includes("service/learnerForCourse/startBaiThi"))
    return;
  const body = await res.json();
  const exam_info = body?.deThiConfig;
  exam_detail.contest_id = exam_info?.cuoc_thi_id;
  exam_detail.round_test_id = exam_info?.vong_thi_id;
  exam_detail.test_id = body?.baiThiId;
  detailed_q_a = [];
  q_a = [];
  let index = 0;
  const exam_content = body?.deThiContent;
  for (const question of exam_content) {
    const q_content = question?.content;
    const q_answer = question?.answers_convert.filter((ans) => ans?.is_true === true);
    detailed_q_a.push({
      question_index: index,
      question_type: question?.type_code,
      total_ans: question?.answers?.length ?? 0,
      correct_answer_index: q_answer?.length > 0 ? question?.answers_convert?.findIndex((ans) => ans?.is_true === true) : null,
      time: Math.floor(Date.now() + index * 1000 * Math.random() + Math.random() * 100)
    });
    q_a.push({
      question: q_content,
      answers: q_answer?.length === 1 ? q_answer[0]?.content ?? "" : q_answer
    });
    index++;
  }
  return;
});
var get_answers = ({ logger }) => {
  const main = async (args) => {
    console.table(q_a);
    const auto_fill = args[0] === "true" ? true : false;
    if (auto_fill === false)
      return;
    for (const question of detailed_q_a) {
      const f_data = new FormData;
      f_data.append("cuocThiId", exam_detail?.contest_id);
      f_data.append("vongThiId", exam_detail?.round_test_id);
      f_data.append("baiThiId", exam_detail?.test_id);
      f_data.append("questionNo", question?.question_index ?? 0);
      for (let i = 0;i < question?.total_ans; i++) {
        f_data.append(`answer[${i}][u]`, question?.correct_answer_index === i ? 1 : 0);
      }
      f_data.append("typeQuestion", question?.question_type);
      f_data.append("_time", question?.time);
      const res = await fetch("/module/coc/service/learnerForCourse/saveAnswer", {
        credentials: "include",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "Sec-GPC": "1",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Priority: "u=0"
        },
        body: f_data,
        method: "POST",
        mode: "cors"
      });
      const res_data = await res.json();
      if (res_data?.success === true) {
        if (logger)
          logger.info(`successfully write answer to the question ${question?.question_index}`);
      } else {
        if (logger)
          logger.warn(`failed to write answer to the question ${question?.question_index}, server response:`, res_data);
      }
    }
    window.alert("filled all of the question input, please consider refreshing the page to see the result");
  };
  return {
    command_name: "get answers <auto_fill: true/false>",
    command: "get_answers",
    aliases: ["get_answer", "get_ans", "g_ans", "g!ans"],
    description: `g!ans <auto_fill: true/false>.
retrieve the exam's answers. (if you use auto_fill, it will automatically fill the answers)`,
    is_toggle: false,
    callback_fn: main
  };
};

// modules/utils/formdata_xhr.js
var create_formdata_body = (obj) => {
  if (!(obj instanceof Object))
    return;
  const f_data = new FormData;
  const keys = Object.keys(obj);
  for (const key of keys) {
    f_data.append(key, obj[key]);
  }
  return f_data;
};

// modules/auto_finish.js
var prompt2 = window.prompt;
var alert2 = window.alert;
var course_metad = { id: null };
var current_courses_data = [];
register_network_hook("after", async (req, res) => {
  const url = req.args[0];
  const res_body = await res.json();
  if (!url.includes("/course/enjoin"))
    return;
  course_metad = res_body?.data?.course;
  current_courses_data = res_body?.data?.courseHoclieus;
});
var auto_finish = () => {
  const main = async (args) => {
    const confirmation = prompt2("this is a very strong action, it will complete the entire course. (the course status will be at 100%). are you sure?");
    if (confirmation?.toString().replaceAll(" ", "").toLowerCase() !== "yes")
      return;
    const courses = current_courses_data;
    for (const courses_child_name of Object.keys(courses)) {
      const courses_child = courses[courses_child_name];
      for (const course of courses_child) {
        const lesson_key = `data[${course?.module_name ?? "lesson_free"}_id]`;
        const payload = {};
        payload[lesson_key] = course?.id;
        payload["data[course_id]"] = course_metad?.id, payload["data[course_module_id]"] = course?.course_module_id, payload["data[result_percent]"] = 100;
        let p_case_url = (course?.module_name ?? "lesson_free").split("_");
        for (let i = 1;i < p_case_url.length; i++) {
          p_case_url[i] = p_case_url[i]?.toString().charAt(0).toUpperCase() + p_case_url[i].slice(1);
        }
        p_case_url = p_case_url.join("");
        await fetch(`https://thptvominhduc.lms.vnedu.vn/module/lms/service/${p_case_url}Interactive/saveUserInteractive`, {
          credentials: "include",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
          },
          body: create_formdata_body(payload),
          method: "POST",
          mode: "cors"
        });
      }
    }
    alert2("finished, you can now refresh the page to see whether has the course completed");
  };
  return {
    command_name: "auto finish",
    command: "auto_finish",
    aliases: ["auto_complete", "a!finish"],
    description: "auto finish the current course on the page you are on (usually on route /app/vao-hoc/...)",
    is_toggle: false,
    callback_fn: main
  };
};

// modules/dl_doc.js
var document_pages = {};
register_network_hook("after", async (req, res) => {
  const url = req.args[0];
  if ((!url.includes("filesystem/client/viewer") || !url.includes("?format=")) && !url.includes("service/lessonPresentation/study"))
    return;
  document_pages = await res.json();
});
var dl_doc = ({ logger }) => {
  const main = async () => {
    console.log(document_pages);
    if (document_pages.success !== true)
      return logger.error("latest document return success = false");
    logger.info("found information about latest document");
    if (document_pages.msg?.toString().toLowerCase().replaceAll(" ", "") === "study") {
      const document_info = document_pages?.data?.lessonPresentation;
      const file_url = document_info?.file_url;
      const file_extension2 = document_info?.file_extension ?? "pdf";
      const file_name = new URL(file_url).pathname.split("/").splice(-1) ?? `${dl}.${file_extension2}`;
      try {
        const download_link = document.createElement("a");
        download_link.href = file_url;
        download_link.download = file_name;
        document.body.appendChild(download_link);
        download_link.click();
        document.body.removeChild(download_link);
        download_link.remove();
        logger.info("file downloaded!");
      } catch (e) {
        logger.error("failed to download the document:", e);
      }
    }
    if (document_pages.msg?.toString().toLowerCase().replaceAll(" ", "") === "images" && Array.isArray(document_pages.data)) {
      const arr_img = document_pages.data ?? [];
      for (let index = 0;index < arr_img.length; index++) {
        const img = arr_img[index];
        await new Promise((resolve) => setTimeout(resolve, 2500));
        await new Promise(async (resolve) => {
          try {
            const response = await fetch(img, { credentials: "include" });
            const blob = await response.blob();
            let file_extension2 = ".png";
            if (blob.type) {
              const mime_map = {
                "image/png": ".png",
                "image/jpeg": ".jpg",
                "image/gif": ".gif",
                "image/webp": ".webp",
                "image/svg+xml": ".svg",
                "application/pdf": ".pdf"
              };
              if (mime_map[blob.type])
                file_extension2 = mime_map[blob.type];
            }
            if (blob.size <= 0)
              return logger.error(`image_${index + 1}${file_extension2} return empty blob!!`);
            const download_url = URL.createObjectURL(blob);
            const download_link = document.createElement("a");
            download_link.href = download_url;
            download_link.download = `image_${index + 1}_${Date.now()}${file_extension2}`;
            document.body.appendChild(download_link);
            download_link.click();
            document.body.removeChild(download_link);
            download_link.remove();
            URL.revokeObjectURL(download_url);
            logger.info(`successfully downloaded image_${index + 1}${file_extension2}`);
            resolve();
          } catch (e) {
            logger.error(`failed to download image_${index + 1}${file_extension}, error:`, e);
            resolve();
          }
        });
      }
      await Promise.all(fetch_promises);
      logger.info("all images downloaded!!");
    }
  };
  return {
    command_name: "download document pages/presentation slides",
    command: "dl_doc",
    aliases: ["dl!doc", "dl_pdf", "dl!pdf", "dl_presentation_slides", "dl_presentation_slide", "dl_slide", "rip_slide", "dl!slide"],
    description: "perform a 1:1 download of the course document pages (note: some documents might be uploaded as images)",
    is_toggle: false,
    callback_fn: main
  };
};

// index.js
var logger5 = new Logger({
  name: "lms_vnedu_cheat",
  level: Logger.LEVELS.info
});
[
  anti_cheat(),
  anti_tracking(),
  no_timer(),
  get_answers({ logger: logger5.child("g!ans") }),
  auto_finish(),
  dl_doc({ logger: logger5.child("dl!doc") })
].forEach((command) => {
  Command(command);
});
