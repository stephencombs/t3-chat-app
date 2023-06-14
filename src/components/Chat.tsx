import { type Group } from '@prisma/client';
import { ArrowDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { ChatInput } from '~/components/ChatInput';
import { RecieverMessage, SenderMessage } from '~/components/Message';
import UserList from '~/components/UserList';
import ChatWindowSkeleton from '~/components/skeletons/ChatWindowSkeleton';
import { ScrollArea, ScrollBar, ScrollViewport } from '~/components/ui/ScrollArea';
import { Skeleton } from '~/components/ui/Skeleton';
import { useEvent } from '~/hooks/usePusher';
import useScroll from '~/hooks/useScroll';
import { ChatContext } from '~/providers/ChatProvider';

const Chat = () => {
    const { asPath } = useRouter();
    const { data: sessionData } = useSession({ required: true });
    const { scrollRef, onScroll, isBottom } = useScroll(asPath);
    const { group, isGroupLoading, messages: groupMessages, isMessagesLoading } = useContext(ChatContext);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const lastMessageRef = useRef<HTMLDivElement>(null);

    useEvent(`groupMessage-${group?.id ?? ''}`, 'newMessage', ({ userId }: { userId: string }) => {
        if (userId === sessionData?.user.id) handleScrollToBottom();
        else setHasUnreadMessages(true);
    });

    useEffect(() => {
        if (isBottom) setHasUnreadMessages(false);
    }, [isBottom]);

    const handleScrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex min-h-screen flex-auto flex-col">
            <ChatWindowHeader group={group} isLoading={isGroupLoading} />
            <div className="grid flex-auto grid-cols-[minmax(600px,_1fr)_260px]">
                <div className="flex flex-auto flex-col">
                    <ScrollArea className="relative h-0 flex-auto px-4" type="always">
                        <ScrollViewport onScroll={onScroll} ref={scrollRef}>
                            {isMessagesLoading ? (
                                <ChatWindowSkeleton />
                            ) : (
                                groupMessages?.map((message, idx) => {
                                    const previousMessageSender = groupMessages[idx - 1]?.sender ?? '';
                                    const previousMessageDate = groupMessages[idx - 1]?.sentAt ?? new Date();
                                    return message.sender === sessionData?.user.id ? (
                                        <SenderMessage
                                            key={message.id}
                                            message={message}
                                            previousMessageSender={previousMessageSender}
                                            previousMessageDate={previousMessageDate}
                                        />
                                    ) : (
                                        <RecieverMessage
                                            key={message.id}
                                            message={message}
                                            previousMessageSender={previousMessageSender}
                                            previousMessageDate={previousMessageDate}
                                        />
                                    );
                                })
                            )}

                            <div className="pb-4" ref={lastMessageRef} />
                            {hasUnreadMessages && (
                                <div
                                    className="absolute bottom-0 right-0 mx-4 my-2 flex max-w-max gap-1 rounded-full bg-hover px-2 py-1 hover:cursor-pointer"
                                    onClick={handleScrollToBottom}
                                >
                                    <span>Unread Messages Below</span>
                                    <ArrowDown className="p-[2px]" />
                                </div>
                            )}
                        </ScrollViewport>
                        <ScrollBar orientation="vertical" className="rounded-full border-none" />
                    </ScrollArea>
                    <ChatInput className="mx-4 mb-4" placeholder={`Send a message in ${group?.name ?? 'group'}`} />
                </div>
                <UserList />
            </div>
        </div>
    );
};

const ChatWindowHeader = ({ group, isLoading }: { group?: Group | null; isLoading: boolean }) => {
    return (
        <div className="flex max-h-[58px] min-h-[58px] items-center gap-2 divide-x-[1px] divide-solid divide-border border-b-2 border-solid border-border p-4">
            {isLoading ? (
                <>
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-60 pl-2" />
                </>
            ) : (
                <>
                    <span className="font-semibold">{group?.name}</span>
                    <span className="pl-2">{group?.description}</span>
                </>
            )}
        </div>
    );
};

export default Chat;
