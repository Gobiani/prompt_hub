// File: pages/api/prompt/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDataSource } from '../../../db/connection';
import { Prompt } from '../../../db/entities/Prompt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid prompt ID', details: 'ID must be a single number' });
  }

  const dataSource = await getDataSource();
  const promptRepository = dataSource.getRepository(Prompt);

  switch (req.method) {
    case 'GET':
      try {
        const prompt = await promptRepository.findOneBy({ id: parseInt(id) });
        if (!prompt) {
          return res.status(404).json({ error: 'Prompt not found', details: `No prompt with ID ${id}` });
        }
        return res.status(200).json(prompt);
      } catch (error) {
        console.error('Error fetching prompt:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ error: 'Failed to fetch prompt', details: message });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed', details: 'Only GET is supported' });
  }
}