import { useEffect, useState } from 'react';
import type { Note } from '@prisma/client';
import { GrLocationPin } from 'react-icons/gr';

export type OptionalNote = Pick<Note, 'preview'> & Partial<Note>;

export default function StickyNote({ note }: { note: OptionalNote }) {
  const [skew, setSkew] = useState('rounded-br-peel');

  useEffect(() => {
    if (Math.random() >= 0.5) setSkew('rounded-bl-peel');
  }, []);

  return (
    <div className={`note ${skew}`}>
      <div className='stickytop'>
        <GrLocationPin className={`scale-110 rotate-45`} />
      </div>
      <div className='flex-grow centered'>
        <div className='note-content'>{note.preview}</div>
      </div>
    </div>
  );
}
