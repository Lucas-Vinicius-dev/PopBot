import 'dotenv/config';
import { CodeforcesService } from './services/codeforces-services.js';

const discord = await import('discord.js');
const { Client, Intents, MessageEmbed } = discord;
// bot client permissions
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
    Intents.FLAGS.GUILD_MEMBERS
  ]
})
// slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  switch (interaction.commandName) {
    case 'ping':
      await interaction.reply('Pong! 🏓');
      break;
    case 'snake': {
      const desenho =
`\`\`\`text
            ______________________
           /                      \\
          /        ________        \\
   ______/        /        \\        \\______
  (             /            \\             )
  \\___________/______________\\___________/
\`\`\``;
      await interaction.reply(desenho);
      break;
    }
    case 'codeforce': {
      const sub = interaction.options.getSubcommand(); // subcommands selection

      // profile
      if (sub === 'profile') {
        const handle = interaction.options.getString('handle').trim();
        await interaction.deferReply();

        try {
          console.log(`Buscando perfil: "${handle}"`);
          const user = await CodeforcesService.getUser(handle);
          
          if (!user) {
            await interaction.editReply(`❌ Usuário não encontrado: **${handle}**`);
            break;
          }
          
          console.log(`Perfil encontrado:`, user);

          const embed = new MessageEmbed()
            .setColor(0x1e90ff)
            .setTitle(`Perfil de ${user.handle}`)
            .setURL(`https://codeforces.com/profile/${user.handle}`)
            .setThumbnail(user.titlePhoto)
            .addFields(
              { name: '🏆 Rating',  value: `${user.rating ?? 'N/A'}`,    inline: true },
              { name: '🎖️ Rank',    value: user.rank ?? 'N/A',           inline: true },
              { name: '📈 Máximo',  value: `${user.maxRating ?? 'N/A'}`, inline: true }
            )
            .setFooter({ text: 'Codeforces' });

          await interaction.editReply({ embeds: [embed] });

        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
          await interaction.editReply(`Não foi possível encontrar o usuário: **${handle}**`);
        }
      }
      else if (sub === 'contest') {
        await interaction.deferReply();

        try {
          const contests = await CodeforcesService.getUpcomingContests();

          if (contests.length === 0) {
            await interaction.editReply('Nenhum contest agendado no momento.');
            break;
          }

          const embed = new MessageEmbed()
            .setColor(0xf4a400)
            .setTitle('📅 Próximos Contests — Codeforces')
            .setURL('https://codeforces.com/contests');

          for (const contest of contests) {
            const durHours = Math.floor(contest.durationSeconds / 3600);
            const durMin = Math.floor((contest.durationSeconds % 3600) / 60);

            embed.addFields({
              name: contest.name,
              value: [
                `🕐 <t:${contest.startTimeSeconds}:F> (<t:${contest.startTimeSeconds}:R>)`,
                `⏱️ Duração: ${durHours}h ${durMin}min`,
                `🔗 [Abrir contest](https://codeforces.com/contests/${contest.id})`,
              ].join('\n'),
            });
          }

          embed.setFooter({ text: 'Horários exibidos no seu fuso local' });

          await interaction.editReply({ embeds: [embed] });

        } catch (err) {
          await interaction.editReply(`❌ Erro ao buscar contests: ${err.message}`);
        }
      }

      break;
}
  }
  }
)

client.on('ready', (client) => {
  console.log(`${client.user.tag} está online!`)
})

client.login(process.env.TOKEN)