import { type Group, type GroupMessage, type User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { createContext, useEffect, type ReactNode } from 'react';
import { useEvent } from '~/hooks/usePusher';
import { api } from '~/utils/api';

type ChatContextType = {
    group?: Group | null;
    isGroupLoading: boolean;
    messages?: GroupMessage[];
    isMessagesLoading: boolean;
    users?: User[];
    isUsersLoading: boolean;
};

export const ChatContext = createContext<ChatContextType>({
    group: null,
    isGroupLoading: true,
    messages: [],
    isMessagesLoading: true,
    users: [],
    isUsersLoading: true
});

type ChatProviderProps = {
    children: ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {
    const { data: sessionData } = useSession();
    const { query, isReady, push: redirect } = useRouter();
    const {
        data: group,
        isLoading: isGroupLoading,
        refetch: refetchGroup
    } = api.group.get.useQuery({ id: query.id as string }, { enabled: isReady });
    const {
        data: messages,
        isLoading: isMessagesLoading,
        refetch: refetchMessages
    } = api.groupMessage.getAll.useQuery({ groupId: query.id as string }, { enabled: isReady });
    const {
        data: groupUsers,
        isLoading: isUsersLoading,
        refetch: refetchUsers
    } = api.group.getAllUsersInGroup.useQuery(
        {
            id: query.id as string
        },
        { enabled: isReady }
    );

    // Check if user is part of the current group
    useEffect(() => {
        if (groupUsers?.users.filter((user) => user.id === sessionData?.user.id).length === 0) {
            console.log('USER NOT IN GROUP');
            void redirect('/');
        }
    }, [groupUsers?.users, sessionData?.user.id, redirect]);

    useEvent(`groupMessage-${query.id as string}`, 'newMessage', () => {
        void refetchMessages();
        // lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return (
        <ChatContext.Provider
            value={{
                group,
                isGroupLoading,
                messages,
                isMessagesLoading,
                users: groupUsers?.users as User[],
                isUsersLoading
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
