import Seo from '../components/Seo';
import type { OptionalNote } from '../components/StickyNote';
import { useState } from 'react';
import Router from 'next/router';
//import useSWR, { useSWRConfig } from 'swr';

export default function NewNote() {
  //const { mutate } = useSWRConfig();
  const [note, setNote] = useState<OptionalNote>({ preview: '' });
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const submitNote = async (e: any) => {
    e.preventDefault();

    const res = await fetch('/api/notes', {
      body: JSON.stringify({
        body: note,
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
    Router.push('/success');
  };

  return (
    <div className='h-screen max-w-4xl mx-auto flex items-center justify-center flex-col gap-10'>
      <Seo />
      <h1 className='text-4xl'>How did you fuck up?</h1>
      <div className='bg-yellow-500 h-60 w-52 border-2 border-black'>
        <div className='m-5'>
          <textarea
            className='h-[12.5rem] w-full bg-yellow-500 resize-none outline-none overflow-clip placeholder:text-gray-600'
            placeholder='short summary of your fuckup...'
            maxLength={138}
            rows={8}
            onChange={(val) =>
              setNote((n) => ({ ...n, preview: val.target.value }))
            }
            required={true}
          />
        </div>
      </div>
      <h1 className='text-4xl'>What&apos;s your full story?</h1>
      <textarea
        className='w-full bg-white border-2 border-gray-300 shadow-lg px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500'
        //className='w-full outline-none border-2 placeholder:text-gray-600'
        placeholder='It was a calm and sunny day, when I decided to sell my Bitcoins for 11 USD a piece.'
        rows={10}
        onChange={(val) =>
          setNote((n) => ({ ...n, content: val.target.value }))
        }
        required={true}
      />
      <button
        type='submit'
        onClick={submitNote}
        className='p-2 pl-5 pr-5 transition-colors duration-700 transform bg-indigo-500 hover:bg-blue-400 text-gray-100 text-lg rounded-lg focus:border-4 border-indigo-300'
      >
        Submit my story
      </button>
    </div>
  );
}
