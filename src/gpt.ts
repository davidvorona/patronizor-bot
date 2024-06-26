import OpenAI from "openai";
import { ConfigJson } from "./types";
import { readFile, parseJson } from "./util";

const { OPENAI_API_KEY } = parseJson(readFile("../config/config.json")) as ConfigJson;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

const sanitizeResponse = (text: string | null) => {
    if (!text) {
        return "";
    }
    let result = text.trim();
    if (result.indexOf("\"") === 0 && result.lastIndexOf("\"") === result.length - 1) {
        result = result.slice(1);
        result = result.slice(0, result.length - 1);
    }
    return result;
};

async function generatePatronizingMessage(prompt?: string) {
    const patronizingPrompt = prompt || "Generate a patronizing message";
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: patronizingPrompt }],
        temperature: 0.9,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    const content = gptResponse.choices[0].message.content;
    return sanitizeResponse(content);
}

export default generatePatronizingMessage;
