import { Client, GatewayIntentBits } from "discord.js"
import * as dotenv from "dotenv"
import fs from "fs" // File System for saving data on cache
import { stringify } from "querystring"

dotenv.config();

const CACHELOC = 'data/problems.json';
const USERSLOC = 'data/userdata.json';

const PREFIX = 'pop ';
const LINKMODEL = "https://codeforces.com/";
const PROBLEMSET = "problemset/problem/";
const PROFILE = "profile/";

let commands = [
  PREFIX + "ping",
  PREFIX + "question",
]

async function requestAPIProblems() {
  try {
      const response = await fetch("https://codeforces.com/api/problemset.problems");
      const data = await response.json();

      if (data.status === "OK") {
        return data.result.problems;
      }
    }
    catch (error) {
      console.error(error);
    }
}

async function loadAPIData() {
  if (fs.existsSync(CACHELOC)) {
      globalThis.PROBLEMS = JSON.parse(fs.readFileSync(CACHELOC, 'utf-8'));
      
    } else {
      const problems = await requestAPIProblems();
      if (problems != undefined) {
        fs.writeFileSync(CACHELOC, JSON.stringify(problems, null, 2));
        globalThis.PROBLEMS = problems;
      }

    }
}

async function loadUserData() {
  if (fs.existsSync(USERSLOC)) {
    globalThis.USERDATA = JSON.parse(fs.readFileSync(USERSLOC, 'utf-8'));
  } else {
    globalThis.USERDATA = [];
    fs.writeFileSync(USERSLOC, JSON.stringify(globalThis.USERDATA, null, 2));
  }
}

async function findUser(username) {
  let res = await fetch(LINKMODEL + PROFILE + username);
  if (res.ok) {
    console.log();
  } else {

  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
})

client.on("messageCreate", async (message) =>{
  if (message.author.bot) return;

  if (message.content === commands[0]) {
    message.reply("pong");
  }

  if (message.content.startsWith(commands[1])) {
      const idTexto = message.content.slice(commands[1].length).trim();

      const idNumero = parseInt(idTexto);
      const problem = globalThis.PROBLEMS[idNumero];
      
      if (problem) {
        message.reply(LINKMODEL + PROBLEMSET + problem.contestId + "/" + problem.index);
      } else {
        message.reply("Problema não encontrado!");
      }
  }
})

client.on('ready', (client) => {
  console.log(`${client.user.tag} está online!`)

  loadAPIData();
  loadUserData();

  console.log(globalThis.PROBLEMS.length);

})

client.login(process.env.TOKEN)