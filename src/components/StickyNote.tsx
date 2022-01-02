import React from 'react';
import type { Note } from '@prisma/client';

export type OptionalNote = Pick<Note, 'preview'> & Partial<Note>;

const skews = ['rounded-br-[60px_5px]', 'rounded-bl-[60px_5px]'];

export default function StickyNote({ note }: { note: OptionalNote }) {
  const skew = skews[Math.floor(Math.random() * skews.length)];

  return (
    <div
      className={`h-60 w-52 border-t-[20px] border-t-[#fdf8c0] bg-[#fdf7ad] ${skew}`}
    >
      <div className='line-clamp-6 mb-5 mx-5 font-note text-2xl text-center'>
        {note.preview}
      </div>
    </div>
  );
}
