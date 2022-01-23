import { decompressFromBase64 } from 'lz-string';
import Seo from '../components/Seo';
import StickyNote, { ParsedNote } from '../components/StickyNote';
import { useCallback, useRef, useState } from 'react';
import { Tldraw, TldrawApp } from '@claydelas/tldraw';
import { Note } from '@prisma/client';
import useSWR from 'swr';

import Modal from 'react-modal';
Modal.setAppElement('#__next');

const fetchNotes = async (url: string) => {
  const notes: Note[] = (await fetch(url).then((r) => r.json())).notes;
  return notes.map((note) => ({
    ...note,
    content: JSON.parse(decompressFromBase64(note.content) ?? ''),
  }));
};

function Home() {
  const app = useRef<TldrawApp>();

  const { data } = useSWR('/api/notes', fetchNotes);

  const handleMount = useCallback((state: TldrawApp) => {
    app.current = state;
    state.setSetting('isDebugMode', false);
    state.toggleGrid();
  }, []);

  const [modalIsOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  const [openNote, setOpenNote] = useState<ParsedNote>({} as ParsedNote);

  return (
    <div className='flex items-center flex-col gap-10 py-10'>
      <Seo />
      <div className='w-full grid grid-cols-[repeat(auto-fit,_minmax(13rem,_max-content))] justify-center gap-5'>
        {data &&
          data.map((e, idx) => (
            <StickyNote
              key={idx}
              onClick={() => {
                setOpenNote(e);
                setIsOpen(true);
              }}
            >
              {e.preview}
            </StickyNote>
          ))}
      </div>
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
            }, 50)
          }
        >
          <div className='relative h-full w-full board-wrapper'>
            <Tldraw
              document={openNote?.content?.document}
              readOnly
              showUI={false}
              onMount={handleMount}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Home;
