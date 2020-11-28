
const fs = require('fs')
var say = require('say')
var ttsFilename = 'tts_fart.wav'

const isRelevant = msg => {
    return msg.content.endsWith('deploy fart bomb')
}

const run = msg => {
    if (fs.existsSync('ttsFilename')) {
        sendMessage(msg)
    } else {
        createTTS(() => sendMessage(msg))
    }
}

const createTTS = resultFn => {
    say.export('fart', null, 0.5, ttsFilename, (err) => {
        if (err) {
            console.error(err)
        } else {
            resultFn()
        }
    })
}

const sendMessage = msg => {
    const channels = msg.guild.channels.cache
        .filter(channel => channel.type === 'voice' && channel.joinable)
        .array()
    sendToChannel(channels)
}

const sendToChannel = ([channel, ...channels]) => {
    if (!channel) {
        return
    }

    channel.join().then(connection => {
        const dispatcher = connection.play(ttsFilename)
        dispatcher.on('finish', () => {
            dispatcher.destroy()
            if (channels.length > 0) {
                sendToChannel(channels)
            } else {
                channel.leave()
            }
        })
    }).catch(e => {
        console.error(e)
    })
}

module.exports = {
    isRelevant,
    run
}
