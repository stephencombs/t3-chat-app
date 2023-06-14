import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '~/components/ui/Dialog';
import { PlusIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/Button';
import { api } from '~/utils/api';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/Form';
import { Input } from './ui/Input';
import { ChatContext } from '~/providers/ChatProvider';

const inviteFormSchema = z.object({
    name: z.string()
});

type InviteForm = z.infer<typeof inviteFormSchema>;

const GroupInviteDialog = () => {
    const { group } = useContext(ChatContext);
    const { mutate: createInvite } = api.groupInvite.create.useMutation();
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<InviteForm>({
        resolver: zodResolver(inviteFormSchema),
        defaultValues: {
            name: ''
        }
    });

    const handleCreateInvite = (values: InviteForm) => {
        if (group)
            createInvite({
                receiverId: values.name,
                groupId: group?.id
            });
        setDialogOpen(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="mx-2 mb-4 mt-2" variant="outline">
                    <PlusIcon className="mr-2 h-6 w-6" />
                    Invite
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Group Members</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <InviteFormComponent form={form} />
                <DialogFooter>
                    <Button onClick={form.handleSubmit(handleCreateInvite)}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const InviteFormComponent = ({ form }: { form: UseFormReturn<InviteForm> }) => {
    return (
        <Form {...form}>
            <div className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="PleaseInviteMe" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </Form>
    );
};

export default GroupInviteDialog;
