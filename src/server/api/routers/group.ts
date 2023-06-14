import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { getPusherServerClient } from '~/server/pusher';

export const groupRouter = createTRPCRouter({
    get: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.group.findUnique({
            where: {
                id: input.id
            }
        });
    }),
    getAllUserGroups: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.group.findMany({
            where: {
                users: {
                    some: {
                        id: ctx.session.user.id
                    }
                }
            }
        });
    }),
    getAllUsersInGroup: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.group.findUnique({
            where: {
                id: input.id
            },
            select: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });
    }),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                description: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Trigger new group event
            await getPusherServerClient().trigger('group', 'newGroup', null);
            return ctx.prisma.group.create({
                data: {
                    ...input,
                    users: {
                        connect: [{ id: ctx.session.user.id }]
                    }
                }
            });
        })
});
