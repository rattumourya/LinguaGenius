
'use client';

import { validateScrabbleWord } from '@/ai/flows/validate-scrabble-word';
import type { ValidateScrabbleWordOutput } from '@/ai/schemas/scrabble-schema';
import {
  AppWindow,
  CheckCircle,
  Gamepad2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const VOWELS = 'AEIOU';
const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXYZ';

const boardLayout = [
  ['tw', '', '', 'dl', '', '', '', 'tw', '', '', '', 'dl', '', '', 'tw'],
  ['', 'dw', '', '', '', 'tl', '', '', '', 'tl', '', '', '', 'dw', ''],
  ['', '', 'dw', '', '', '', 'dl', '', 'dl', '', '', '', 'dw', '', ''],
  ['dl', '', '', 'dw', '', '', '', 'dl', '', '', '', 'dw', '', '', 'dl'],
  ['', '', '', '', 'dw', '', '', '', '', '', 'dw', '', '', '', ''],
  ['', 'tl', '', '', '', 'tl', '', '', '', 'tl', '', '', '', 'tl', ''],
  ['', '', 'dl', '', '', '', 'dl', '', 'dl', '', '', '', 'dl', '', ''],
  ['tw', '', '', 'dl', '', '', '', 'star', '', '', '', 'dl', '', '', 'tw'],
  ['', '', 'dl', '', '', '', 'dl', '', 'dl', '', '', '', 'dl', '', ''],
  ['', 'tl', '', '', '', 'tl', '', '', '', 'tl', '', '', '', 'tl', ''],
  ['', '', '', '', 'dw', '', '', '', '', '', 'dw', '', '', '', ''],
  ['dl', '', '', 'dw', '', '', '', 'dl', '', '', '', 'dw', '', '', 'dl'],
  ['', '', 'dw', '', '', '', 'dl', '', 'dl', '', '', '', 'dw', '', ''],
  ['', 'dw', '', '', '', 'tl', '', '', '', 'tl', '', '', '', 'dw', ''],
  ['tw', '', '', 'dl', '', '', '', 'tw', '', '', '', 'dl', '', '', 'tw'],
];

const tileClasses: { [key: string]: string } = {
  tw: 'bg-red-500 text-white',
  dw: 'bg-pink-300 text-pink-800',
  tl: 'bg-blue-500 text-white',
  dl: 'bg-blue-200 text-blue-800',
  star: 'bg-pink-300 text-pink-800',
  default: 'bg-green-100 border-green-200',
};

const tileLabels: { [key: string]: string } = {
  tw: 'TRIPLE WORD',
  dw: 'DOUBLE WORD',
  tl: 'TRIPLE LETTER',
  dl: 'DOUBLE LETTER',
  star: '★',
};

function generateTiles(count: number): string[] {
  const newTiles: string[] = [];
  // Ensure at least 2 vowels
  for (let i = 0; i < 2; i++) {
    newTiles.push(VOWELS[Math.floor(Math.random() * VOWELS.length)]);
  }
  // Ensure at least 2 consonants
  for (let i = 0; i < 2; i++) {
    newTiles.push(CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)]);
  }
  // Fill the rest randomly
  const allLetters = VOWELS + CONSONANTS;
  for (let i = 4; i < count; i++) {
    newTiles.push(allLetters[Math.floor(Math.random() * allLetters.length)]);
  }
  return newTiles.sort(() => Math.random() - 0.5);
}

export default function ScrabblePage() {
  const { toast } = useToast();
  const [word, setWord] = useState('');
  const [sentence, setSentence] = useState('');
  const [tiles, setTiles] = useState<string[]>(() => generateTiles(7));
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ValidateScrabbleWordOutput | null>(
    null
  );

  const handleNewGame = useCallback(() => {
    setWord('');
    setSentence('');
    setTiles(generateTiles(7));
    setLastResult(null);
    toast({
      title: 'New Game Started!',
      description: 'You have a fresh set of tiles.',
    });
  }, [toast]);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !sentence) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please provide both a word and a sentence.',
      });
      return;
    }
    setLoading(true);
    setLastResult(null);
    try {
      const result = await validateScrabbleWord({
        word,
        tiles,
        sentence,
      });
      setLastResult(result);

      if (
        !result.isValidWord ||
        !result.canBeMadeFromTiles ||
        !result.isGrammaticallyCorrect
      ) {
        toast({
          variant: 'destructive',
          title: 'Validation Failed',
          description: result.feedback,
        });
      } else {
        toast({
          title: `Success! You scored ${result.score} points!`,
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
        title="Scrabble"
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
              <div className="mx-auto aspect-square w-full max-w-xl rounded-lg bg-green-800 p-2 shadow-inner">
                 <div className="grid grid-cols-15 gap-0.5">
                  {boardLayout.flat().map((type, index) => (
                    <div
                      key={index}
                      className={cn(
                        'aspect-square flex items-center justify-center rounded-sm text-[6px] font-bold text-center leading-none',
                        tileClasses[type || 'default']
                      )}
                    >
                      {tileLabels[type]}
                    </div>
                  ))}
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
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleNewGame}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                New Tiles / Reset
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Play Your Word</CardTitle>
              <CardDescription>
                Form a word with your tiles, then use it in a sentence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheck} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="word-input">Word</Label>
                  <Input
                    id="word-input"
                    placeholder="e.g., LINGUA"
                    value={word}
                    onChange={(e) => setWord(e.target.value.toUpperCase())}
                    disabled={loading}
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
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
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Check Word & Grammar
                </Button>
              </form>
            </CardContent>
          </Card>

          {lastResult && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Last Play Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Word:</strong> {word}
                </p>
                <p>
                  <strong>Score:</strong> {lastResult.score}
                </p>
                <p>
                  <strong>Feedback:</strong> {lastResult.feedback}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
