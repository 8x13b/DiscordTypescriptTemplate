import { token, owners } from './Config';
import BotClient from "./client/botClient";

const client: BotClient = new BotClient({ token, owners });
client.start();