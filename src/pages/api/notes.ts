// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const notes = await prisma.note.findMany();

    return res.json(
      notes.map((entry) => ({
        id: entry.id.toString(),
        preview: entry.preview,
        content: entry.content,
        canvas: entry.canvas,
      }))
    );
  }
  if (req.method === 'POST') {
    const newEntry = await prisma.note.create({
      data: {
        preview: req.body.body.preview,
        content: req.body.body.content,
        canvas: req.body.body.canvas,
      },
    });

    return res.status(200).json({
      id: newEntry.id.toString(),
      preview: newEntry.preview,
      content: newEntry.content,
      canvas: newEntry.canvas,
    });
  }
  return res.status(500);
}
