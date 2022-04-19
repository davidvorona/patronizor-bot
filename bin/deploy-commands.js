const { REST } = require("@discordjs/rest");
const { Routes, ApplicationCommandOptionType } = require("discord-api-types/v9");
const { CLIENT_ID, GUILD_ID } = require("../config/config.json");
const { TOKEN } = require("../config/auth.json");

const commands = [
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
        name: "words",
        description: "Gets the list of patronizing words"
    },
    {
        name: "phrases",
        description: "Gets the list of patronizing phrases"
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
    },
    {
        name: "phrase",
        description: "Adds a phrase to the phrasebook",
        options: [{
            type: ApplicationCommandOptionType.String,
            name: "phrase",
            description: "What phrase do you want to add?",
            required: true
        }]
    }
]; 

const rest = new REST({ version: "9" }).setToken(TOKEN);

(async () => {
    try {
        console.log(
            "Started refreshing",
            GUILD_ID ? "guild" : "global",
            "application (/) commands."
        );

        const route = GUILD_ID
            ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
            : Routes.applicationCommands(CLIENT_ID);
        await rest.put(route, { body: commands });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();
