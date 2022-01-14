import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import admins from '../../../data/admins';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (token.email && admins.includes(token.email)) {
        token.admin = true;
      } else {
        token.admin = false;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.admin = token.admin as boolean;
      return session;
    },
  },
  secret: process.env.JWT_TOKEN,
});
