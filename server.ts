import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { defaultSchoolContent } from './src/data/defaultContent.js';

import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));

// Helper to get school content from Supabase
async function getSchoolDataAsync() {
  if (!supabase) {
    console.warn('Backend: Supabase is not configured. Falling back to default school content.');
    return defaultSchoolContent;
  }
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('data')
      .eq('id', 'content')
      .single();

    if (data && data.data) {
      return { ...defaultSchoolContent, ...(data.data as any) };
    }
    if (error) {
      console.warn('Backend: No CMS content row found in Supabase (or error), using default fallbacks.');
    }
  } catch (error) {
    console.error('Error fetching CMS content from Supabase, using default fallback:', error);
  }
  return defaultSchoolContent;
}

// Initialize Gemini client lazily
let aiClient: any = null;
function getAIClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// API: Send Email (Contact Form)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Data tidak lengkap.' });
    return;
  }

  // Real-world: You would use nodemailer, SendGrid, or similar here.
  // We simulate the processing time and log it as a "real" event.
  console.log('--- EMAIL OUTGOING SIMULATION ---');
  console.log(`To: school-admin@sdnremen2.sch.id`);
  console.log(`From: ${name} <${email}>`);
  console.log(`Subject: Pesan Kontak Baru dari Website`);
  console.log(`Body: ${message}`);
  console.log('---------------------------------');

  // Simulate a bit of delay for realism
  setTimeout(() => {
    res.json({ success: true, message: 'Pesan email berhasil dikirim!' });
  }, 1000);
});

import { handleChat } from './src/server/api-logic';

// ... (keep everything until app.post('/api/chat'))

// API: Grounded AI Chatbot
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Pesan kosong' });
    return;
  }

  try {
    const text = await handleChat(message, history);
    res.json({ text });
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    res.status(500).json({ error: 'Gagal memproses AI Chatbot: ' + error.message });
  }
});


// Setup Vite or static serving
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Intercept HTML requests in development to inject env
    app.get('*', async (req, res, next) => {
      const isHtml = req.headers.accept && req.headers.accept.includes('text/html');
      if (isHtml && !req.path.startsWith('/api')) {
        try {
          const url = req.originalUrl;
          let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          
          const envScript = `
            <script>
              window.env = {
                VITE_SUPABASE_URL: ${JSON.stringify(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '')},
                VITE_SUPABASE_ANON_KEY: ${JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '')}
              };
            </script>
          `;
          template = template.replace('<head>', `<head>${envScript}`);
          return res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          return next(e);
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    // Serve static files (exclude index.html so our custom route can serve it with injected variables)
    app.use(express.static(distPath, { index: false }));
    
    app.get('*', (req, res) => {
      // Don't fallback for API routes
      if (req.path.startsWith('/api')) {
        res.status(404).send('Not Found');
        return;
      }
      
      try {
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, 'utf-8');
          
          const envScript = `
            <script>
              window.env = {
                VITE_SUPABASE_URL: ${JSON.stringify(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '')},
                VITE_SUPABASE_ANON_KEY: ${JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '')}
              };
            </script>
          `;
          template = template.replace('<head>', `<head>${envScript}`);
          
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          res.status(404).send('Index HTML not found');
        }
      } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server UPT SD Negeri Remen 2 berjalan di port ${PORT}`);
  });
}

bootstrap();
