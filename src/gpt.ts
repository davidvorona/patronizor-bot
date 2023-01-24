import { Configuration, OpenAIApi } from "openai";
import { ConfigJson } from "./types";
import { readFile, parseJson } from "./util";

const { OPENAI_API_KEY } = parseJson(readFile("../config/config.json")) as ConfigJson;

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const trimResponse = (text = "") => text.trim();

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
    return trimResponse(gptResponse.data.choices[0].text);
}

export default generatePatronizingMessage;
