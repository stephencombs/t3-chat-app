import Chat from '~/components/Chat';
import DefaultLayout from '~/components/layouts';
import { ChatProvider } from '~/providers/ChatProvider';

const GroupChatPage = () => {
    return (
        <DefaultLayout>
            <ChatProvider>
                <Chat />
            </ChatProvider>
        </DefaultLayout>
    );
};

export default GroupChatPage;
