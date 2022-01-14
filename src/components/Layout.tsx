import { ReactElement } from 'react';
import Image from 'next/image';
import logo from '/public/fuck-up-logo.png';
import { signIn, useSession } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';

export default function Layout({ children }: { children: ReactElement }) {
  const { data: session } = useSession();

  return (
    <div className='min-h-screen'>
      <nav className='fixed w-full z-10 backdrop-blur bg-gradient-to-b from-pastel-pink to-pastel-yellow-200 flex h-14 items-center justify-center'>
        <div className='flex justify-between w-full max-w-4xl px-10'>
          <Link href='/'>
            <a className='flex'>
              <Image src={logo} alt='logo' className='invert' />
            </a>
          </Link>
          <div className='flex items-center text-xl gap-5'>
            <button>
              <Link href='/new'>Submit a Story</Link>
            </button>
            {session ? (
              <>
                {session.user?.admin && <Link href='/approve'>Approve</Link>}
                <h1>{session.user?.name}</h1>
              </>
            ) : (
              <button>
                <FcGoogle size={28} onClick={() => signIn('google')} />
              </button>
            )}
          </div>
        </div>
      </nav>
      <div className='pt-14 max-w-4xl mx-auto'>{children}</div>
    </div>
  );
}
