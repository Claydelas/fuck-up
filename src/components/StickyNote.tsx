import { HTMLProps, useEffect, useState } from 'react';
import type { Note } from '@prisma/client';
import { GrLocationPin } from 'react-icons/gr';
import type { TDFile } from '@claydelas/tldraw';

export type ParsedNote = {
  content: TDFile;
} & Omit<Note, 'content'>;

export default function StickyNote({
  children,
  ...props
}: HTMLProps<HTMLDivElement>) {
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
        <div className='note-content'>{children}</div>
      </div>
    </div>
  );
}
