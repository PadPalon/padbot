const fs = require('fs')
var say = require('say')
var ttsFilename = 'tts'

const { SlashCommandBuilder } = require('@discordjs/builders')
const { 
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus
} = require('@discordjs/voice')

const run = interaction => {
    const ttsPath = `${ttsFilename}_${interaction.id}.wav`
    const targetUser = interaction.options.getUser('target')
    createTTS(targetUser, ttsPath, () => {
        if (fs.existsSync(ttsPath)) {
            interaction.guild.members.fetch(targetUser).then(user => {
                const channel = user.voice.channel
                if (channel && channel.joinable) {
                    interaction.reply({ content: 'The sucker won\'t see it coming!', ephemeral: true })
                    bullyTarget(channel, ttsPath)
                } else {
                    interaction.reply({ content: 'That person doesn\'t seem to be online. Get them yourself!', ephemeral: true })
                }
            })
        } else {
            interaction.reply({ content: 'It seems I\'ve lost my voice.', ephemeral: true })
            console.error('Could not find TTS file')
        }
    })
}

const createTTS = (target, ttsPath, resultFn) => {
    say.export(`Hey ${target.username}, you suck`, null, 1, ttsPath, (err) => {
        if (err) {
            console.error(err)
        } else {
            resultFn()
        }
    })
}

const bullyTarget = (channel, ttsPath) => {
    const player = createAudioPlayer()

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    })

    const resource = createAudioResource(ttsPath)
    player.play(resource)
    connection.subscribe(player)

    player.once(AudioPlayerStatus.Idle, () => {
        connection.destroy()
        player.stop()
        fs.unlink(ttsPath)
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bully')
        .setDescription('Bully someone')
        .addUserOption(option => option.setName('target').setDescription('The target to bully')),
    execute: async interaction => {
        run(interaction)
    }
}
