import { Skeleton } from '~/components/ui/Skeleton';

const ChatWindowSkeleton = () => {
    return (
        <>
            <div className="flex flex-col items-end gap-2 first:pt-4">
                <div className="relative flex max-w-max items-center gap-2 self-end pr-[4.2rem]">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="absolute right-0 top-0 inline-flex h-[50px] w-[50px] rounded-full align-middle" />
                </div>
                <div className="mr-[60px] flex flex-col items-end gap-2">
                    <Skeleton className="h-5 w-60" />
                    <Skeleton className="h-5 w-52" />
                    <Skeleton className="h-5 w-72" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-96" />
                    <Skeleton className="h-5 w-80" />
                    <Skeleton className="h-5 w-44" />
                </div>
            </div>
            <div className="flex flex-col gap-2 first:pt-4">
                <div className="relative flex max-w-max items-center gap-2 pl-[4.2rem]">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="absolute left-0 top-0 inline-flex h-[50px] w-[50px] rounded-full align-middle" />
                </div>
                <div className="ml-[60px] flex flex-col gap-2">
                    <Skeleton className="h-5 w-60" />
                    <Skeleton className="h-5 w-52" />
                    <Skeleton className="h-5 w-72" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-96" />
                    <Skeleton className="h-5 w-80" />
                    <Skeleton className="h-5 w-44" />
                </div>
            </div>
        </>
    );
};

export default ChatWindowSkeleton;
