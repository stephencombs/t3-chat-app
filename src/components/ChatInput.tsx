import { type GroupMessage } from '@prisma/client';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, Extension, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { v4 as uuidv4 } from 'uuid';
import { cn } from 'lib/utils';
import { Edit, Plus, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useCallback, useRef, useState, type ChangeEvent, type HTMLAttributes } from 'react';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';

export interface ChatInputProps extends HTMLAttributes<HTMLInputElement> {}

const ChatInput = ({ className, placeholder }: ChatInputProps) => {
    const { query } = useRouter();
    const utils = api.useContext();
    const { data: sessionData, status: authStatus } = useSession({ required: true });
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editor = useEditor(
        {
            extensions: [
                StarterKit.configure({
                    horizontalRule: false,
                    bulletList: false,
                    orderedList: false,
                    listItem: false,
                    heading: false
                }),
                Placeholder.configure({
                    placeholder: placeholder,
                    showOnlyWhenEditable: false
                }),
                Extension.create({
                    addKeyboardShortcuts() {
                        return {
                            Enter: ({ editor }) => {
                                if (editor.state.doc.textContent.length === 0) return false;

                                const text = editor.getHTML();
                                if (authStatus === 'authenticated') {
                                    createGroupMessage({
                                        groupId: query.id as string,
                                        sender: sessionData?.user.id,
                                        text: text,
                                        files
                                    });
                                }
                                editor.commands.clearContent();

                                return true;
                            }
                        };
                    }
                })
            ],
            editorProps: {
                attributes: {
                    class: 'prose prose-sm dark:prose-invert max-w-none overflow-y-scroll max-h-72 py-2 pr-3 leading-6 focus-visible:outline-none'
                }
            },
            content: '',
            editable: authStatus === 'authenticated'
        },
        [authStatus, query.id]
    );

    const { mutate: createGroupMessage } = api.groupMessage.create.useMutation({
        onMutate: async (newMessage) => {
            await utils.groupMessage.getAll.cancel({ groupId: query.id as string });

            const previousMessages = utils.groupMessage.getAll.getData({ groupId: query.id as string });

            utils.groupMessage.getAll.setData(
                { groupId: query.id as string },
                (old) =>
                    [...(old ?? []), { ...newMessage, files: '', id: uuidv4(), sentAt: new Date() }] as GroupMessage[]
            );

            return { previousMessages };
        },
        onError: (_err, _newMessage, ctx) => {
            utils.groupMessage.getAll.setData({ groupId: query.id as string }, ctx?.previousMessages);
        },
        onSettled: async () => {
            await utils.groupMessage.getAll.invalidate({ groupId: query.id as string });
        }
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        const newFiles = Array.from(e.target.files ?? []);
        setFiles([...files, ...newFiles]);

        // Used to reset state of hidden file input for duplicate file selection
        e.target.value = '';
    };

    const renderFilePreviews = useCallback(() => {
        return files.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            return (
                <li
                    key={previewUrl}
                    className="relative mx-2 flex max-h-[200px] min-h-[200px] min-w-[200px] max-w-[200px] flex-col rounded-md bg-background first:ml-4 last:mr-4"
                >
                    {
                        <div className="absolute right-0 top-0 z-10 flex -translate-y-1 translate-x-2 rounded-sm border border-border bg-background drop-shadow-lg">
                            <Trash
                                className="m-2 h-4 w-4 text-red-500 hover:cursor-pointer"
                                onClick={() => {
                                    setFiles(files.filter((file, i) => i !== idx));
                                }}
                            />
                            <Edit className="m-2 h-4 w-4 hover:cursor-pointer" />
                        </div>
                    }
                    <Image
                        key={previewUrl}
                        className="mt-auto h-[100px] w-[200px] p-2"
                        src={previewUrl}
                        alt={'Preview of ' + file.name}
                        width={200}
                        height={100}
                    />
                    <span className="mt-auto w-full overflow-hidden text-ellipsis whitespace-nowrap p-2 text-sm">
                        {file.name}
                    </span>
                </li>
            );
        });
    }, [files]);

    return (
        <div className={cn('flex flex-col rounded-md border border-input bg-border', className)}>
            {files.length > 0 && (
                <ul className="flex overflow-x-scroll border-b border-input py-4">{renderFilePreviews()}</ul>
            )}
            <div className="flex">
                <div className="p-2">
                    <Plus className="h-6 w-6 cursor-pointer" onClick={() => fileInputRef.current?.click()} />
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                    />
                </div>
                <EditorContent editor={editor} className="min-w-0 flex-auto" />
            </div>
        </div>
    );
};

ChatInput.displayName = 'Input';

export { ChatInput };
