require('dotenv').config()

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const commands = require('./commands')

const clientId = '782018021401165828'
const guildId = '111106846151933952'

const commandJson = []
commands.forEach(command => {
    commandJson.push(command.data.toJSON())
})

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.')

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commandJson },
        )

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()