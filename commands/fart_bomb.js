
const fs = require('fs')
var say = require('say')
var ttsFilename = 'tts_fart.wav'

const { SlashCommandBuilder } = require('@discordjs/builders')
const { 
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus
} = require('@discordjs/voice')

const run = interaction => {
    interaction.reply({ content: 'On it!', ephemeral: true })
    if (fs.existsSync('ttsFilename')) {
        sendMessage(interaction)
    } else {
        createTTS(interaction, () => sendMessage(interaction))
    }
}

const createTTS = (interaction, resultFn) => {
    say.export('fart', null, 0.5, ttsFilename, (err) => {
        if (err) {
            interaction.reply({ content: 'It seems I\'ve lost my voice.', ephemeral: true })
            console.error(err)
        } else {
            resultFn()
        }
    })
}

const sendMessage = interaction => {
    const player = createAudioPlayer()

    interaction.guild.channels
        .fetch()
        .then(channels => {
            const voiceChannels = Array.from(channels.values())
                .filter(channel => channel.isVoice() && channel.joinable)
            sendToChannel(player, voiceChannels)
        })
}

const sendToChannel = (player, [channel, ...channels]) => {
    if (!channel) {
        player.stop()
        return
    }

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    })

    const resource = createAudioResource(ttsFilename)
    player.play(resource)
    connection.subscribe(player)

    player.once(AudioPlayerStatus.Idle, () => {
        connection.destroy()
        sendToChannel(player, channels)
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fart-bomb')
        .setDescription('Deploy a fart bomb'),
    execute: async interaction => {
        run(interaction)
    }
}