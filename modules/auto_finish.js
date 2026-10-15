import { Network } from "kumiyui"
import { create_formdata_body } from "./utils/formdata_xhr"

// store the native prompt first
const prompt = window.prompt;
const alert = window.alert;

// retrieving courses data
let course_metad = { "id": null }
let current_courses_data = [];
Network.register_network_hook("after", async (req, res) => {
  const url = req.args[0];
  const res_body = await res.json();

  // only extract data from the url
  if (!url.includes("/course/enjoin"))
    return;

  course_metad = res_body?.data?.course;
  current_courses_data = res_body?.data?.courseHoclieus;
})

/**
 * @param {object} options
 * @param {Logger} options.logger
 */
export const auto_finish = () => {
  const main = async (args) => {
    // ask for user confirmation
    const confirmation = prompt("this is a very strong action, it will complete the entire course. (the course status will be at 100%). are you sure?");
    if (confirmation?.toString().replaceAll(" ", "").toLowerCase() !== "yes")
      return;

    // acquire the course data from the time command gets triggered
    const courses = current_courses_data;

    // create user interaction payload
    for (const courses_child_name of Object.keys(courses)) {
      const courses_child = courses[courses_child_name];
      for (const course of courses_child) {
        // course?.module_name: lesson_free
        const lesson_key = `data[${course?.module_name ?? "lesson_free"}_id]`;
        const payload = {};
        
        // the id key is dynamic
        payload[lesson_key] = course?.id;

        // apply other data
        payload["data[course_id]"] = course_metad?.id,
        payload["data[course_module_id]"] = course?.course_module_id,
        payload["data[result_percent]"] = 100 // 100 percent mark as completed

        // render pascal case
        let p_case_url = (course?.module_name ?? "lesson_free").split("_");
        
        // usually, pascal case start to uppercase from 2nd index
        for (let i = 1; i < p_case_url.length; i++) {
          p_case_url[i] = p_case_url[i]?.toString().charAt(0).toUpperCase() + p_case_url[i].slice(1);
        }

        // turn it back to string
        p_case_url = p_case_url.join("");

        // send to the server
        await fetch(`https://thptvominhduc.lms.vnedu.vn/module/lms/service/${p_case_url}Interactive/saveUserInteractive`, {
          "credentials": "include",
          "headers": {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
          }, 
          "body": create_formdata_body(payload),
          "method": "POST",
          "mode": "cors"
        });
      }
    }

    // finished
    alert("finished, you can now refresh the page to see whether has the course completed");
  }

  return {
    command_name: "auto finish",
    command: "auto_finish",
    aliases: ["auto_complete", "a!finish"],
    description: "auto finish the current course on the page you are on (usually on route /app/vao-hoc/...)",
    is_toggle: false,
    callback_fn: main
  }
}