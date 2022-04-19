import { Client, Intents, Interaction, TextChannel, MessageEmbed, GuildMember } from "discord.js";
import { Thesaurus, Phrasebook } from "./lexicon";
import Storage from "./storage";
import { readFile, parseJson, getChannel } from "./util";

const { TOKEN } = parseJson(readFile("../config/auth.json")) as AuthJson;
const { DATA_DIR } = parseJson(readFile("../config/config.json")) as ConfigJson;

// Note: All developers must add an empty data/ directory at root
Storage.validateDataDir(DATA_DIR);

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

/* Initialize lexicon */

// Load default and client words
const wordsStorage = new Storage("words.txt");
const storedWords = wordsStorage.read();
const defaultWords = [
    "sport", "chief", "bud", "pal", "champ", "squirt", "buster",
    "big boy", "big hoss", "turbo", "slugger", "bucko"
];
const words = [...new Set(storedWords.concat(defaultWords))];
// Load default and client phrases
const phrasesStorage = new Storage("phrases.txt");
const storedPhrases = phrasesStorage.read();
const defaultPhrases  = [
    "wow, look at you",
    "how ya doin' there",
    "keep it up",
    "you'll get 'em next time",
    "keep your chin up",
    "thanks for that",
    "thanks for the update",
    "the important thing is you tried"
];
const phrases = [...new Set(storedPhrases.concat(defaultPhrases))];
// Define default welcome phrases
const defaultWelcomePhrases = [
    "nice job finding us",
    "introduce yourself to the class",
    "how ya doin' there",
    "wouldn't have invited you myself but welcome",
    "glad we're letting anyone in nowadays"
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
        const channel = getChannel(guildMember, systemChannelId);
        if (channel instanceof TextChannel) {
            const welcomePhrase = welcomePhrasebook.random();
            const word = thesaurus.random();
            channel.send(`${guildMember} ${Phrasebook.format(welcomePhrase)}, ${word}`);
        }
    }
});

// client.on("guildMemberRemove", (guildMember) => {
//     const systemChannelId = guildMember.guild.systemChannelId;
//     if (systemChannelId) {
//         const channel = getChannel(guildMember as GuildMember, systemChannelId);
//         if (channel instanceof TextChannel) {
//             const word = thesaurus.random();
//             channel.send(`nice knowin' ya", ${word}`);
//         }
//     }
// });

// Delete default new guild member message 
// client.on("messageCreate", async (message) => {
//     if (message.type === "GUILD_MEMBER_JOIN") {
//         await message.delete();
//     }
// });

/* Handle slash commands */

// Handle command interactions
client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("pong!");
    }

    if (interaction.commandName === "patronize") {
        const victim = interaction.options.getMentionable("victim") as GuildMember;
        const word = thesaurus.random();
        // If mentioned victim is the bot, punish the invoker
        if (client.user && (victim.id === client.user.id)) {
            await interaction.reply(`${interaction.member} nice try, ${word}`);
            return;
        }
        const phrase = phrasebook.random();
        await interaction.reply(`${victim} ${Phrasebook.format(phrase)}, ${word}`);
    }

    if (interaction.commandName === "words") {
        await interaction.reply({ embeds: [thesaurus.toEmbedDict()], ephemeral: true });
    }

    if (interaction.commandName === "phrases") {
        await interaction.reply({ embeds: [phrasebook.toEmbedDict()], ephemeral: true });
    }

    if (interaction.commandName === "word") {
        const word = interaction.options.getString("word") as string;
        thesaurus.add(word);
        await interaction.reply({ embeds: [
            new MessageEmbed()
                .setColor("#0099ff")
                .setDescription(`PatronizorBot has added **${word}** to its thesaurus`)
        ] });
    }

    if (interaction.commandName === "phrase") {
        const phrase = interaction.options.getString("phrase") as string;
        phrasebook.add(phrase);
        await interaction.reply({ embeds: [
            new MessageEmbed()
                .setColor("#0099ff")
                .setDescription(`PatronizorBot has added **${phrase}** to its phrasebook`)
        ] });
    }
});

client.login(TOKEN);
