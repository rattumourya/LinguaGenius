'use client';

import { generateGrammaticalErrors } from '@/ai/flows/generate-grammatical-errors';
import { Loader2, SearchCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function GrammarDetectivePage() {
  const { toast } = useToast();
  const [originalText, setOriginalText] = useState(
    'The quick brown fox jumps over the lazy dog. This sentence is famous because it contains all of the letters of the English alphabet.'
  );
  const [textWithErrors, setTextWithErrors] = useState('');
  const [errorCount, setErrorCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleGenerateErrors = async () => {
    if (!originalText) {
      toast({
        variant: 'destructive',
        title: 'Missing Text',
        description: 'Please provide some text to work with.',
      });
      return;
    }
    setLoading(true);
    setIsRevealed(false);
    setTextWithErrors('');

    try {
      const result = await generateGrammaticalErrors({
        text: originalText,
        errorCount,
      });
      if (result?.textWithErrors) {
        setTextWithErrors(result.textWithErrors);
        toast({
          title: 'Puzzle Generated!',
          description: `Can you spot the ${errorCount} errors?`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate the text with errors.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Grammar Detective"
        description="Find the grammatical errors hidden in the text."
        icon={SearchCheck}
      />
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Puzzle Generator</CardTitle>
            <CardDescription>
              Provide a correct text, and the AI will introduce errors for you
              to find.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateErrors();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="original-text">Your Correct Text</Label>
                <Textarea
                  id="original-text"
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  rows={5}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="error-count">
                  Number of Errors: {errorCount}
                </Label>
                <Slider
                  id="error-count"
                  value={[errorCount]}
                  onValueChange={(value) => setErrorCount(value[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Puzzle
              </Button>
            </form>
          </CardContent>
        </Card>

        {textWithErrors && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Find the Errors</CardTitle>
              <CardDescription>
                Read the text below carefully. There are {errorCount} mistakes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  readOnly
                  value={isRevealed ? originalText : textWithErrors}
                  className={`min-h-[150px] text-lg leading-relaxed ${
                    isRevealed ? 'bg-green-100' : ''
                  }`}
                />
                <Button
                  onClick={() => setIsRevealed(!isRevealed)}
                  variant="outline"
                  className="w-full"
                >
                  {isRevealed ? 'Hide Answers' : 'Reveal Answers'}
                </Button>
                {isRevealed && (
                  <Card className="bg-muted p-4">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-lg">Original Text</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        {textWithErrors}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
