import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const directMessageRouter = createTRPCRouter({
    // get: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    //     return ctx.prisma.message.findUnique({
    //         where: {
    //             id: input.id
    //         }
    //     });
    // }),
    // getAll: protectedProcedure.input(z.object({ groupId: z.string() })).query(({ ctx, input }) => {
    //     return ctx.prisma.message.findMany({
    //         where: {
    //             recipientId: input.groupId,
    //             type: 'group'
    //         }
    //     });
    // })
});
