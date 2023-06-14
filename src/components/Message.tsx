import { type DirectMessage, type GroupMessage } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { type ComponentProps } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/Avatar';
import { api } from '~/utils/api';

type MessageProps = {
    message: GroupMessage | DirectMessage;
    previousMessageSender: string;
    previousMessageDate: Date;
} & ComponentProps<'div'>;

const SenderMessage = ({ message, previousMessageSender, previousMessageDate }: MessageProps) => {
    const { data: sessionData } = useSession();
    const isCurrentUser = previousMessageSender === message.sender;
    const isSentDay = previousMessageDate.getDay() === message.sentAt.getDay();

    return (
        <div className="flex w-full flex-col items-end first:pt-4">
            {!isCurrentUser && (
                <div className="relative flex max-w-max items-center gap-2 self-end pr-[4.2rem] font-semibold text-blue-500">
                    <MessageTime message={message} />
                    {sessionData?.user.name}
                    <Avatar className="absolute right-0 top-0 inline-flex h-[50px] w-[50px] select-none items-center justify-center overflow-hidden rounded-full border-4 border-solid border-background align-middle">
                        <AvatarImage src={sessionData?.user.image ?? undefined} />
                        <AvatarFallback
                            className="inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle"
                            delayMs={1000}
                        />
                    </Avatar>
                </div>
            )}
            {isCurrentUser && !isSentDay && (
                <div className="flex w-full items-center gap-2 self-end py-2 pr-[4.2rem] font-semibold">
                    <div className="h-px flex-auto bg-border"></div>
                    <MessageTime message={message} />
                </div>
            )}
            <div className="group flex w-full items-center justify-end gap-2 rounded-md leading-8 hover:bg-hover">
                <div className="flex flex-col">
                    <div
                        className="prose prose-sm max-w-none py-2 pl-4 dark:prose-invert focus:outline-none"
                        dangerouslySetInnerHTML={{ __html: message.text }}
                    ></div>
                    <MessageFiles message={message} />
                </div>
                <div
                    className={`invisible min-w-[60px] pr-2 text-xs text-gray-500 ${
                        isCurrentUser && isSentDay ? 'group-hover:visible' : ''
                    }`}
                >
                    {message.sentAt.toLocaleTimeString(undefined, {
                        timeStyle: 'short'
                    })}
                </div>
            </div>
        </div>
    );
};

const RecieverMessage = ({ message, previousMessageSender, previousMessageDate }: MessageProps) => {
    const messageSenderQuery = api.user.get.useQuery({ id: message.sender });
    const isCurrentUser = previousMessageSender === message.sender;
    const isSentDay = previousMessageDate.getDay() === message.sentAt.getDay();

    return (
        <div className="flex w-full flex-col items-start first:pt-4">
            {!isCurrentUser && (
                <div className="relative flex max-w-max items-center gap-2 self-start pl-[4.2rem] font-semibold text-yellow-300">
                    <Avatar className="absolute left-0 top-0 inline-flex h-[50px] w-[50px] select-none items-center justify-center overflow-hidden rounded-full border-4 border-solid border-background align-middle">
                        <AvatarImage src={messageSenderQuery.data?.image ?? undefined} />
                        <AvatarFallback
                            className="inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle"
                            delayMs={1000}
                        />
                    </Avatar>
                    {messageSenderQuery.data?.name}
                    <MessageTime message={message} />
                </div>
            )}
            {isCurrentUser && !isSentDay && (
                <div className="flex w-full items-center gap-2 py-2 pr-[4.2rem] font-semibold">
                    <MessageTime message={message} />
                    <div className="h-px flex-auto bg-border"></div>
                </div>
            )}
            <div className="group flex w-full items-center gap-2 rounded-md pr-4 text-start leading-8 hover:bg-hover">
                <div
                    className={`invisible min-w-[60px] pl-2 text-xs text-stone-900 dark:text-stone-500 ${
                        isCurrentUser && isSentDay ? 'group-hover:visible' : ''
                    }`}
                >
                    {message.sentAt.toLocaleTimeString(undefined, {
                        timeStyle: 'short'
                    })}
                </div>
                <div className="flex flex-col">
                    <div
                        className="prose prose-sm max-w-none py-2 pr-4 dark:prose-invert focus:outline-none"
                        dangerouslySetInnerHTML={{ __html: message.text }}
                    ></div>
                    <MessageFiles message={message} />
                </div>
            </div>
        </div>
    );
};

const MessageFiles = ({ message }: { message: GroupMessage | DirectMessage }) => {
    return (
        <>
            {message.files &&
                message.files.split(',').map((file) => (
                    <Link key={file} href={file}>
                        <Image
                            className="my-2 rounded-md"
                            alt={'Image from ' + message.sender}
                            src={file}
                            width={400}
                            height={400}
                            priority
                        />
                    </Link>
                ))}
        </>
    );
};

const MessageTime = ({ message }: { message: GroupMessage | DirectMessage }) => {
    return (
        <div className="text-xs text-muted-foreground">
            {message.sentAt.toLocaleDateString()} at{' '}
            {message.sentAt.toLocaleTimeString(undefined, {
                timeStyle: 'short'
            })}
        </div>
    );
};

export { SenderMessage, RecieverMessage };
