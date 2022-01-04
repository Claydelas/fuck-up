import React from 'react';
import type { Note } from '@prisma/client';
import { GrLocationPin } from 'react-icons/gr';

export type OptionalNote = Pick<Note, 'preview'> & Partial<Note>;

const skews = ['rounded-br-peel', 'rounded-bl-peel'];

export default function StickyNote({ note }: { note: OptionalNote }) {
  const skew = skews[Math.floor(Math.random() * skews.length)];

  return (
    <div className={`note ${skew}`}>
      <div className='stickytop'>
        <GrLocationPin className='rotate-45 scale-110' />
      </div>
      <div className='flex-grow centered'>
        <div className='note-content'>{note.preview}</div>
      </div>
    </div>
  );
}
