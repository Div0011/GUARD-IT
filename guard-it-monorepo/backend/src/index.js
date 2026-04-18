import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// --- MODERATION JOBS ---
app.get('/api/v1/jobs', async (req, res) => {
  try {
    const jobs = await prisma.moderationJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(jobs.map(j => ({
      ...j,
      scores: j.scores ? JSON.parse(j.scores) : null,
      flaggedCategories: j.flaggedCategories ? JSON.parse(j.flaggedCategories) : null,
      metadata: j.metadata ? JSON.parse(j.metadata) : null,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/jobs', async (req, res) => {
  const { content, metadata } = req.body;
  try {
    const job = await prisma.moderationJob.create({
      data: {
        job_id: `job_${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        content,
        status: 'PENDING',
        metadata: metadata ? JSON.stringify(metadata) : null,
      }
    });

    // Mock "Processing" Delay
    setTimeout(async () => {
      const isFlagged = Math.random() > 0.7;
      await prisma.moderationJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          verdict: isFlagged ? 'FLAGGED' : 'CLEAN',
          scores: JSON.stringify({
            hate_speech: isFlagged ? 0.95 : 0.01,
            spam: 0.05,
          }),
          flaggedCategories: isFlagged ? JSON.stringify(['hate_speech']) : '[]',
          processing_time_ms: Math.floor(Math.random() * 2000) + 500,
        }
      });
    }, 3000);

    res.status(202).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- API KEYS ---
app.get('/api/v1/api-keys', async (req, res) => {
  try {
    const keys = await prisma.aPIKey.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/api-keys', async (req, res) => {
  const { name, environment } = req.body;
  const prefix = environment === 'production' ? 'sk_live_' : 'sk_test_';
  const rawKey = prefix + Math.random().toString(36).substring(2, 20);
  
  try {
    const apiKey = await prisma.aPIKey.create({
      data: {
        name,
        environment,
        prefix,
        hash: `fake_hash_${Math.random()}`, // Should be real HMAC in production
        maskedKey: `${prefix}${rawKey.substring(8, 12)}...${rawKey.substring(rawKey.length - 4)}`,
      }
    });
    res.status(201).json({ ...apiKey, rawKey }); // Return rawKey only once
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- STATS ---
app.get('/api/v1/stats', async (req, res) => {
  try {
    const totalJobs = await prisma.moderationJob.count();
    const flaggedJobs = await prisma.moderationJob.count({ where: { verdict: 'FLAGGED' } });
    const stats = {
      total_requests: totalJobs * 100, // Dummy multiplier
      avg_latency: '1.42s',
      uptime: '99.98%',
      active_workers: 5,
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`GUARD-IT Backend running on port ${PORT}`);
});

