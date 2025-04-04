import { Client, Intents, Interaction, TextChannel, MessageEmbed, GuildMember } from "discord.js";
import { AuthJson, ConfigJson } from "./types";
import { Thesaurus } from "./lexicon";
import generatePatronizingMessage from "./gpt";
import Storage from "./storage";
import { readFile, parseJson, getChannel } from "./util";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const commands = require("../config/commands");

const { TOKEN } = parseJson(readFile("../config/auth.json")) as AuthJson;
const { DATA_DIR, CLIENT_ID } = parseJson(readFile("../config/config.json")) as ConfigJson;

// Note: All developers must add an empty data/ directory at root
Storage.validateDataDir(DATA_DIR);

const rest = new REST({ version: "9" }).setToken(TOKEN);

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

/* Initialize lexicon */

// Load default and client words
const wordsStorage = new Storage("words.txt");
const storedWords = wordsStorage.read();
const defaultWords = [
    "sport", "chief", "bud", "pal", "champ", "squirt", "buster",
    "big boy", "big hoss", "turbo", "slugger", "bucko", "speedster",
    "lil guy", "buckaroo"
];
const words = [...new Set(storedWords.concat(defaultWords))];

// Create structures for words
const thesaurus = new Thesaurus(words, wordsStorage);

/* Handle bot events */

client.on("ready", async () => {
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log("------");
    }
});

client.on("guildCreate", async (guild) => {
    try {
        console.log(`Started refreshing application (/) commands for guild: ${guild.id}.`);
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, guild.id),
            { body: commands }
        );
        console.log("Successfully reloaded application (/) commands.");
    } catch (err) {
        console.error(err);
    }
});

client.on("guildDelete", (guild) => {
    console.log(`Bot removed from guild: ${guild.id}.`);
});

// On new guild member, send bot welcome message to system channel 
client.on("guildMemberAdd", async (guildMember) => {
    const systemChannelId = guildMember.guild.systemChannelId;
    if (systemChannelId) {
        const channel = getChannel(guildMember, systemChannelId);
        if (channel instanceof TextChannel) {
            const welcomeText = await generatePatronizingMessage(
                `Generate a patronizing welcome message using the word ${thesaurus.random()}`
            );
            await channel.send(`${guildMember} ${welcomeText}`);
        }
    }
});

/* Handle slash commands */

// Handle command interactions
client.on("interactionCreate", async (interaction: Interaction) => {
    try {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === "ping") {
            await interaction.reply("pong!");
        }

        if (interaction.commandName === "patronize") {
            // Defer reply because request to OpenAI can take a while
            await interaction.deferReply();

            const victim = interaction.options.getMentionable("victim") as GuildMember;
            const word = thesaurus.random();
            // If mentioned victim is the bot, punish the invoker
            if (client.user && (victim.id === client.user.id)) {
                await interaction.editReply(`${interaction.member} nice try, ${word}`);
                return;
            }
            const message = await generatePatronizingMessage(`Generate a patronizing message using the word ${word}`);
            await interaction.editReply(`${victim} ${message}`);
        }

        if (interaction.commandName === "welcome") {
            // Defer reply because request to OpenAI can take a while
            await interaction.deferReply();

            const victim = interaction.options.getMentionable("victim") as GuildMember;
            const word = thesaurus.random();
            // If mentioned victim is the bot, punish the invoker
            if (client.user && (victim.id === client.user.id)) {
                await interaction.editReply(`${interaction.member} nice try, ${word}`);
                return;
            }
            const message = await generatePatronizingMessage(`Generate a patronizing welcome message using the word ${word}`);
            await interaction.editReply(`${victim} ${message}`);
        }

        if (interaction.commandName === "words") {
            await interaction.reply({ embeds: [thesaurus.toEmbedDict()], ephemeral: true });
        }

        if (interaction.commandName === "word") {
            // Scott's dumbass user ID: 191394302474190859
            if (interaction.user.id === "191394302474190859") {
                await interaction.reply({
                    content: "You have permanently lost privileges, Scott.",
                    ephemeral: true
                });
                return;
            }
            const word = interaction.options.getString("word") as string;
            thesaurus.add(word);
            await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor("#0099ff")
                    .setDescription(`PatronizorBot has added **${word}** to its thesaurus`)
            ] });
        }
    } catch (err) {
        console.error(err);
        if (interaction.isCommand()) {
            if (!interaction.deferred) {
                await interaction.reply({
                    content: "Failed to process command, please try again.",
                    ephemeral: true
                });
            } else {
                await interaction.editReply("Failed to process command, please try again.");
            }
        }
    }
});

client.login(TOKEN);
