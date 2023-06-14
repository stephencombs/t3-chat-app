import '@uploadthing/react/styles.css';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import '~/styles/globals.css';
import { api } from '~/utils/api';
import { ThemeProvider } from 'next-themes';

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <ThemeProvider attribute="class" enableSystem={false}>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </ThemeProvider>
    );
};

export default api.withTRPC(MyApp);
