import { decompressFromBase64 } from 'lz-string';
import Seo from '../components/Seo';
import mock from '../../mock/data';
import StickyNote, { ParsedNote } from '../components/StickyNote';
import prisma from '../lib/db';
import { GetStaticProps } from 'next';
import { useCallback, useRef, useState } from 'react';
import useResizeObserver from 'use-resize-observer';
import { Tldraw, TldrawApp } from '@claydelas/tldraw';

import Modal from 'react-modal';
Modal.setAppElement('#__next');

function Home({ notes }: { notes: ParsedNote[] }) {
  const app = useRef<TldrawApp>();

  const handleMount = useCallback((state: TldrawApp) => {
    app.current = state;
  }, []);

  const [modalContent, setModalContent] = useState<HTMLDivElement>();

  useResizeObserver<HTMLDivElement>({
    ref: modalContent,
    onResize: ({ width, height }) => {
      if (!width || !height) return;
      if (width < 400 || height < 400) {
        app.current?.zoomToFit();
      } else {
        app.current?.resetZoom();
        app.current?.zoomToContent();
      }
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
            note={e}
            onClick={() => {
              setOpenNote(e);
              setIsOpen(true);
            }}
          />
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
          contentRef={(node) => setModalContent(node)}
          onAfterOpen={() =>
            setTimeout(() => {
              if (!modalContent) return;
              if (
                modalContent.clientWidth < 400 ||
                modalContent.clientHeight < 400
              ) {
                app.current?.zoomToFit();
              } else {
                app.current?.zoomToContent();
              }
            }, 1)
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

export const getStaticProps: GetStaticProps = async () => {
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
    revalidate: 10,
  };
};

export default Home;
