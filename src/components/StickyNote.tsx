import React from 'react';
import type { Note } from '@prisma/client';

export type OptionalNote = Pick<Note, 'preview'> & Partial<Note>;

export default function StickyNote({ note }: { note: OptionalNote }) {
  return (
    <div className='bg-yellow-500 h-60 w-52'>
      <div className='line-clamp-note m-5'>{note.preview}</div>
    </div>
  );
}
