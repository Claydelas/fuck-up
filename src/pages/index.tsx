import type { NextPage } from 'next';
import Seo from '../components/Seo';
import mock from '../../mock/data';
import StickyNote from '../components/StickyNote';

const Home: NextPage = () => {
  return (
    <div className='h-screen max-w-4xl mx-auto flex items-center flex-col pt-10'>
      <Seo />
      <h1 className='text-4xl'>Fuckup Wall</h1>
      <div className='w-full m-10 grid grid-cols-[repeat(auto-fit,_minmax(13rem,_max-content))] justify-center gap-5'>
        {mock.map((e, idx) => (
          <StickyNote key={idx} note={e} />
        ))}
      </div>
    </div>
  );
};

export default Home;
