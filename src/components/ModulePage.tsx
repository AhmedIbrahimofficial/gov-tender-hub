import { ReactNode } from "react";
import { AppShell, PageHeader, Card, CardHeader, Badge } from "@/components/AppShell";

export function ModulePage({
  title,
  description,
  phase,
  children,
}: {
  title: string;
  description: string;
  phase?: string;
  children?: ReactNode;
}) {
  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <div className="mb-4 flex items-center gap-2">
          {phase && <Badge tone="blue">{phase}</Badge>}
          <Badge tone="muted">Government of Zimbabwe</Badge>
        </div>
        <PageHeader title={title} description={description} />
        {children}
      </div>
    </AppShell>
  );
}

export function FeatureGrid({ features }: { features: { title: string; desc: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {features.map((f) => (
        <Card key={f.title} className="p-4 hover:border-primary/40 transition-colors">
          <div className="text-sm font-semibold text-foreground">{f.title}</div>
          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</div>
        </Card>
      ))}
    </div>
  );
}

export { Card, CardHeader, Badge };
