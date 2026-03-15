import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { CodeforcesService } from '../services/codeforces.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rating')
    .setDescription('Consulta o rating de um usuário no Codeforces')
    .addStringOption((opt) =>
      opt.setName('handle').setDescription('Handle do usuário').setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply(); // No timeout while searching
    const handle = interaction.options.getString('handle');

    try {
      const user = await CodeforcesService.getUser(handle);
      const color = RANK_COLORS[user.rank?.split(' ').pop()] ?? 0x7289da;

      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`${user.handle} — Codeforces`)
        .setURL(`https://codeforces.com/profile/${user.handle}`)
        .setThumbnail(`https:${user.titlePhoto}`)
        .addFields(
          { name: 'Rating', value: `${user.rating ?? 'N/A'}`, inline: true },
          { name: 'Rank', value: user.rank ?? 'N/A', inline: true },
          { name: 'Máximo', value: `${user.maxRating ?? 'N/A'} (${user.maxRank})`, inline: true }
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply(`❌ ${err.message}`);
    }
  },
};