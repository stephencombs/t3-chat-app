import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { getPusherServerClient } from '~/server/pusher';

export const groupMessageRouter = createTRPCRouter({
    get: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.groupMessage.findUnique({
            where: {
                id: input.id
            }
        });
    }),
    getAll: protectedProcedure.input(z.object({ groupId: z.string() })).query(({ ctx, input }) => {
        return ctx.prisma.groupMessage.findMany({
            where: {
                groupId: input.groupId
            },
            orderBy: {
                sentAt: 'asc'
            }
        });
    }),
    create: protectedProcedure
        .input(
            z.object({
                text: z.string(),
                files: z.any().optional(),
                groupId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            // let fileUrls = '';
            // if (input.files) {
            //     const uploadedFiles = await fetch('/api/uploadthing?actionType=upload&slug=image', {
            //         body: input.files as File[],
            //         method: 'POST'
            //     });
            //     console.log(uploadedFiles);
            //     // fileUrls = uploadedFiles.map((file) => file.fileUrl).toString();
            // }

            await ctx.prisma.groupMessage.create({
                data: {
                    ...input,
                    sender: ctx.session.user.id,
                    files: ''
                }
            });

            await getPusherServerClient().trigger(`groupMessage-${input.groupId}`, `newMessage`, {
                userId: ctx.session.user.id,
                groupId: input.groupId
            });
        }),
    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
        return ctx.prisma.groupMessage.delete({
            where: {
                id: input.id
            }
        });
    })
});
