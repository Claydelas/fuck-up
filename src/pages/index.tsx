import Seo from '../components/Seo';
import mock from '../../mock/data';
import StickyNote from '../components/StickyNote';
import prisma from '../lib/db';
import { GetStaticProps } from 'next';
import type { Note } from '@prisma/client';

function Home({ notes }: { notes: Note[] }) {
  return (
    <div className='flex items-center flex-col gap-10 py-10'>
      <Seo />
      <div className='w-full grid grid-cols-[repeat(auto-fit,_minmax(13rem,_max-content))] justify-center gap-5'>
        {process.env.NODE_ENV !== 'production'
          ? mock.map((e, idx) => <StickyNote key={idx} note={e} />)
          : notes.map((e, idx) => <StickyNote key={idx} note={e} />)}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  if (process.env.NODE_ENV !== 'production') return { props: { notes: [] } };
  const notes = await prisma.note.findMany();
  return {
    props: {
      notes,
    },
    revalidate: 10,
  };
};

export default Home;
