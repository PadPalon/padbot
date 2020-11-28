const commands = [
    require('./bully'),
    require('./fart_bomb'),
    require('./fuck')
]

const run = (msg, bot) => {
    commands.find(cmd => cmd.isRelevant(msg)).run(msg, bot)
}

module.exports = {
    run
}