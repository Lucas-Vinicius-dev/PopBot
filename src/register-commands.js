import { client } from './config.js';
import { commands } from './commands.js';

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