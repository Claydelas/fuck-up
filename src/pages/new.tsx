import Seo from '../components/Seo';
import { useRef, useCallback, useState } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { TldrawApp, TldrawProps } from '@claydelas/tldraw';

import Modal from 'react-modal';
import StickyNote from '../components/StickyNote';
Modal.setAppElement('#__next');

// Disable SSR for drawing component
const Draw = dynamic<TldrawProps>(
  () => import('@claydelas/tldraw').then((m) => m.Tldraw),
  { ssr: false }
);

export default function NewNote() {
  const [preview, setPreview] = useState('');

  const board = useRef<TldrawApp>();

  const handleMount = useCallback((app: TldrawApp) => {
    board.current = app;
    app.setSetting('isDebugMode', false);
    app.toggleGrid();
  }, []);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const submitNote = async (e: any) => {
    e.preventDefault();

    const canvas = board.current?.saveToString();

    const res = await fetch('/api/notes', {
      body: JSON.stringify({
        preview,
        content: canvas,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const { error } = await res.json();
    if (error) {
      return;
    }
    Router.push('/');
  };

  const [modalIsOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className='flex flex-col gap-5 py-5 px-2 min-h-[calc(100vh-3.5rem)]'>
      <Seo />
      <h1 className='text-4xl text-center text-white'>
        What&apos;s your story?
      </h1>
      <div className='relative board-wrapper flex-grow'>
        <Draw disableAssets autofocus={true} onMount={handleMount}></Draw>
      </div>
      <button type='submit' onClick={openModal} className='basic-button'>
        Submit my story
      </button>
      {typeof window !== 'undefined' && (
        <Modal
          isOpen={modalIsOpen}
          closeTimeoutMS={400}
          shouldCloseOnEsc
          onRequestClose={closeModal}
          overlayClassName='fixed top-14 right-0 left-0 bottom-0 flex items-center justify-center px-14 backdrop-blur-sm'
          className='flex flex-col max-w-4xl mx-auto items-center justify-center gap-5'
        >
          <h1 className='text-2xl'>Preview</h1>
          <StickyNote>
            <textarea
              className='w-full resize-none outline-none placeholder:text-gray-500 bg-transparent text-center line-clamp-6 !overflow-clip'
              placeholder='Short summary of your fuckup...'
              maxLength={200}
              rows={6}
              autoFocus
              onChange={(val) => setPreview(val.target.value)}
              required={true}
              value={preview}
            />
          </StickyNote>
          <button className='basic-button' onClick={submitNote}>
            Submit
          </button>
        </Modal>
      )}
    </div>
  );
}
