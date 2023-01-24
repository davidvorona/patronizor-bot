// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ApplicationCommandOptionType } = require("discord-api-types/v9");

module.exports = [
    {
        name: "ping",
        description: "Replies with pong!"
    },
    {
        name: "patronize",
        description: "Patronizes a deserving victim",
        options: [{
            type: ApplicationCommandOptionType.Mentionable,
            name: "victim",
            description: "Who do you want to patronize?",
            required: true
        }]
    },
    {
        name: "welcome",
        description: "Welcome a deserving victim",
        options: [{
            type: ApplicationCommandOptionType.Mentionable,
            name: "victim",
            description: "Who do you want to welcome?",
            required: true
        }]
    },
    {
        name: "words",
        description: "Gets the list of patronizing words"
    },
    {
        name: "word",
        description: "Adds a word to the thesaurus",
        options: [{
            type: ApplicationCommandOptionType.String,
            name: "word",
            description: "What word do you want to add?",
            required: true
        }]
    }
];
