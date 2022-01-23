import { decompressFromBase64 } from 'lz-string';
import Seo from '../components/Seo';
import mock from '../../mock/data';
import StickyNote, { ParsedNote } from '../components/StickyNote';
import prisma from '../lib/db';
import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useResizeObserver from 'use-resize-observer';
import { Tldraw, TldrawApp } from '@claydelas/tldraw';
import debounce from 'lodash/debounce';

import Modal from 'react-modal';
Modal.setAppElement('#__next');

function Home({ notes }: { notes: ParsedNote[] }) {
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
    <div className='flex items-center flex-col gap-10 py-10'>
      <Seo />
      <div className='w-full grid grid-cols-[repeat(auto-fit,_minmax(13rem,_max-content))] justify-center gap-5'>
        {notes.map((e, idx) => (
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notes =
    process.env.NODE_ENV !== 'production'
      ? mock
      : await prisma.note.findMany({ where: { approved: true } });
  return {
    props: {
      notes: notes.map((note) => ({
        ...note,
        content: JSON.parse(decompressFromBase64(note.content) ?? ''),
      })),
    },
  };
};

export default Home;
