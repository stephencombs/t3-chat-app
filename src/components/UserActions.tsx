import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '~/components/ui/Tooltip';
import { Bell, LogOut, Settings } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import router, { useRouter } from 'next/router';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';
import { api } from '~/utils/api';
import { Button } from './ui/Button';
import { useContext } from 'react';
import { ChatContext } from '~/providers/ChatProvider';
import { useEvent } from '~/hooks/usePusher';

const UserActions = () => {
    const { query } = useRouter();
    const { data: sessionData, status: authStatus } = useSession({ required: true });
    const { data: groupInvites, refetch: refetchInvites } = api.groupInvite.getCurrentUserInvites.useQuery();
    const { mutate: acceptInvite } = api.groupInvite.acceptInvite.useMutation();

    useEvent(`groupMessage-${query.id as string}`, 'newInvite', () => {
        console.log('NEW INVITE')
        void refetchInvites();
    });
    useEvent(`groupMessage-${query.id as string}`, 'inviteAccepted', () => {
        console.log('INVITE ACCEPTED')
        void refetchInvites();
    });

    const handleSignOut = async () => {
        await router.push('/');
        await signOut();
    };

    const handleAcceptInvite = (inviteId: string, groupId: string) => {
        acceptInvite({ inviteId, groupId });
    };

    return (
        <div className="p-2">
            {authStatus === 'authenticated' && (
                <div className="flex items-center pr-2">
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger>
                                <Popover className="translate-x-4">
                                    <PopoverTrigger asChild>
                                        <div className="rounded-md p-2 hover:bg-hover">
                                            <Bell />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        {groupInvites && groupInvites.length > 0 ? (
                                            groupInvites.map((invite) => (
                                                <div
                                                    key={invite.id}
                                                    className="grid grid-cols-[25px_1fr] items-start rounded-md border-b border-b-border p-2 last:border-none hover:bg-hover"
                                                >
                                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium leading-none">
                                                                Group Invite
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                You have been invited to <b>{invite.group?.name}</b>
                                                            </p>
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                onClick={() =>
                                                                    handleAcceptInvite(invite.id, invite.group.id)
                                                                }
                                                            >
                                                                Accept
                                                            </Button>
                                                            <Button variant="secondary">Decline</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div>{"It's quiet in here..."}</div>
                                        )}
                                    </PopoverContent>
                                </Popover>
                            </TooltipTrigger>
                            <TooltipContent>Notifications</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link href="/settings">
                                    <div className="rounded-md p-2 hover:bg-hover">
                                        <Settings />
                                    </div>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Settings</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="rounded-md p-2 hover:bg-hover" onClick={handleSignOut}>
                                    <LogOut />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>Logout</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}
        </div>
    );
};

export default UserActions;
