import { type Group } from '@prisma/client';
import { cn } from 'lib/utils';
import Link from 'next/link';
import router from 'next/router';
import GroupListSkeleton from '~/components/skeletons/GroupListSkeleton';
import { ScrollArea, ScrollViewport } from '~/components/ui/ScrollArea';
import { useEvent } from '~/hooks/usePusher';
import { api } from '~/utils/api';

const GroupList = () => {
    const { data: userGroups, isLoading: isGroupsLoading, refetch } = api.group.getAllUserGroups.useQuery();

    // Refetch groups when a new group is created
    useEvent('group', 'newGroup', () => {
        void refetch();
    });

    return (
        <ScrollArea className="h-0 flex-auto" type="scroll">
            <ScrollViewport>
                {isGroupsLoading ? (
                    <GroupListSkeleton />
                ) : (
                    userGroups?.map((group, idx) => (
                        <GroupListItem key={idx} href={`/group/${group.id}`} group={group} />
                    ))
                )}
            </ScrollViewport>
        </ScrollArea>
    );
};

const GroupListItem = ({ href, group }: { href: string; group: Group }) => (
    <Link href={href}>
        <div className={cn('m-2 rounded-sm p-4 text-sm hover:bg-hover', router.asPath === href && 'bg-hover')}>
            {group.name}
        </div>
    </Link>
);

export default GroupList;
