import { cn } from '@/core/lib/utils';

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-border bg-card py-5 text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-5',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      data-slot="card-title"
      className={cn('font-semibold text-lg leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
  );
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn('px-5', className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return (
    <div data-slot="card-footer" className={cn('flex items-center px-5 [.border-t]:pt-5', className)} {...props} />
  );
}


function CardBox({ className = "", title, value, children }) {
  return (
    <div
      className={`rounded-xl border border-border bg-background/80 p-4 ${className}`}
    >
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {title}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-foreground">
        {value || "—"}
      </p>

      {children}
    </div>
  );
}
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardBox };
