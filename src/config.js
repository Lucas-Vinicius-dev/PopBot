import 'dotenv/config';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { Client, Intents } = require('discord.js');

export const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
    Intents.FLAGS.GUILD_MEMBERS
  ]
});