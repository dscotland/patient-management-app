import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { Amplify, Auth } from "aws-amplify";
import { parse } from "path";

Amplify.configure({
  Auth: {
    userPoolId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_AUTH_WEB_CLIENT_ID,
  },
});
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req: any) {
        try {
          const user = await Auth.signIn(
            credentials.email,
            credentials.password
          );
          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (e: any) {
          throw new Error(e.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/index",
  },
  secret: "gn2IAFNqDThBwJVVvqDct/KDhO9N7USXifHPa0AFo4o=",
  session: {
    //@ts-ignore
    jwt: true,
  },
  callbacks: {
    // Getting the JWT token from API response
    async session({ session, token }: any) {
      //const newSession = await Auth.currentSession();
      session.user = token.user;
      return session;
    },
    
    async jwt({ token, user }: any) {
      if (user) {
        token.user = { ...user };
        return token;
      } else if (Date.now() < token.exp * 1000){
        token.user.signInUserSession = JSON.parse(JSON.stringify({... await Auth.currentSession()}));
        return token;
      } else {
        token.user.signInUserSession = JSON.parse(JSON.stringify({... await Auth.currentSession()}));
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
