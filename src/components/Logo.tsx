import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-lg font-bold text-primary font-headline',
        className
      )}
    >
      <BrainCircuit className="h-6 w-6" />
      <span>LinguaGenius</span>
    </div>
  );
}
