import { Queue } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const emailQueue = new Queue('email', { connection });

export async function addEmailJob(data: any) {
  return emailQueue.add('send', data);
}
