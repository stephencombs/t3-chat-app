import { type NextPage } from 'next';
import DefaultLayout from '~/components/layouts';

const Home: NextPage = () => {
    return (
        <DefaultLayout>
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 "></div>
        </DefaultLayout>
    );
};

export default Home;
