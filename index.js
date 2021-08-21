require('dotenv').config()

const discord = require('discord.js')
const bot = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_VOICE_STATES] })
bot.commands = new discord.Collection()

const commands = require('./commands')
commands.forEach(command => {
    bot.commands.set(command.data.name, command)
})

bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const command = bot.commands.get(interaction.commandName)

    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
})

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`)
})

bot.login(process.env.TOKEN)