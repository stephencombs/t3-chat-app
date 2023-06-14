import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy';

const f = createUploadthing();

export const uploadthingRouter = {
    image: f({ image: { maxFileSize: '4MB', maxFileCount: 5 } }).onUploadComplete(({ file }) => {
        console.log('URL for uploaded file', file.url);
    }),
    video: f({ video: { maxFileSize: '16MB' } }).onUploadComplete(() => {
        console.log();
    })
} satisfies FileRouter;

export type OurFileRouter = typeof uploadthingRouter;
