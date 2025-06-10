// File: pages/api/prompts/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDataSource } from '../../../db/connection';
import { Prompt } from '../../../db/entities/Prompt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dataSource = await getDataSource();
  const promptRepository = dataSource.getRepository(Prompt);

  switch (req.method) {
    case 'GET':
      try {
        const prompts = await promptRepository.find();
        return res.status(200).json(prompts);
      } catch (error) {
        console.error('Error fetching prompts:', error);
        return res.status(500).json({ error: 'Failed to fetch prompts' });
      }

    case 'POST':
      try {
        const { title, template } = req.body;
        
        // Basic validation
        if (!title || !template) {
          return res.status(400).json({ error: 'Title and template are required' });
        }

        // Sanitize and validate inputs
        const sanitizedTitle = title.trim();
        const sanitizedTemplate = template.trim();
        if (sanitizedTitle.length > 100 || !sanitizedTitle.match(/^[a-zA-Z0-9\s-_]+$/)) {
          return res.status(400).json({ 
            error: 'Invalid title', 
            details: 'Must be 100 characters or less and contain only letters, numbers, spaces, or hyphens' 
          });
        }
        if (sanitizedTemplate.length < 1) {
          return res.status(400).json({ 
            error: 'Invalid template', 
            details: 'Template cannot be empty' 
          });
        }

        const newPrompt = promptRepository.create({
          title: sanitizedTitle,
          template: sanitizedTemplate,
        });

        const savedPrompt = await promptRepository.save(newPrompt);
        return res.status(201).json(savedPrompt);
      } catch (error) {
        console.error('Error creating prompt:', error);
        return res.status(500).json({ error: 'Failed to create prompt' });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}