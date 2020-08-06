import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { time } from 'console';

export default class PingCommand extends Command {
    public constructor() {
        super("ping", {
            aliases: ["ping"],
            category: "public",
            description: {
                content: "Check the latency of the Discord API to the Backslash bot.",
                usage: "ping",
                examples: [
                    "ping"
                ]
            },
            ratelimit: 3,
        })
    }

    public exec(message: Message): Promise<Message> {
        time()
        return message.util.send(`Pong! \`${this.client.ws.ping}ms\``)
    }
}