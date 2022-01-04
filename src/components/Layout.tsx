import { ReactElement } from 'react';

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <nav className='fixed w-full z-10 backdrop-blur bg-gradient-to-b from-pastel-pink to-pastel-yellow-200 flex h-14 items-center justify-center'>
        <div className='text-4xl'>FUCKUP LOGO</div>
      </nav>
      <div className='min-h-screen pt-24 pb-10 bg-[#202023]'>{children}</div>
    </>
  );
}
