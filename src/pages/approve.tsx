/* eslint-disable @typescript-eslint/no-explicit-any */
import { decompressFromBase64 } from 'lz-string';
import { useEffect, useMemo, useState } from 'react';
import StickyNote, { ParsedNote } from '../components/StickyNote';
import { useCallback, useRef } from 'react';
import useResizeObserver from 'use-resize-observer';
import { Tldraw, TldrawApp } from '@claydelas/tldraw';
import debounce from 'lodash/debounce';
import useSWR, { useSWRConfig } from 'swr';
import { Note } from '@prisma/client';

import Modal from 'react-modal';
Modal.setAppElement('#__next');

type NotesApiResponse = {
  approved: Note[];
  pending: Note[];
};

const parse = (notes: Note[]) => {
  return notes.map((note) => ({
    ...note,
    content: JSON.parse(decompressFromBase64(note.content) ?? ''),
  }));
};

const fetchNotes = async (url: string) => {
  const notes: NotesApiResponse = await fetch(url).then((r) => r.json());
  return {
    approved: parse(notes.approved),
    pending: parse(notes.pending),
  };
};

type View = 'approved' | 'pending';

export default function ApprovePage() {
  const [view, setView] = useState<View>('pending');

  const changeView = () => {
    setView((view) => (view === 'pending' ? 'approved' : 'pending'));
  };

  const { data } = useSWR('/api/admin/notes', fetchNotes);
  const { mutate } = useSWRConfig();

  const reject = async (e: any, note: ParsedNote, view: View) => {
    e.preventDefault();

    mutate(
      '/api/admin/notes',
      {
        ...data,
        [view]: data ? data[view].filter((n) => n.id !== note.id) : [],
      },
      false
    );

    await fetch(`/api/admin/notes/${note.id}`, {
      method: 'DELETE',
    });

    mutate('/api/admin/notes');
  };

  const approve = async (e: any, note: ParsedNote) => {
    e.preventDefault();

    mutate(
      '/api/admin/notes',
      {
        pending: data ? data.pending.filter((n) => n.id !== note.id) : [],
        approved: data ? [...data.approved, note] : [note],
      },
      false
    );

    await fetch(`/api/admin/notes/${note.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        approved: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    mutate('/api/admin/notes');
  };

  const app = useRef<TldrawApp>();

  const [loading, setLoading] = useState(true);

  const handleMount = useCallback((state: TldrawApp) => {
    app.current = state;
    state.setSetting('isDebugMode', false);
    state.toggleGrid();
    setTimeout(() => setLoading(false), 10);
  }, []);

  const debouncedZoom = useMemo(
    () => debounce(() => app.current?.zoomToFit(), 500),
    [app]
  );

  useEffect(() => {
    return () => {
      debouncedZoom.cancel();
    };
  }, [debouncedZoom]);

  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: () => {
      if (!loading) debouncedZoom();
    },
  });

  const [modalIsOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  const [openNote, setOpenNote] = useState<ParsedNote>({} as ParsedNote);

  return (
    <div className='flex flex-col justify-center items-center py-10 gap-10'>
      <button className='basic-button max-w-max' onClick={changeView}>
        {view === 'pending'
          ? 'View already approved notes'
          : 'View freshly submitted notes'}
      </button>
      {data && data[view].length ? (
        <>
          {data[view].map((note: ParsedNote) => (
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
                {view === 'pending' && (
                  <button
                    type='submit'
                    onClick={(e) => approve(e, note)}
                    className='basic-button'
                  >
                    Approve
                  </button>
                )}
                <button
                  type='submit'
                  onClick={(e) => reject(e, note, view)}
                  className='basic-button'
                >
                  {view === 'approved' ? 'Delete' : 'Reject'}
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
          {view === 'pending'
            ? "There aren't any notes that need approval right now."
            : "There aren't any notes on the wall."}
        </h1>
      )}
    </div>
  );
}
