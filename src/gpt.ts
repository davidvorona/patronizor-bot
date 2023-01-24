import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: "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",
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
