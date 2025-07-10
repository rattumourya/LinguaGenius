'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z
  .object({
    role: z.string().min(1, 'Please select your role.'),
    level: z.string().min(1, 'Please select your English level.'),
    goal: z.string().min(3, 'Goal must be at least 3 characters.').max(100),
    context: z.string().optional(),
    document: z.any().optional(),
  })
  .refine(
    (data) => {
      return !!data.context || (!!data.document && data.document.length > 0);
    },
    {
      message: 'Please either upload a document or choose a preset context.',
      path: ['context'],
    }
  );

export default function SetupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      level: '',
      goal: '',
      context: 'general',
      document: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let fileContent = '';
    if (values.document && values.document.length > 0) {
      try {
        fileContent = await values.document[0].text();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error reading file',
          description: 'Could not read the uploaded file. Please try again.',
        });
        return;
      }
    }

    localStorage.setItem(
      'linguaGeniusSettings',
      JSON.stringify({
        ...values,
        documentText: fileContent,
      })
    );

    toast({
      title: 'Profile Saved!',
      description: "We're personalizing your games. Let the learning begin!",
    });

    router.push('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <BrainCircuit className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          LinguaGenius
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/80">
          Welcome! Let's tailor your AI-powered English learning journey. Start
          by setting up your profile.
        </p>
      </div>

      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle>Create Your Learning Profile</CardTitle>
          <CardDescription>
            This helps us generate the perfect games for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Goal</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Prepare for TOEFL, enhance business vocabulary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="document"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <div className="flex items-center gap-4">
                      <FormLabel className="shrink-0">
                        Upload a Document (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".txt"
                          onChange={(e) => onChange(e.target.files)}
                          {...rest}
                          className="file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground hover:file:bg-primary/90"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Upload a .txt file (book, notes) to create games from.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-4">
                <hr className="w-full" />
                <span className="text-muted-foreground">OR</span>
                <hr className="w-full" />
              </div>
              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose a Preset Context</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a context" />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">
                          General English
                        </SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      We'll use this to source vocabulary and scenarios.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full">
                Start Learning
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
