'use client';

import { generateBalderdashDefinitions } from '@/ai/flows/generate-balderdash-definitions';
import { Loader2, MessageSquareQuote, Sparkles } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Definition = {
  text: string;
  isReal: boolean;
};

export default function BalderdashPage() {
  const { toast } = useToast();
  const [word, setWord] = useState('Verisimilitude');
  const [context, setContext] = useState('Academic writing');
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shuffledDefinitions = useMemo(() => {
    if (!isMounted) return [];
    // This will only re-run when `definitions` change on the client
    return [...definitions].sort(() => Math.random() - 0.5);
  }, [definitions, isMounted]);

  const fetchDefinitions = async () => {
    if (!word) {
      toast({
        variant: 'destructive',
        title: 'Missing Word',
        description: 'Please enter a word to start the game.',
      });
      return;
    }
    setLoading(true);
    setSubmitted(false);
    setSelection(null);
    setDefinitions([]);

    try {
      const result = await generateBalderdashDefinitions({
        word,
        context,
        numFakeDefinitions: 3,
      });

      if (result) {
        const allDefinitions = [
          { text: result.realDefinition, isReal: true },
          ...result.fakeDefinitions.map((d) => ({ text: d, isReal: false })),
        ];
        setDefinitions(allDefinitions);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'Could not generate definitions. Please check the console.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefinitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    if (!selection) {
      toast({
        variant: 'destructive',
        title: 'No Selection',
        description: 'Please choose a definition.',
      });
      return;
    }
    setSubmitted(true);
    const chosenDef = definitions.find((d) => d.text === selection);
    if (chosenDef?.isReal) {
      toast({
        title: 'Correct!',
        description: `You found the real definition of "${word}"!`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Not quite!',
        description: 'That was a clever fake. Try again next time!',
      });
    }
  };

  const getCardClass = (def: Definition) => {
    if (!submitted)
      return 'bg-card hover:bg-muted cursor-pointer';
    if (def.isReal) return 'bg-green-200 border-green-400';
    if (def.text === selection && !def.isReal)
      return 'bg-red-200 border-red-400';
    return 'bg-card opacity-60';
  };

  return (
    <>
      <PageHeader
        title="Balderdash"
        description="Can you spot the real definition among the fakes?"
        icon={MessageSquareQuote}
      />
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchDefinitions();
              }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <div className="flex-1 space-y-2">
                <Label htmlFor="word">Word</Label>
                <Input
                  id="word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="e.g., Petrichor"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="context">Context</Label>
                <Input
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., Nature"
                />
              </div>
              <Button type="submit" className="mt-auto" disabled={loading}>
                <Sparkles className="mr-2 h-4 w-4" />
                New Game
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          definitions.length > 0 && isMounted && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Which is the correct definition for "{word}"?</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selection ?? ''}
                  onValueChange={setSelection}
                  className="space-y-4"
                  disabled={submitted}
                >
                  {shuffledDefinitions.map((def, index) => (
                    <Label
                      key={index}
                      htmlFor={`def-${index}`}
                      className={cn(
                        'block rounded-lg border p-4 transition-all',
                        getCardClass(def)
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <RadioGroupItem
                          value={def.text}
                          id={`def-${index}`}
                          className="mt-1"
                        />
                        <span className="flex-1">{def.text}</span>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
                <Button
                  onClick={handleSubmit}
                  disabled={submitted || !selection}
                  className="mt-6 w-full"
                  size="lg"
                >
                  Submit Answer
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </>
  );
}
