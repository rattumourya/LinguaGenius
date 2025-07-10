'use client';

import { generateRolePlayScenarios } from '@/ai/flows/generate-role-play-scenarios';
import { Loader2, Sparkles, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function RolePlayPage() {
  const { toast } = useToast();
  const [context, setContext] = useState('Job interview');
  const [goal, setGoal] = useState('Practice answering behavioral questions');
  const [level, setLevel] = useState('intermediate');
  const [scenarios, setScenarios] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateScenarios = async () => {
    setLoading(true);
    setScenarios([]);
    try {
      const result = await generateRolePlayScenarios({ context, goal, level });
      if (result?.scenarios) {
        setScenarios(result.scenarios);
        toast({
          title: 'Scenarios Generated!',
          description: 'Choose a scenario below to start practicing.',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'Could not generate scenarios. Please check the console.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Role-Play Mode"
        description="Simulate real-world conversations to practice your skills."
        icon={UsersRound}
      />
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Scenario Generator</CardTitle>
            <CardDescription>
              Define the situation you want to practice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateScenarios();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="context">Situation</Label>
                  <Input
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., Business negotiation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Your Level</Label>
                  <Select
                    value={level}
                    onValueChange={setLevel}
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Your Goal</Label>
                <Input
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Practice expressing opinions politely"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Scenarios
              </Button>
            </form>
          </CardContent>
        </Card>

        {scenarios.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Custom Scenarios</CardTitle>
              <CardDescription>
                Click on a scenario to see the details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {scenarios.map((scenario, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>Scenario {index + 1}</AccordionTrigger>
                    <AccordionContent className="prose max-w-none text-base">
                      {scenario.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
