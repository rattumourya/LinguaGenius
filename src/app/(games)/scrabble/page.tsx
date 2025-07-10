'use client';

import { validateScrabbleWord } from '@/ai/flows/validate-scrabble-word';
import { AppWindow, CheckCircle, Gamepad2, Loader2, Send } from 'lucide-react';
import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ScrabblePage() {
  const { toast } = useToast();
  const [word, setWord] = useState('');
  const [sentence, setSentence] = useState('');
  const [tiles, setTiles] = useState(['A', 'I', 'L', 'N', 'G', 'U', 'S']);
  const [loading, setLoading] = useState(false);
  const [wordSubmitted, setWordSubmitted] = useState(false);

  const handleWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word) {
      toast({
        variant: 'destructive',
        title: 'No word entered',
        description: 'Please form a word with your tiles.',
      });
      return;
    }
    setWordSubmitted(true);
    toast({
      title: `Word Entered: "${word}"`,
      description: `Now use it in a sentence to test its grammar.`,
    });
  };

  const handleCheck = async () => {
    if (!word || !sentence) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please provide both a word and a sentence.',
      });
      return;
    }
    setLoading(true);
    try {
      const result = await validateScrabbleWord({
        word,
        tiles,
        sentence,
      });

      if (!result.isValidWord || !result.canBeMadeFromTiles) {
         toast({
          variant: 'destructive',
          title: 'Invalid Word',
          description: result.feedback,
        });
      } else if (!result.isGrammaticallyCorrect) {
         toast({
          variant: 'destructive',
          title: 'Grammar Issue',
          description: result.feedback,
        });
      } else {
        toast({
          title: 'Success!',
          description: result.feedback,
          action: <CheckCircle className="text-green-500" />,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not validate your word. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Scrabble / Grammar Detective"
        description="Build words, score points, and ensure your grammar is flawless."
        icon={AppWindow}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 /> Game Board
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="relative aspect-square w-full rounded-lg bg-blue-100 p-4"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(https://placehold.co/600x600.png)',
                  backgroundSize: 'cover',
                }}
                data-ai-hint="scrabble board game"
              >
                <div className="flex h-full w-full items-center justify-center">
                  <p className="rounded-md bg-background/80 p-4 text-center text-lg font-semibold text-foreground">
                    Scrabble Board Placeholder
                    <br />
                    <span className="text-sm font-normal text-muted-foreground">
                      Drag and drop tiles to form words here.
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Tiles</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center gap-2">
              {tiles.map((tile, index) => (
                <div
                  key={index}
                  className="flex h-12 w-12 items-center justify-center rounded-md bg-yellow-200 text-2xl font-bold text-yellow-900 shadow-md"
                >
                  {tile}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Play Your Word</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWordSubmit} className="space-y-4">
                <Label htmlFor="word-input">Form a word</Label>
                <div className="flex gap-2">
                  <Input
                    id="word-input"
                    placeholder="e.g., LINGUA"
                    value={word}
                    onChange={(e) => setWord(e.target.value.toUpperCase())}
                    disabled={wordSubmitted}
                  />
                  <Button type="submit" size="icon" disabled={wordSubmitted}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {wordSubmitted && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Grammar Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="sentence-input">
                  Use "{word || 'your word'}" in a sentence
                </Label>
                <Textarea
                  id="sentence-input"
                  placeholder="Write your sentence here..."
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                  disabled={loading}
                />
                <Button onClick={handleCheck} className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Check Word & Grammar
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </>
  );
}
