# lms_vnedu_cheat
hello,\
recently, I have made a cheat for `lms.vnedu.vn` platform. I don't know what to write here, I have implemented the cheat with my new framework.

## installation
1. install userscript extension. (I recommend using tampermonkey)
2. install the script (it's minified; however, you can still check the source code):
- **click on the raw link**: https://raw.githubusercontent.com/kumiyuki/azota_cheat/refs/heads/main/dist/lms_vnedu_cheat.user.js
3. press `Install`

## modules
- [bypass_anti_cheat](./modules/anti_cheat.js): stop lms.vnedu.vn from tracking whether you exit fullscreen or switch tabs.
- [anti_tracking](./modules/anti_tracking.js): prevent lms.vnedu.vn from sending telemetry data back to their server.
- [auto_finish](./modules/auto_finish.js): auto finish the current course on the page you are on (usually on route /app/vao-hoc/...)
- [get_answers](./modules/get_answers.js): retrieve the exam's answers. (if you use auto_fill, it will automatically fill the answers)
- [no_timer](./modules/no_timer.js): make the exam has infinite time

## how to use
1. open devtool when you get to the `{school name}.lms.vnedu.vn`
2. to trigger command prompt, you either press `/` or `Shift + ;` on your keyboard.
3. type `help` or `h` for help command, and look into the devtool's console for command list.

> [!note]
> - you can repeat step 2 and type the command you want from the help page
> - you can also use tampermonkey's menu to turn on toggles.

> [!note]
> for auto filling feature in [get_answers](./modules/get_answers.js) module, you can use:
> - `g!ans true` to turn on auto filling (you will need to refresh the page after to see the changes)
> - `g!ans false` to just show the answer in console tab of devtool.
> with `g!ans` is an alias of `get_answers` command.

# disclaimer
The content and code in this repository are provided solely for **educational and research purposes**.\
**You're 100% responsible for your own actions.** By downloading, viewing, or utilizing any code or information provided in this repository, you acknowledge and agree that the creator/author of this project is in no way liable for damages, bans, or legal consequences that may arise from misuse or misapplication.