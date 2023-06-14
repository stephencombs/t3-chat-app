import { createTRPCRouter } from '~/server/api/trpc';
import { directMessageRouter } from './routers/directMessage';
import { groupMessageRouter } from './routers/groupMessage';
import { groupRouter } from './routers/group';
import { userRouter } from './routers/user';
import { groupInviteRouter } from './routers/groupInvite';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    user: userRouter,
    group: groupRouter,
    groupMessage: groupMessageRouter,
    groupInvite: groupInviteRouter,
    directMessage: directMessageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
