import * as socketIo from "socket.io-client"
import { askForForm } from "./src/prompt-helper.js"
import { startMessing } from "./src/mess.js"
import { isIPv6 } from "net"
import colors from "ansi-colors"

(async () => {
    try {
        let hostAddress = [
            {
                name: "address",
                message: "Address",
                initial: "127.0.0.1",
                value: "127.0.0.1"
            },
            {
                name: "port",
                message: "Port",
                initial: "3020",
                value: "3020"
            }
        ]
        await askForForm("Enter target address", hostAddress);

        let host = isIPv6(hostAddress[0].value) ? `[${hostAddress[0].value}]` : hostAddress[0].value;
        let port = hostAddress[1].value;

        let socket = socketIo.connect(`http://${host}:${port}`, {
            transports: ["websocket"],
            timestampRequests: true,
            reconnectionAttempts: 3
        });

        let connected = false;

        socket.on("connect_error", () => {
            console.warn(colors.dim("Could not connect to host"));
        });

        socket.on("disconnect", () => {
            console.log(colors.bold("Disconnected"));
            process.exit(0);
        });

        socket.on("discordUser", (data) => {
            if (!connected) {
                console.log(colors.blueBright(`────────────────────────────────\nDiscord ID: ${data.id}\nDiscord username: ${data.username}#${data.discriminator}\nProfile Picture: https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=4096\nPremium: ${data.premium_type == 0 ? "No" : data.premium_type == 1 ? "Nitro Classic" : "Nitro"}\n────────────────────────────────`));
                console.log(colors.bold("Connected to PreMiD"));
                startMessing(socket);
                connected = true;
            }
        });

        socket.open();

    } catch {}
})();
