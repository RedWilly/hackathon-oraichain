import { Pinecone } from '@pinecone-database/pinecone';
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
  public devEnv = process.env.NODE_ENV === 'development';

  constructor() {
    mongoose.connect(process.env.MONGO_DB_URI || '').catch((error) => {
      console.log('Error connecting to the DB', error);
    });
  }

  private trimCode(code: string) {
    const codeMatch = new RegExp(`\`\`\`solidity([\\s\\S]*?)\`\`\``, 'g').exec(code);
    return codeMatch ? codeMatch[1].trim() : code;
  }

  async getPrompts(): Promise<TPrompt[]> {
    return SPrompt.find({});
  }

  async getPromptByTemplate(template: TContractType): Promise<TPrompt[]> {
    return SPrompt.find({ template });
  }

  async callGeneratorLLM(customization: string, contractType: TContractType): Promise<string> {
    if (this.devEnv) {
      return 'pragma solidity ^0.8.0;\n\ncontract MyContract {\n\n // Put a "}" here to solve compilation error\n';
    }

    const templateDoc = await SDoc.findOne({ template: contractType });
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '', environment: 'gcp-starter' });
    const generator = await generatorAgent(pinecone);
    const responseCode = await generator.invoke({
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
    if (this.devEnv) {
      return [
        {
          title: 'Vulnerability 1',
          description: 'Description of vulnerability 1',
          severity: 'Medium',
        },
      ];
    }

    const response = await auditorAgent().invoke({
      code: code,
    });

    return auditJsonSchema.parse(response).audits;
  }

  async callBuildResolverLLM(code: string, compilerError: string): Promise<string> {
    const newCode = await buildResolverAgent().invoke({ code, compilerError });

    return this.trimCode(newCode);
  }
}
