import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  console.log('--- EMAIL SIMULATION ---');
  console.log(`From: ${name} <${email}>`);
  console.log(`Message: ${message}`);

  return res.status(200).json({ success: true, message: 'Message sent!' });
}
