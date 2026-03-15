const { SlashCommandBuilder } = discord;
const discord = await import('discord.js');

export const commands = [
  {
    name: 'ping',
    description: 'Responde com Pong!'
  },
  {
    name: 'snake',
    description: 'Uma pequena referência...'
  },
  {
    name: 'codeforce',
    description: 'Comandos do Codeforces',
    options: [
      {
        name: 'profile',
        description: 'Exibe o perfil de um usuário',
        type: 1,
        options: [
          {
            name: 'nome',
            description: 'Nome do usuário (ex: LucasD+)',
            type: 3,
            required: true
          }
        ]
      },
      {
        name: 'contest',
        description: 'Lista os próximos contests',
        type: 1
      }
    ]
  }
];