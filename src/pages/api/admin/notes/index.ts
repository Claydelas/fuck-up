// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import groupBy from 'lodash/groupBy';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user.admin) {
    return res.status(403).send('Unauthorized');
  }
  if (req.method === 'GET') {
    const notes = groupBy(
      await prisma.note.findMany(),
      (note) => note.approved
    );

    return res.status(200).json({
      approved: notes['true'] ?? [],
      pending: notes['false'] ?? [],
    });
  }
  return res.status(500);
}
