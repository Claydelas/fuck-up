import { decompressFromBase64 } from 'lz-string';
import { useState } from 'react';
import StickyNote, { ParsedNote } from '../components/StickyNote';
import prisma from '../lib/db';
import { GetServerSideProps } from 'next';

export default function ApprovePage({ notes }: { notes: ParsedNote[] }) {
  const [visibleNotes, setVisibleNotes] = useState<ParsedNote[]>(notes);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const reject = async (e: any, note: ParsedNote) => {
    e.preventDefault();

    setVisibleNotes((notes) => notes.filter((n) => n.id !== note.id));

    await fetch(`/api/notes/${note.id}`, {
      method: 'DELETE',
    });
  };

  const approve = async (e: any, note: ParsedNote) => {
    e.preventDefault();

    setVisibleNotes((notes) => notes.filter((n) => n.id !== note.id));

    await fetch(`/api/notes/${note.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        approved: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <div className='flex flex-col justify-center items-center py-10 gap-10'>
      {visibleNotes.length ? (
        visibleNotes.map((note: ParsedNote) => {
          return (
            <div key={note.id} className='flex gap-5 items-center'>
              <StickyNote note={note} />
              <button
                type='submit'
                onClick={(e) => approve(e, note)}
                className='basic-button'
              >
                Approve
              </button>
              <button
                type='submit'
                onClick={(e) => reject(e, note)}
                className='basic-button'
              >
                Reject
              </button>
            </div>
          );
        })
      ) : (
        <h1 className='text-white text-4xl text-center'>
          There aren&apos;t any notes that need approval right now.
        </h1>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({ where: { approved: false } });
  return {
    props: {
      notes: notes.map((note) => ({
        ...note,
        content: JSON.parse(decompressFromBase64(note.content) ?? ''),
      })),
    },
  };
};
