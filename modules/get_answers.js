import { Logger, Network } from "kumiyui";

// just silently capture the data from the start
const exam_detail = {
  contest_id: "",
  round_test_id: "",
  test_id: ""
};
let detailed_q_a = [];
let q_a = [];
Network.register_network_hook("after", async (req, res) => {
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

  // change the exam_detail
  const exam_info = body?.deThiConfig;
  exam_detail.contest_id = exam_info?.cuoc_thi_id;
  exam_detail.round_test_id = exam_info?.vong_thi_id;
  exam_detail.test_id = body?.baiThiId;

  // successfully parsing the body? clean the q_a
  detailed_q_a = [];
  q_a = [];

  // get answers
  let index = 0;
  const exam_content = body?.deThiContent;
  for (const question of exam_content) {
    const q_content = question?.content;
    const q_answer = question?.answers_convert.filter((ans) => ans?.is_true === true);
    // for auto_fill
    detailed_q_a.push({
      question_index: index,
      question_type: question?.type_code,
      total_ans: question?.answers?.length ?? 0,
      correct_answer_index: q_answer?.length > 0
        ? question?.answers_convert?.findIndex((ans) => ans?.is_true === true)
        : null,
      // random answer selection time
      time: Math.floor(Date.now() + (index * 1000 * Math.random()) + (Math.random() * 100))
    })

    // for clean output
    q_a.push({
      question: q_content,
      answers: (q_answer?.length === 1) ? (q_answer[0]?.content ?? "") : q_answer
    })

    // increase the index
    index++;
  }

  // just allow the client to get clean data from the server, you don't need to spoof anything here
  // by return nothing (empty), the framework will understand that the cheat doesn't want to modify
  // any data
  return;
})

/**
 * @param {object} options
 * @param {Logger} options.logger
 */
export const get_answers = ({ logger }) => {
  const main = async (args) => {
    // i forgot that logger doesn't have built-in support for table
    console.table(q_a);

    // auto_fill?
    const auto_fill = args[0] === "true" ? true : false;
    if (auto_fill === false)
      return; // if not using auto_fill feature then there's no need to continue

    for (const question of detailed_q_a) {
      // it's not worth using the formdata_xhr util because i still have to map key manually
      // create payload
      const f_data = new FormData();

      // apply content to payload
      f_data.append("cuocThiId", exam_detail?.contest_id);
      f_data.append("vongThiId", exam_detail?.round_test_id);
      f_data.append("baiThiId", exam_detail?.test_id);
      f_data.append("questionNo", question?.question_index ?? 0);
      
      // for answers
      for (let i = 0; i < question?.total_ans; i++) {
        f_data.append(
          // answer key
          `answer[${i}][u]`,
          // 1 = true; 0 = false
          question?.correct_answer_index === i ? 1 : 0
        )
      }

      // some metadata left
      f_data.append("typeQuestion", question?.question_type)
      f_data.append("_time", question?.time)

      // send the payload
      const res = await fetch("/module/coc/service/learnerForCourse/saveAnswer", {
        "credentials": "include",
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Priority": "u=0"
        },
        "body": f_data,
        "method": "POST",
        "mode": "cors"
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

    // announce back to user
    window.alert("filled all of the question input, please consider refreshing the page to see the result");
  }

  return {
    command_name: "get answers <auto_fill: true/false>",
    command: "get_answers",
    aliases: ["get_answer", "get_ans", "g_ans", "g!ans"],
    description: "g!ans <auto_fill: true/false>.\nretrieve the exam's answers. (if you use auto_fill, it will automatically fill the answers)",
    is_toggle: false,
    callback_fn: main
  }
}