import { Configuration, OpenAIApi } from "openai";
import { ConfigJson } from "./types";
import { readFile, parseJson } from "./util";

const { OPENAI_API_KEY } = parseJson(readFile("../config/config.json")) as ConfigJson;

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const sanitizeResponse = (text = "") => {
    let result = text.trim();
    if (result.indexOf("\"") === 0 && result.lastIndexOf("\"") === result.length - 1) {
        result = result.slice(1);
        result = result.slice(0, result.length - 1);
    }
    return result;
};

async function generatePatronizingMessage(prompt?: string) {
    const patronizingPrompt = prompt || "Generate a patronizing message";
    const gptResponse = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: patronizingPrompt,
        temperature: 0.9,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    return sanitizeResponse(gptResponse.data.choices[0].text);
}

export default generatePatronizingMessage;
