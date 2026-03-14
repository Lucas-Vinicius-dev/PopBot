import { Client, GatewayIntentBits } from "discord.js"
import * as dotenv from "dotenv"

dotenv.config()

const prefix = '&';

let commands = [
  prefix + "ping",
]

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
})

client.on("messageCreate", (message) =>{
  if (message.author.bot) return;

  if (message.content === commands[0]) {
    message.reply("pong");
  }

})

client.on('ready', (client) => {
  console.log(`${client.user.tag} está online!`)
})

client.login(process.env.TOKEN)