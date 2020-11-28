const fs = require('fs')
var say = require('say')
var ttsFilename = 'tts'

const isRelevant = msg => {
    const mentionedUsers = msg.mentions.users.first(2)
    return msg.content.includes('bully') && mentionedUsers.length == 2
}

const run = msg => {
    const ttsPath = `${ttsFilename}_${msg.nonce}.wav`
    const targetUser = msg.mentions.users.first(2)[1]
    createTTS(targetUser, ttsPath, () => {
        if (fs.existsSync(ttsPath)) {
            const channel = msg.guild.member(targetUser).voice.channel
            if (channel && channel.joinable) {
                bullyTarget(channel, ttsPath)
            } else {
                console.info('Target is not in a joinable voice channel')
            }
        } else {
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
    channel.join().then(connection => {
        const dispatcher = connection.play(ttsPath)
        dispatcher.on('finish', () => {
            dispatcher.destroy()
            channel.leave()
            fs.unlinkSync(ttsPath)
        })
    }).catch(e => {
        console.error(e)
    })
}

module.exports = {
    isRelevant,
    run
}
