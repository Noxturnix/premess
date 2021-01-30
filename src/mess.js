import { askToSelect, askForForm } from "./prompt-helper.js"
import { readFileSync } from "fs"
import colors from "ansi-colors"

export const startMessing = async (socket) => {
    while (true) {
        let actions = [
            "Set simple activity",
            "Set custom activity",
            "Clear activity",
            "Disconnect and exit (will clear activity)"
        ]
        await askToSelect("Select an action", actions);

        let selectedAction = actions.filter(a => a.enabled)[0];
        switch (selectedAction.index) {
            case 0:
                let simpleActivity = [
                    {
                        name: "details",
                        message: "Details",
                        initial: "Viewing page:",
                        value: "Viewing page:"
                    },
                    {
                        name: "state",
                        message: "State",
                        initial: "Homepage",
                        value: "Homepage"
                    },
                    {
                        name: "imageText",
                        message: "Image text",
                        initial: "PreMiD",
                        value: "PreMiD"
                    }
                ]
                await askForForm("Enter activity options", simpleActivity);

                socket.emit("setActivity", {
                    clientId: "792735245488488458",
                    presenceData: {
                        largeImageKey: "lg",
                        startTimestamp: parseInt(Date.now() / 1000),
                        details: simpleActivity[0].value,
                        state: simpleActivity[1].value,
                        largeImageText: simpleActivity[2].value
                    },
                    trayTitle: "",
                    playback: true
                })
                console.log(colors.bold.greenBright("Activity set!"));

                break;
            case 1:
                let filename = "custom-activity.json"
                let customActivity;

                try {
                    customActivity = JSON.parse(readFileSync(`./${filename}`));
                } catch {
                    console.warn(colors.redBright(`Cannot parse data from file "${filename}"`));
                }

                if (customActivity) {
                    socket.emit("setActivity", customActivity)
                    console.log(colors.bold.greenBright("Activity set!"));
                }

                break;
            case 2:
                socket.emit("clearActivity");
                break;
            case 3:
                socket.close();
        }
    }
}
