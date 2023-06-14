import { LogIn } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/Avatar';
import GroupList from './GroupList';
import NewGroupDialog from './NewGroupDialog';
import UserActions from './UserActions';

const LeftNav = () => {
    const { data: sessionData, status: authStatus } = useSession({ required: true });

    return (
        <div className="flex w-[280px] min-w-[280px] flex-col border-r-2 border-solid border-border">
            <UserActions />
            <GroupList />
            <NewGroupDialog />
            <div className="ml-auto mr-auto flex h-[65px] w-[95%] items-center justify-between border-t-2 border-solid border-border py-2">
                <div className="flex h-full items-center rounded-md p-2 hover:cursor-pointer hover:bg-hover">
                    {authStatus === 'authenticated' ? (
                        <>
                            <Avatar className="h-[35px] w-[35px]">
                                <AvatarImage src={sessionData?.user.image ?? undefined} />
                                <AvatarFallback delayMs={1000} />
                            </Avatar>
                            <div className="px-4 text-sm">{sessionData.user.name}</div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 hover:cursor-pointer" onClick={() => signIn()}>
                            Sign In
                            <LogIn />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeftNav;
