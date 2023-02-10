import axios from 'axios';
import * as dotenv from 'dotenv';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

dotenv.config();

const openAiHeaders = { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` };
const rl = readline.createInterface({ input, output });

const getInput = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const createCompletion = (
  prompt,
  model = 'text-davinci-003',
  max_tokens = Number(process.env.CHAT_GPT_MAX_TOKENS),
  temperature = 0
) => {
  return axios
    .post(
      'https://api.openai.com/v1/completions',
      {
        prompt,
        model,
        max_tokens,
        temperature,
      },
      { headers: openAiHeaders }
    )
    .then((res) => {
      return res.data;
    });
};

const main = async () => {
  const messages = [];
  let tokens = 0;

  while (true) {
    const input = await getInput(`[${tokens}] :: `);
    messages.push(`human: ${input}`);
    const prompt = `${messages.join(`\n`)}\nai: `;
    const data = await createCompletion(prompt);
    const { choices, usage } = data;
    tokens += usage.total_tokens;
    const response = choices[0];
    const { text } = response;
    messages.push(`ai: ${text.trim()}`);
    console.log(`[${tokens}] ==`, text.trim());
  }
};

main();
