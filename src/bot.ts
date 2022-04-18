import { Client, Intents, Interaction, TextChannel } from "discord.js";
import { Thesaurus, Phrasebook } from "./lexicon";
import Storage from "./storage";
import { readFile } from "./util";

const { TOKEN } = JSON.parse(readFile("../config/auth.json")) as AuthJson;
const { DATA_DIR } = JSON.parse(readFile("../config/config.json")) as ConfigJson;

// Note: All developers must add an empty data/ directory at root
Storage.validateDataDir(DATA_DIR);

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

/* Initialize lexicon */

// Load default and client words
const wordsStorage = new Storage("words.txt");
const storedWords = wordsStorage.read();
const defaultWords = [
    "sport", "chief", "bud", "pal", "champ", "squirt", "buster",
    "big boy", "big hoss", "turbo", "slugger", "bucko"
];
const words = storedWords.concat(defaultWords);
// Load default and client phrases
const phrasesStorage = new Storage("phrases.txt");
const storedPhrases = phrasesStorage.read();
const defaultPhrases  = [
    "wow, look at you",
    "how ya doin' there",
    "keep it up",
    "you'll get em next time",
    "keep your chin up",
    "thanks for that",
    "thanks for the update",
    "the important thing is you tried"
];
const phrases = storedPhrases.concat(defaultPhrases);
// Define default welcome phrases
const defaultWelcomePhrases = [
    "nice job finding us",
    "introduce yourself to the class",
    "how ya doin' there",
    "wow, look at you"
];
// Create structures for words/phrases
const thesaurus = new Thesaurus(words, wordsStorage);
const phrasebook = new Phrasebook(phrases, phrasesStorage);
const welcomePhrasebook = new Phrasebook(defaultWelcomePhrases);

/* Handle bot events */

client.on("ready", () => {
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log("------");
    }
});

// On new guild member, send bot welcome message to system channel 
client.on("guildMemberAdd", (guildMember) => {
    const systemChannelId = guildMember.guild.systemChannelId;
    if (systemChannelId) {
        const channel = guildMember.guild.channels.cache.get(systemChannelId);
        if (channel instanceof TextChannel) {
            const welcomePhrase = welcomePhrasebook.random();
            const word = thesaurus.random();
            channel.send(`${welcomePhrase}, ${word}`);
        }
    }
});

// Delete default new guild member message 
client.on("messageCreate", async (message) => {
    if (message.type === "GUILD_MEMBER_JOIN") {
        await message.delete();
    }
});

/* Handle slash commands */

// Handle command interactions
client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }

    if (interaction.commandName === "patronize") {
        const phrase = phrasebook.random();
        const word = thesaurus.random();
        await interaction.reply(`${phrase}, ${word}`);
    }
});

client.login(TOKEN);
