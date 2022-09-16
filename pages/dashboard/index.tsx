import { checkAuthentication } from '@/utils/checkAuthentication';
import Revenue from './components/Revenue';

const Dashboard = () => {
    return (
        <main>
            <Revenue revenue={67500} nftCount={7575} royalty={7200} />
        </main>
    );
};

export const getServerSideProps = checkAuthentication((context:any) => {
    return {};
});

export default Dashboard;
