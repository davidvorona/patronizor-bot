import { Client, Intents, Interaction } from "discord.js";
import { Thesaurus, Phrasebook } from "./lexicon";
import { readFile } from "./util";

const { TOKEN } = JSON.parse(readFile("../config/auth.json")) as AuthJson;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Initialize lexicon
const wordsStorage = {};
const defaultWords = [
    "sport", "chief", "bud", "pal", "champ", "squirt", "buster",
    "big boy", "big hoss", "turbo", "slugger", "bucko"
];

client.on("ready", () => {
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
    }
});

client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }

    if (interaction.commandName === "patronize") {
        await interaction.reply("Patronizing...");
    }
});

client.login(TOKEN);
