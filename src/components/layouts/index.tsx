import { type ReactNode } from 'react';
import LeftNav from '../LeftNav';
import Head from 'next/head';
import ThemeChanger from '../ThemeChanger';

type DefaultLayoutProps = {
    children: ReactNode;
};

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <>
            <Head>
                <title>T3 Chat App</title>
                <meta name="description" content="Developed by Stephen Combs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen bg-background text-foreground">
                <ThemeChanger />
                <LeftNav />
                <div className="min-h-0 min-w-0 flex-auto">{children}</div>
            </main>
        </>
    );
};

export default DefaultLayout;
