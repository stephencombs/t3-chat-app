import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { type PresenceChannel } from 'pusher-js';
import { useContext, useEffect, useState } from 'react';
import { Button } from '~/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/Avatar';
import { ScrollArea, ScrollViewport } from '~/components/ui/ScrollArea';
import { usePusher } from '~/hooks/usePusher';
import { ChatContext } from '~/providers/ChatProvider';
import GroupInviteDialog from './GroupInviteDialog';

const UserList = () => {
    const { pusherClient } = usePusher();
    const { query } = useRouter();
    const { users } = useContext(ChatContext);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        const channel = pusherClient.subscribe(`presence-groupMessage-${query.id as string}`) as PresenceChannel;

        const updateUsers = () => {
            const memberIds = Object.keys(channel.members.members as unknown[]);
            setOnlineUsers(memberIds);
        };

        channel.bind('pusher:subscription_succeeded', updateUsers);
        channel.bind('pusher:member_added', updateUsers);
        channel.bind('pusher:member_removed', updateUsers);

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe(`presence-groupMessage-${query.id as string}`);
        };
    }, [query.id, pusherClient]);

    return (
        <div className="flex min-w-[260px] max-w-[260px] flex-col">
            <ScrollArea className="h-0 flex-auto">
                <ScrollViewport>
                    {query.id &&
                        users?.map((user) => (
                            <div
                                key={user.id}
                                className="m-2 flex items-center gap-2 rounded-sm p-2 hover:cursor-pointer hover:bg-hover"
                            >
                                <div className="relative">
                                    <Avatar className="h-[35px] w-[35px]">
                                        <AvatarImage src={user.image ?? undefined} />
                                        <AvatarFallback delayMs={1000} />
                                    </Avatar>
                                    {onlineUsers.includes(user.id) ? (
                                        <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500">
                                            {
                                                // <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                            }
                                        </div>
                                    ) : (
                                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-orange-500" />
                                    )}
                                </div>
                                {user.name}
                            </div>
                        ))}
                </ScrollViewport>
            </ScrollArea>
            <GroupInviteDialog />
        </div>
    );
};

export default UserList;
