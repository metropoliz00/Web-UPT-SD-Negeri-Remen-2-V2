import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleChat } from '../src/server/api-logic';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const text = await handleChat(message, history);
    return res.status(200).json({ text });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
