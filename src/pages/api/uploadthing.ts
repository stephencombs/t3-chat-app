import { createNextPageApiHandler } from 'uploadthing/next-legacy';
import { uploadthingRouter } from '~/server/uploadthing';

const handler = createNextPageApiHandler({
    router: uploadthingRouter
});

export default handler;
