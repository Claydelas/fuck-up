import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const entry = await prisma.note.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (req.method === 'GET') {
    if (!entry || !entry.approved) return res.json({});
    return res.json({
      id: entry.id.toString(),
      preview: entry.preview,
      content: entry.content,
    });
  }

  return res.send('Method not allowed.');
}
