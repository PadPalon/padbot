const fs = require('fs')
var say = require('say')
var ttsFilename = 'tts.wav'

const isRelevant = msg => {
    const mentionedUsers = msg.mentions.users.first(2)
    return msg.content.includes('bully') && mentionedUsers.length == 2
}

const run = msg => {
    const targetUser = msg.mentions.users.first(2)[1]
    createTTS(targetUser)
    if (!fs.existsSync(ttsFilename)) {
        return
    }

    const channel = msg.guild.member(targetUser).voice.channel
    if (channel) {
        bullyTarget(channel)
    } else {
        console.info('Target is not in a voice channel')
    }
}

function createTTS(target) {
    say.export(`Hey ${target.username}, you suck`, null, 1, ttsFilename, function (err) {
        if (err) {
            console.error(err)
        }
    })
}

function bullyTarget(channel) {
    channel.join().then(connection => {
        const dispatcher = connection.play(ttsFilename)
        dispatcher.on('finish', () => {
            dispatcher.destroy()
            channel.leave()
            fs.unlinkSync(ttsFilename)
        })
    }).catch(e => {
        console.error(e)
    })
}

module.exports = {
    isRelevant,
    run
}
