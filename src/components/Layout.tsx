import { ReactElement } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';

export default function Layout({ children }: { children: ReactElement }) {
  const { data: session } = useSession();

  return (
    <div className='min-h-screen'>
      <nav className='fixed w-full z-10 backdrop-blur bg-gradient-to-b from-pastel-pink to-pastel-yellow-200 flex h-14 items-center justify-center rounded-bl-xl rounded-br-xl'>
        <div className='flex justify-between w-full max-w-4xl sm:px-10 px-5'>
          <Link href='/'>
            <a className='font-bold font-["Arial"] text-xl leading-5 min-w-fit self-center'>
              F<span className='text-[#e88e03]'>*</span>CK UP
              <br />
              NIGHT
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
