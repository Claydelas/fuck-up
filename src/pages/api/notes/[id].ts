import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

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
    if (!entry) return res.json({});
    return res.json({
      id: entry.id.toString(),
      preview: entry.preview,
      content: entry.content,
      canvas: entry.canvas,
    });
  }

  if (req.method === 'DELETE') {
    await prisma.note.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(204).json({});
  }

  if (req.method === 'PATCH') {
    const body = req.body;

    await prisma.note.update({
      where: {
        id: Number(id),
      },
      data: {
        ...body,
      },
    });

    return res.status(201).json({
      ...entry,
      body,
    });
  }

  return res.send('Method not allowed.');
}
