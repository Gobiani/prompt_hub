// File: pages/api/prompts/execute.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDataSource } from '../../../db/connection';
import { Prompt } from '../../../db/entities/Prompt';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { promptId, variables } = req.body;

    if (!promptId || !variables || typeof variables !== 'object') {
      return res.status(400).json({ error: 'Prompt ID and variables are required' });
    }

    // Get the prompt from the database
    const dataSource = await getDataSource();
    const promptRepository = dataSource.getRepository(Prompt);
    const prompt = await promptRepository.findOneBy({ id: promptId });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    // Check for missing variables
    const variableNames = prompt.template.match(/{([^{}]+)}/g)?.map(m => m.slice(1, -1)) || [];
    const missingVars = variableNames.filter(v => !(v in variables));
    if (missingVars.length) {
      return res.status(400).json({ 
        error: 'Missing variables', 
        details: `Required: ${missingVars.join(', ')}` 
      });
    }

    // Replace placeholders with variable values
    let filledTemplate = prompt.template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      filledTemplate = filledTemplate.replace(new RegExp(placeholder, 'g'), String(value));
    }

    // Execute the prompt with Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent(filledTemplate);
    const text = result.response.text();

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error('Error executing prompt:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Failed to execute prompt', details: message });
  }
}