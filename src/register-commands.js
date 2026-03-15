import 'dotenv/config';
import { createRequire } from 'module';
import { commands } from './commands.js';

const require = createRequire(import.meta.url);
const { Client, Intents } = require('discord.js');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
    Intents.FLAGS.GUILD_MEMBERS
  ]
});

client.on('ready', async () => {
  try {
    console.log('Registering commands...');
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
      console.log('Guild not found!');
      process.exit(1);
    }
    
    await guild.commands.set(commands);
    console.log('Commands registered successfully!');
    process.exit(0);
  } catch (error) {
    console.log(`an error occurred while registering the commands: ${error}`);
    process.exit(1);
  }
});

client.login(process.env.TOKEN);