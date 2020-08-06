import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { User, Message } from 'discord.js';
import path from 'path';
import { prefix, owners } from '../Config'

declare module "discord-akairo" {
    interface AkairoClient {
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler
    }
}

interface BotOptions {
    token: string;
    owners?: string | string[]
}

export default class BotClient extends AkairoClient {
    public config: BotOptions;
    public listenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: path.join(__dirname, '..', 'listeners')
    })
    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: path.join(__dirname, '..', 'commands'),
        prefix,
        allowMention: true,
        handleEdits: true,
        commandUtil: true,
        commandUtilLifetime: 3e5,
        defaultCooldown: 6e4,
        argumentDefaults: {
            prompt: {
                modifyStart: (__: Message, str: string) => `${str}\n\nType \`cancel\` to cancel the command...`,
                modifyRetry: (__: Message, str: string) => `${str}\n\nType \`cancel\` to cancel the command...`,
                timeout: "You took too long, command was automatically cancelled.",
                ended: "You exceeded the maximum amount of tries. Command cancelled.",
                cancel: "This command was cancelled.",
                retries: 3,
                time: 3e4
            }
        },
        ignoreCooldown: owners,
        ignorePermissions: owners
    })

    public constructor(config: BotOptions) {
        super({
            ownerID: config.owners
        })

        this.config = config;
    }

    private async _init(): Promise<void> {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            process
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }

    public async start(): Promise<String> {
        await this._init();
        return this.login(this.config.token);
    }

}