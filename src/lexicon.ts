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
        return "The list of words in the thesaurus";
    }
}

export class Phrasebook extends StringBank {
    toEmbedDict() {
        return "The list of phrases in the phrasebook";
    }
}

export default {
    Phrasebook,
    Thesaurus
};
