'use client';

import {
  AppWindow,
  LayoutGrid,
  MessageSquareQuote,
  MicVocal,
  SearchCheck,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const games = [
  {
    title: 'Scrabble',
    description: 'Build words and test your vocabulary in context.',
    href: '/scrabble',
    icon: AppWindow,
  },
  {
    title: 'Balderdash',
    description: 'Bluff your way through definitions of rare words.',
    href: '/balderdash',
    icon: MessageSquareQuote,
  },
  {
    title: 'Articulate',
    description: 'Describe words against the clock with tailored clues.',
    href: '/articulate',
    icon: MicVocal,
  },
  {
    title: 'Role-Play',
    description: 'Practice real-world conversations and scenarios.',
    href: '/role-play',
    icon: UsersRound,
  },
  {
    title: 'Grammar Detective',
    description: 'Find and correct grammatical errors in texts.',
    href: '/grammar-detective',
    icon: SearchCheck,
  },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Game Dashboard"
        description="Choose a game to start your personalized learning session."
        icon={LayoutGrid}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Card
            key={game.title}
            className="flex flex-col justify-between shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
          >
            <CardHeader className="flex-row items-start gap-4 space-y-0">
              <div className="rounded-md bg-primary/10 p-3 text-primary">
                <game.icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </div>
            </CardHeader>
            <CardFooter>
              <Link href={game.href} className="w-full" passHref>
                <Button className="w-full" variant="outline">
                  Play Now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
