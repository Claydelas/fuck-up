import { decompressFromBase64 } from 'lz-string';
import { useState } from 'react';
import StickyNote, { ParsedNote } from '../components/StickyNote';
import prisma from '../lib/db';
import { GetServerSideProps } from 'next';
import { useCallback, useRef } from 'react';
import useResizeObserver from 'use-resize-observer';
import { Tldraw, TldrawApp } from '@claydelas/tldraw';

import Modal from 'react-modal';
Modal.setAppElement('#__next');

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

  const app = useRef<TldrawApp>();

  const handleMount = useCallback((state: TldrawApp) => {
    app.current = state;
    state.setSetting('isDebugMode', false);
    state.toggleGrid();
  }, []);

  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: () => {
      app.current?.zoomToFit();
    },
  });

  const [modalIsOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  const [openNote, setOpenNote] = useState<ParsedNote>({} as ParsedNote);

  return (
    <div className='flex flex-col justify-center items-center py-10 gap-10'>
      {visibleNotes.length ? (
        <>
          {visibleNotes.map((note: ParsedNote) => (
            <div
              key={note.id}
              className='flex flex-wrap items-center justify-center px-5 gap-5'
            >
              <StickyNote
                onClick={() => {
                  setOpenNote(note);
                  setIsOpen(true);
                }}
              >
                {note.preview}
              </StickyNote>
              <div className='flex sm:flex-col gap-5'>
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
            </div>
          ))}
          {typeof window !== 'undefined' && (
            <Modal
              isOpen={modalIsOpen}
              closeTimeoutMS={400}
              shouldCloseOnEsc
              onRequestClose={closeModal}
              overlayClassName='fixed top-14 right-0 left-0 bottom-0 flex items-center justify-center px-14 backdrop-blur-sm'
              className='h-[calc(100vh-300px)] w-full max-w-4xl mx-auto'
              onAfterOpen={() =>
                setTimeout(() => {
                  app.current?.zoomToFit();
                }, 1)
              }
            >
              <div className='relative h-full w-full board-wrapper' ref={ref}>
                <Tldraw
                  document={openNote?.content?.document}
                  readOnly
                  showUI={false}
                  onMount={handleMount}
                />
              </div>
            </Modal>
          )}
        </>
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
