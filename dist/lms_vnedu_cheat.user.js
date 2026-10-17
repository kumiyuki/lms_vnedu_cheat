// ==UserScript==
// @name            vnEdu LMS cheat
// @version         2026-10-18
// @namespace       https://github.com/kumiyuki/lms_vnedu_cheat/
// @description     cheat for saas lms.vnedu.vn
// @author          kumiyuki
// @include         /^https?:\/\/.*\.lms\.vnedu\.vn\/.*$/
// @require         https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.2/jszip.min.js
// @require         https://cdn.jsdelivr.net/gh/kumiyuki/kumiyui@v1.4.4/cdn_build/dist/kumiyui.min.js
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
const require=r=>{if("kumiyui"===r)return window.Kumiyui;throw new Error("Dynamic require of "+moduleName+" is not supported.")};
(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // index.js
  var import_kumiyui7 = __require("kumiyui");

  // modules/anti_cheat.js
  var import_kumiyui = __require("kumiyui");
  var is_toggled = false;
  var cheat_reporter_urls = ["service/learnerV2/logAction", "service/learnerV2/khoaVongThi"];
  var o_event_listener = document.addEventListener;
  var kokoro = ["visibilitychange", "resize", "leaving"];
  import_kumiyui.Hook.hook({
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
  import_kumiyui.Network.register_network_hook("before", (req) => {
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
  var import_kumiyui2 = __require("kumiyui");
  var is_toggled2 = false;
  import_kumiyui2.Network.register_network_hook("before", (req) => {
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
  var import_kumiyui3 = __require("kumiyui");
  var is_toggled3 = false;
  import_kumiyui3.Network.register_network_hook("after", async (req, res) => {
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
  var import_kumiyui4 = __require("kumiyui");
  var exam_detail = {
    contest_id: "",
    round_test_id: "",
    test_id: ""
  };
  var detailed_q_a = [];
  var q_a = [];
  import_kumiyui4.Network.register_network_hook("after", async (req, res) => {
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

  // modules/auto_finish.js
  var import_kumiyui5 = __require("kumiyui");

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
  var prompt = window.prompt;
  var alert = window.alert;
  var course_metad = { id: null };
  var current_courses_data = [];
  import_kumiyui5.Network.register_network_hook("after", async (req, res) => {
    const url = req.args[0];
    const res_body = await res.json();
    if (!url.includes("/course/enjoin"))
      return;
    course_metad = res_body?.data?.course;
    current_courses_data = res_body?.data?.courseHoclieus;
  });
  var auto_finish = () => {
    const main = async (args) => {
      const confirmation = prompt("this is a very strong action, it will complete the entire course. (the course status will be at 100%). are you sure?");
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
      alert("finished, you can now refresh the page to see whether has the course completed");
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
  var import_kumiyui6 = __require("kumiyui");
  var document_pages = {};
  import_kumiyui6.Network.register_network_hook("after", async (req, res) => {
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
  var logger = new import_kumiyui7.Logger({
    name: "lms_vnedu_cheat",
    level: import_kumiyui7.Logger.LEVELS.info
  });
  [
    anti_cheat(),
    anti_tracking(),
    no_timer(),
    get_answers({ logger: logger.child("g!ans") }),
    auto_finish(),
    dl_doc({ logger: logger.child("dl!doc") })
  ].forEach((command) => {
    import_kumiyui7.Command(command);
  });
})();
