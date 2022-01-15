import Seo from '../components/Seo';
import { useRef, useCallback, useState } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { TldrawApp, TldrawProps } from '@claydelas/tldraw';

// Disable SSR for drawing component
const Draw = dynamic<TldrawProps>(
  () => import('@claydelas/tldraw').then((m) => m.Tldraw),
  { ssr: false }
);

export default function NewNote() {
  const [preview] = useState('');

  const board = useRef<TldrawApp>();

  const handleMount = useCallback((app: TldrawApp) => {
    board.current = app;
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

  return (
    <div className='flex flex-col gap-5'>
      <Seo />
      <h1 className='text-4xl text-center text-white mt-5'>
        What&apos;s your story?
      </h1>
      <div className='relative h-[calc(100vh-300px)] w-full board-wrapper'>
        <Draw disableAssets autofocus={true} onMount={handleMount}></Draw>
      </div>
      <button type='submit' onClick={submitNote} className='basic-button'>
        Submit my story
      </button>
    </div>
  );
}
