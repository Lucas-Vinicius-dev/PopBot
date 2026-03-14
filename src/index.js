import { Client, GatewayIntentBits } from "discord.js"
import * as dotenv from "dotenv"
import { commands } from "./commands.js"

dotenv.config()


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
})

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case 'ping':
      interaction.reply('pong');
      break;
    case 'snake':
      const desenhoFora = 
`
\`\`\`text
            ______________________
           /                      \\
          /        ________        \\
   ______/        /        \\        \\______
  (             /            \\             )
  \\___________/______________\\___________/
\`\`\``;

    interaction.reply(desenhoFora);
    break;
  }
  }
)

client.on('ready', (client) => {
  console.log(`${client.user.tag} está online!`)
})

client.login(process.env.TOKEN)