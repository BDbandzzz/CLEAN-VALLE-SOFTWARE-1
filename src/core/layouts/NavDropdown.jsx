import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';
import { cn } from '@/core/lib/utils';

export function NavDropdown({ item }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = item.children.some((child) =>
    location.pathname.startsWith(child.url)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={item.title}
          className={cn(
            'inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition md:size-12 lg:h-10 lg:w-auto lg:gap-2 lg:px-3',
            'text-muted-foreground hover:bg-emerald-100 hover:text-emerald-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isActive &&
              'bg-primary text-primary-foreground shadow-sm hover:bg-emerald-500 hover:text-primary-foreground'
          )}
        >
          <item.icon className="size-4 shrink-0" />
          <span className="hidden lg:inline">{item.title}</span>
          <ChevronDown className="hidden size-3.5 lg:inline" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-56">
        {item.children.map((child) => {
          const childIsActive = location.pathname.startsWith(child.url);

          return (
            <DropdownMenuItem
              key={child.url}
              onSelect={() => navigate(child.url)}
              className={cn(
                'font-medium text-muted-foreground hover:bg-emerald-100 hover:text-emerald-800 focus:bg-emerald-100 focus:text-emerald-800',
                childIsActive &&
                  'bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground'
              )}
            >
              <child.icon className="size-4" />
              <span>{child.title}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
