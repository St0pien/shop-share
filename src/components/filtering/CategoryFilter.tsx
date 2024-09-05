'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { type CategoryInfo } from '@/lib/types';

import { ScrollArea } from '../ui/scroll-area';

interface Props {
  categories?: CategoryInfo[];
  selected: number[];
  onSelect?: (val: CategoryInfo) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between overflow-x-hidden'
        >
          Add Filter...
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 p-0' avoidCollisions={false}>
        <Command>
          <CommandInput placeholder='Search category...' />
          <CommandList>
            <ScrollArea>
              <CommandEmpty>
                {!categories ? 'Loading ...' : 'No category found'}
              </CommandEmpty>
              <CommandGroup>
                {categories?.map(category => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      if (onSelect !== undefined) {
                        onSelect(category);
                        setOpen(false);
                      }
                    }}
                  >
                    <div className='flex items-center gap-2 overflow-hidden'>
                      <Check
                        className={cn(
                          'h-4 w-4 shrink-0 text-primary',
                          selected.find(id => id === category.id)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <p className='text-sm text-neutral-light'>
                        {category.itemsQuantity}
                      </p>
                      <p>{category.name}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
