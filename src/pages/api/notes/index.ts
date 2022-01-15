// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const note = await prisma.note.create({
      data: {
        preview: req.body.preview ?? 'WIP WIP WIP WIP WIP',
        content: req.body.content,
      },
    });

    return res.status(200).json({
      id: note.id.toString(),
      preview: note.preview,
      content: note.content,
    });
  }
  return res.status(500);
}
