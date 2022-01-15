import { HTMLProps, useEffect, useState } from 'react';
import type { Note } from '@prisma/client';
import { GrLocationPin } from 'react-icons/gr';
import type { TDFile } from '@claydelas/tldraw';

export type ParsedNote = {
  content: TDFile;
} & Omit<Note, 'content'>;

type StickyNoteProps = {
  note: ParsedNote;
} & HTMLProps<HTMLDivElement>;

export default function StickyNote({ note, ...props }: StickyNoteProps) {
  const [skew, setSkew] = useState('rounded-br-peel');

  useEffect(() => {
    if (Math.random() >= 0.5) setSkew('rounded-bl-peel');
  }, []);

  return (
    <div className={`note ${skew}`} {...props}>
      <div className='stickytop'>
        <GrLocationPin className={`scale-110 rotate-45`} />
      </div>
      <div className='flex-grow centered'>
        <div className='note-content'>{note.preview}</div>
      </div>
    </div>
  );
}
