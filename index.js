import Discord from "discord.js";
const { Client, Intents, MessageEmbed } = Discord;
import * as dotenv from "dotenv"
import fs from "fs"
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
        if (!fs.existsSync('data')) {
          fs.mkdirSync('data', { recursive: true });
        }
        fs.writeFileSync(CACHELOC, JSON.stringify(problems, null, 2));
        globalThis.PROBLEMS = problems;
      }

    }
}

async function loadUserData() {
  if (fs.existsSync(USERSLOC)) {
    globalThis.USERDATA = JSON.parse(fs.readFileSync(USERSLOC, 'utf-8'));
  } else {
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data', { recursive: true });
    }
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

function createProblemEmbed(problem) {
  const problemLink = LINKMODEL + PROBLEMSET + problem.contestId + "/" + problem.index;
  
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Problema ${problem.index} - ${problem.name}`)
    .setURL(problemLink)
    .setDescription(`**Informações do Problema**`)
    .addFields(
      {
        name: '📋 ID do Concurso',
        value: `${problem.contestId}`,
        inline: true
      },
      {
        name: '🔤 Índice',
        value: `${problem.index}`,
        inline: true
      },
      {
        name: '⭐ Pontos',
        value: `${problem.points || 'N/A'}`,
        inline: true
      },
      {
        name: '📊 Dificuldade (Rating)',
        value: `${problem.rating || 'N/A'}`,
        inline: true
      },
      {
        name: '🏷️ Tags',
        value: problem.tags.length > 0 ? problem.tags.join(', ') : 'Sem tags',
        inline: false
      },
      {
        name: '🔗 Link',
        value: `[Abrir no Codeforces](${problemLink})`,
        inline: false
      }
    )
    .setFooter({ 
      text: 'Codeforces Bot',
      iconURL: 'https://codeforces.com/favicon.ico'
    })
    .setTimestamp();
  
  return embed;
}

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
    Intents.FLAGS.GUILD_MEMBERS
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
        const problemEmbed = createProblemEmbed(problem);
        message.reply({ embeds: [problemEmbed]});
      } else {
        message.reply("Problema não encontrado!");
      }
  }
})

client.on('ready', async (client) => {
  console.log(`${client.user.tag} está online!`)

  await loadAPIData();
  await loadUserData();

  console.log(globalThis.PROBLEMS.length);

})

client.login(process.env.TOKEN);