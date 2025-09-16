import 'reflect-metadata';
import { Worker } from 'bullmq';
import * as IORedis from 'ioredis';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

const worker = new Worker('email', async job => {
  console.log('Processing email job:', job.id, job.name, job.data);
  // Here you would integrate SES/SMTP sending logic.
  // Simulate success:
  return { ok: true, processedAt: new Date().toISOString() };
}, { connection });

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});
worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed`, err);
});

console.log('Email worker started, listening to "email" queue');