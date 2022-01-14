import Seo from '../components/Seo';
//import type { OptionalNote } from '../components/StickyNote';
import { useRef, useCallback } from 'react';
//import Router from 'next/router';
import dynamic from 'next/dynamic';
import { TldrawApp, TldrawProps } from '@claydelas/tldraw';

// Disable SSR for drawing component
const Draw = dynamic<TldrawProps>(
  () => import('@claydelas/tldraw').then((m) => m.Tldraw),
  { ssr: false }
);

//import useSWR, { useSWRConfig } from 'swr';

export default function NewNote() {
  //const { mutate } = useSWRConfig();
  //const [note] = useState<OptionalNote>({ preview: '' });

  const board = useRef<TldrawApp>();
  //board.current.string

  const handleMount = useCallback((app: TldrawApp) => {
    board.current = app;
  }, []);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  /*const submitNote = async (e: any) => {
    e.preventDefault();

    const res = await fetch('/api/notes', {
      body: JSON.stringify({
        ...note,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const { error } = await res.json();
    if (error) {
      //Do something else
      return;
    }
    //mutate('/api/notes');
    Router.push('/');
  }; */

  return (
    <div className='flex flex-col gap-5'>
      <Seo />
      <h1 className='text-4xl text-center text-white mt-5'>
        What&apos;s your story?
      </h1>
      <div className='relative h-[calc(100vh-300px)] w-full'>
        <Draw
          onSaveProject={(app) => {
            app.saveProject();
          }}
          autofocus={true}
          onMount={handleMount}
        ></Draw>
      </div>
      <button
        type='submit'
        onClick={() => {
          board.current?.saveProject();
        }}
        className='p-2 pl-5 pr-5 transition-colors duration-700 transform bg-indigo-500 hover:bg-blue-400 text-gray-100 text-lg rounded-lg focus:border-4 border-indigo-300'
      >
        Submit my story
      </button>
    </div>
  );
}
