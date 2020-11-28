require('dotenv').config()

const discord = require('discord.js')
const bot = new discord.Client()

const command = require('./commands')

bot.login(process.env.TOKEN)
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`)
})
bot.on('message', msg => {
    const mentionedUser = msg.mentions.users.first()
    if (mentionedUser === bot.user) {
        command.run(msg)
    }
})