
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  heading,
  subheading,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {subheading && (
          <p className="text-muted-foreground">{subheading}</p>
        )}
      </div>
      {children}
    </div>
  );
}
