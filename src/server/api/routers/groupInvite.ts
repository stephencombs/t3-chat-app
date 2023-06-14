import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { getPusherServerClient } from '~/server/pusher';

export const groupInviteRouter = createTRPCRouter({
    get: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.groupInvite.findUnique({
            where: {
                id: input.id
            }
        });
    }),
    getCurrentUserInvites: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.groupInvite.findMany({
            where: {
                receiverId: ctx.session.user.id
            },
            select: {
                id: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }),
    acceptInvite: protectedProcedure
        .input(z.object({ inviteId: z.string(), groupId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.group.update({
                where: {
                    id: input.groupId
                },
                data: {
                    users: {
                        connect: {
                            id: ctx.session.user.id
                        }
                    }
                }
            });

            await ctx.prisma.groupInvite.delete({
                where: {
                    id: input.inviteId
                }
            });

            await getPusherServerClient().trigger(`group-${input.groupId}`, `inviteAccepted`, {
                userId: ctx.session.user.id,
                groupId: input.groupId
            });
        }),
    create: protectedProcedure
        .input(
            z.object({
                receiverId: z.string(),
                groupId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.groupInvite.create({
                data: {
                    sender: {
                        connect: {
                            id: ctx.session.user.id
                        }
                    },
                    receiver: {
                        connect: {
                            id: input.receiverId
                        }
                    },
                    group: {
                        connect: {
                            id: input.groupId
                        }
                    }
                }
            });

            await getPusherServerClient().trigger(`group-${input.groupId}`, `newInvite`, {
                userId: ctx.session.user.id,
                groupId: input.groupId
            });
        }),
    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.groupInvite.delete({
            where: {
                id: input.id
            }
        });
    })
});
