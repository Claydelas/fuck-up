import React from 'react';

type StickyProps = {
  note: {
    preview: string;
    content: string;
  };
};

export default function StickyNote({ note }: StickyProps) {
  return (
    <div className='bg-yellow-500 h-60 w-52'>
      <div className='line-clamp-note m-5'>{note.preview}</div>
    </div>
  );
}
