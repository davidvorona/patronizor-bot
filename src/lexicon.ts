import { MessageEmbed } from "discord.js";
import { rand } from "./util";
import Storage from "./storage";

class StringBank {
    strings: string[];

    store?: Storage;

    constructor(strings: string[], store?: Storage) {
        this.strings = strings;
        if (store) {
            this.store = store;
        }
    }

    add(string: string) {
        this.strings.push(string);
        if (this.store) {
            this.store.add(string);
        }
    }

    remove(string: string) {
        const idx = this.strings.indexOf(string);
        this.strings.splice(idx, 1);
    }

    get(string: string) {
        return this.strings.find(s => s === string);
    }

    random() {
        const idx = rand(this.strings.length);
        return this.strings[idx];
    }
}

export class Thesaurus extends StringBank {
    toEmbedDict() {
        const words = this.strings.reduce((acc, curr, idx) => `${acc}\n**${idx + 1}.** ${curr}`, "");
        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Patronizing words")
            .setDescription(words);
        return embed;
    }
}

export class Phrasebook extends StringBank {
    toEmbedDict() {
        const phrases = this.strings.reduce((acc, curr, idx) => `${acc}\n**${idx + 1}.** ${curr}`, "");
        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Patronizing phrases")
            .setDescription(phrases);
        return embed;
    }
}

export default {
    Phrasebook,
    Thesaurus
};
