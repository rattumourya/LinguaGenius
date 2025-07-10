import { type LucideIcon } from 'lucide-react';

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline md:text-4xl">
            {title}
          </h1>
          <p className="mt-1 text-lg text-foreground/70">{description}</p>
        </div>
      </div>
    </div>
  );
}
