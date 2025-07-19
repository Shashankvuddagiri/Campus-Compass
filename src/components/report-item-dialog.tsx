'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { reportItemAction, type ReportItemFormState } from '@/app/actions';
import type { Item, ItemCategory } from '@/lib/types';

interface ReportItemDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onReportSuccess: (newItem: Item) => void;
}

const formSchema = z.object({
    name: z.string().min(3, { message: 'Item name must be at least 3 characters.' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
    category: z.enum(['Electronics', 'Books', 'Clothing', 'ID Cards', 'Other'], { required_error: 'Please select a category.'}),
    status: z.enum(['Lost', 'Found'], { required_error: 'Please specify if the item is lost or found.' }),
    location: z.string().min(3, { message: 'Location must be at least 3 characters.' }),
    contact: z.string().email({ message: 'Please enter a valid email address.' }),
});

type FormValues = z.infer<typeof formSchema>;

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {pending ? 'Submitting...' : 'Submit Report'}
      </Button>
    );
  }

export function ReportItemDialog({ isOpen, setIsOpen, onReportSuccess }: ReportItemDialogProps) {
  const { toast } = useToast();
  const initialState: ReportItemFormState = { message: null, errors: {} };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        description: '',
        location: '',
        contact: '',
    },
  });

  const [state, dispatch] = useActionState(reportItemAction, initialState);

  useEffect(() => {
    if (state.message && !state.errors) {
        toast({
            title: "Success!",
            description: state.message,
        });
        if(state.newItem) {
            onReportSuccess(state.newItem);
        }
        form.reset();
    } else if (state.message && state.errors) {
        toast({
            title: "Error",
            description: state.message,
            variant: "destructive",
        })
    }
  }, [state, onReportSuccess, toast, form]);

  const categories: ItemCategory[] = ['Electronics', 'Books', 'Clothing', 'ID Cards', 'Other'];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report an Item</DialogTitle>
          <DialogDescription>
            Fill out the form below to report a lost or found item.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form action={dispatch} className="space-y-4">
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Is the item...*</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                            >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="Lost" />
                                </FormControl>
                                <FormLabel className="font-normal">Lost</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="Found" />
                                </FormControl>
                                <FormLabel className="font-normal">Found</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Name*</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Black iPhone 14" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description*</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Provide details like color, brand, and any identifying marks." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Known Location*</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Library, 3rd floor" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Contact Email*</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="your.email@university.edu" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <SubmitButton />
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
