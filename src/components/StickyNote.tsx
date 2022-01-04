import React from 'react';
import type { Note } from '@prisma/client';
import { GrLocationPin } from 'react-icons/gr';

export type OptionalNote = Pick<Note, 'preview'> & Partial<Note>;

const skews = ['rounded-br-[60px_5px]', 'rounded-bl-[60px_5px]'];

export default function StickyNote({ note }: { note: OptionalNote }) {
  const skew = skews[Math.floor(Math.random() * skews.length)];

  return (
    <div
      className={`relative h-60 w-52 bg-[#fdf7ad] shadow-[#a5a173] shadow-md ${skew}`}
    >
      <div className='flex h-5 bg-[#fdf8c0] items-center justify-center'>
        <GrLocationPin className='rotate-45 scale-110' />
      </div>

      <div className='line-clamp-6 mb-5 mx-5 font-note text-2xl text-center'>
        {note.preview}
      </div>
    </div>
  );
}
