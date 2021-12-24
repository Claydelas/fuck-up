import { Note } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import StickyNote from '../components/StickyNote';

export default function ApprovePage() {
  const { mutate } = useSWRConfig();
  const [notes, setNotes] = useState<Note[]>([]);

  const { data } = useSWR('/api/notes?approved=false', (url) =>
    fetch(url).then((r) => r.json())
  );

  useEffect(() => {
    setNotes(data);
  }, [data]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const reject = async (e: any, note: Note) => {
    e.preventDefault();

    setNotes((notes) => notes.filter((n) => n.id !== note.id));

    await fetch(`/api/notes/${note.id}`, {
      method: 'DELETE',
    });

    mutate('/api/notes');
  };
  const approve = async (e: any, note: Note) => {
    e.preventDefault();

    setNotes((notes) => notes.filter((n) => n.id !== note.id));

    await fetch(`/api/notes/${note.id}`, {
      method: 'PATCH',

      body: JSON.stringify({
        approved: true,
      }),

      headers: {
        'Content-Type': 'application/json',
      },
    });

    mutate('/api/notes');
  };

  return (
    <div className='flex flex-col justify-center items-center max-w-4xl mx-auto h-screen gap-5'>
      {notes &&
        notes.map((note: Note) => {
          return (
            <div key={note.id} className='flex gap-5 items-center'>
              <StickyNote note={note} />
              <button
                type='submit'
                onClick={(e) => approve(e, note)}
                className='h-min p-2 pl-5 pr-5 transition-colors duration-700 transform bg-indigo-500 hover:bg-blue-400 text-gray-100 text-lg rounded-lg focus:border-4 border-indigo-300'
              >
                Approve
              </button>
              <button
                type='submit'
                onClick={(e) => reject(e, note)}
                className='h-min p-2 pl-5 pr-5 transition-colors duration-700 transform bg-indigo-500 hover:bg-blue-400 text-gray-100 text-lg rounded-lg focus:border-4 border-indigo-300'
              >
                Reject
              </button>
            </div>
          );
        })}
    </div>
  );
}
