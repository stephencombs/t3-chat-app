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
import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/Button';
import { api } from '~/utils/api';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/Form';
import { Input } from './ui/Input';

const groupFormSchema = z.object({
    name: z.string(),
    description: z.string().max(30)
});

type GroupForm = z.infer<typeof groupFormSchema>;

const NewGroupDialog = () => {
    const { mutate: createGroup } = api.group.create.useMutation();
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<GroupForm>({
        resolver: zodResolver(groupFormSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    });

    const handleCreateGroup = (values: GroupForm) => {
        createGroup(values);
        setDialogOpen(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="m-2" variant="outline">
                    <PlusIcon className="mr-2 h-6 w-6" />
                    New Group
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Customize Your Group</DialogTitle>
                    <DialogDescription>Enter the details for your new group</DialogDescription>
                </DialogHeader>
                <GroupFormComponent form={form} />
                <DialogFooter>
                    <Button onClick={form.handleSubmit(handleCreateGroup)}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const GroupFormComponent = ({ form }: { form: UseFormReturn<GroupForm> }) => {
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
                                <Input placeholder="My Group" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="This is the best group!" {...field} />
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

export default NewGroupDialog;
