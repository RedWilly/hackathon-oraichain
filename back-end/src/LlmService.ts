import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { auditJsonSchema, auditorAgent } from './agents/audit';
import { buildResolverAgent } from './agents/build-resolve';
import { generatorAgent } from './agents/generate';
import SDoc from './db-schemas/docs';
import SPrompt, { TPrompt } from './db-schemas/prompts';
import { TBuildResponse, TContractType, TVulnerability } from './types';

dotenv.config();

export class LlmService {
  constructor() {
    mongoose.connect(process.env.MONGO_DB_URI || '').catch((error) => {
      console.log('Error connecting to the DB', error);
    });
  }

  private trimCode(code: string) {
    const codeMatch = new RegExp(`\`\`\`rust([\\s\\S]*?)\`\`\``, 'g').exec(code);
    return codeMatch ? codeMatch[1].trim() : code;
  }

  async getPrompts(): Promise<TPrompt[]> {
    return SPrompt.find({});
  }

  async getPromptByTemplate(template: TContractType): Promise<TPrompt[]> {
    return SPrompt.find({ template });
  }

  async callGeneratorLLM(customization: string, contractType: TContractType): Promise<string> {
    const templateDoc = await SDoc.findOne({ template: contractType });
    const responseCode = await generatorAgent().invoke({
      example: templateDoc?.example || '',
      customization,
    });

    return this.trimCode(responseCode);
  }

  async buildCode(smartContractCode: string): Promise<TBuildResponse> {
    const buildResponse = await fetch(`https://compiler-service.defibuilder.com/api/v1/solidity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.X_API_KEY || '',
      },
      body: JSON.stringify({ code: smartContractCode }),
    });

    const responseData = (await buildResponse.json()) as TBuildResponse;

    return { ...responseData, code: smartContractCode };
  }

  async callAuditorLLM(code: string): Promise<TVulnerability[]> {
    const response = await auditorAgent().invoke({
      code: code,
    });

    return auditJsonSchema.parse(response).audits;
  }

  async callBuildResolverLLM(code: string, compilerError: string): Promise<string> {
    return await buildResolverAgent().invoke({ code, compilerError });
  }
}