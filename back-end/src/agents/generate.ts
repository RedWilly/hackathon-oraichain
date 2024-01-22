import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

export function generatorAgent() {
  const systemMsg =
    'Your function is to interpret user requests specifically for smart contract development in Soliditu. You must generate FULL code exclusively, without any explanatory or conversational text and placeholder comments. Use openzeppelin libraries if neccessary. Do not use SafeMath library and use pragma 0.8.19 everytime.';
  const userMsg =
    'Template example: {example} \n\n Request: Based on the provided example apply the following customization "{customization}"';

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMsg),
      HumanMessagePromptTemplate.fromTemplate(userMsg),
    ],
    inputVariables: ['example', 'customization'],
  });

  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4-1106-preview',
    temperature: 0.1,
    modelKwargs: { seed: 1337 },
    verbose: true,
  });

  return prompt.pipe(llm).pipe(new StringOutputParser());
}
