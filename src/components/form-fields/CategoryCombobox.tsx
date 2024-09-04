'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

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
import { api } from '@/trpc/react';

import { ScrollArea } from '../ui/scroll-area';

interface Props {
  spaceId: string;
  value?: number; // category id
  onChange?: (val?: number) => void;
}

export function CategoryCombobox({ spaceId, value, onChange }: Props) {
  const { data: categories, isPending } = api.category.fetch.useQuery(spaceId);
  const initCategory = categories?.find(category => category.id === value);

  const [categoryName, setCategoryName] = useState(initCategory?.name ?? '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (onChange !== undefined) {
      const categoryInfo = categories?.find(
        category => categoryName === category.name
      );
      onChange(categoryInfo?.id ?? undefined);
    }
  }, [categoryName, categories, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between overflow-x-hidden'
        >
          {categoryName ? categoryName : 'Select category...'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 p-0' avoidCollisions={false}>
        <Command>
          <CommandInput placeholder='Search framework...' />
          <CommandList>
            <ScrollArea>
              <CommandEmpty>
                {isPending ? 'Loading ...' : 'No category found'}
              </CommandEmpty>
              <CommandGroup>
                {categories?.map(category => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={currentValue => {
                      setCategoryName(
                        currentValue === categoryName ? '' : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <div className='flex items-center gap-2 overflow-hidden'>
                      <Check
                        className={cn(
                          'h-4 w-4 shrink-0 text-primary',
                          categoryName === category.name
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
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
