
import React from "react";

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  heading,
  subheading,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-border animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary">{heading}</h1>
        {subheading && <p className="text-muted-foreground mt-1">{subheading}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
