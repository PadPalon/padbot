const commands = [
    require('./bully'),
    require('./fuck')
]

const run = (msg) => {
    commands.find(cmd => cmd.isRelevant(msg)).run(msg)
}

module.exports = {
    run
}