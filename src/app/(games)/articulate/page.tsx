'use client';

import { adaptArticulateClues } from '@/ai/flows/adapt-articulate-clues';
import { Loader2, MicVocal, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ArticulatePage() {
  const { toast } = useToast();
  const [word, setWord] = useState('Metabolism');
  const [contextText, setContextText] = useState(
    'In biology, metabolism is the set of life-sustaining chemical reactions in organisms. The three main purposes of metabolism are: the conversion of the energy in food to energy available to run cellular processes; the conversion of food to building blocks for proteins, lipids, nucleic acids, and some carbohydrates; and the elimination of metabolic wastes.'
  );
  const [clues, setClues] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for settings in localStorage to prevent crashes on direct navigation
    const settings = localStorage.getItem('linguaGeniusSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      if (parsedSettings.documentText) {
        setContextText(parsedSettings.documentText);
      } else if (parsedSettings.context) {
        // You could fetch context-specific text here if needed
      }
    }
  }, []);

  const handleGenerateClues = async () => {
    if (!word || !contextText) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide both a word and a context.',
      });
      return;
    }
    setLoading(true);
    setClues([]);
    try {
      const result = await adaptArticulateClues({ word, contextText });
      if (result?.clues) {
        setClues(result.clues);
        toast({
          title: 'Clues Generated!',
          description: `Here are some clues for "${word}".`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'Could not generate clues. Please check the console for details.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Articulate"
        description="Generate tailored clues for a word based on a specific context."
        icon={MicVocal}
      />
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Clue Generator</CardTitle>
            <CardDescription>
              Enter a word and a text to generate contextual clues. The AI will
              read the text to understand the context.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateClues();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="word">Word to Describe</Label>
                <Input
                  id="word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="e.g., Photosynthesis"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="context-text">Context Text</Label>
                <Textarea
                  id="context-text"
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  placeholder="Paste your text here..."
                  rows={6}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Clues
              </Button>
            </form>
          </CardContent>
        </Card>

        {clues.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Clues for "{word}"</CardTitle>
              <CardDescription>
                Use these to help someone guess the word!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {clues.map((clue, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-md bg-muted p-3"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="flex-1">{clue}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
