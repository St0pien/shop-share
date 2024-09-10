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
  itemId: number;
  value?: number; // list id
  onChange?: (val?: number) => void;
}

export function ListCombobox({ spaceId, itemId, value, onChange }: Props) {
  const { data: lists, isPending } = api.list.fetchWithoutItem.useQuery({
    spaceId,
    itemId
  });
  const initList = lists?.find(list => list.id === value);

  const [listName, setlistName] = useState(initList?.name ?? '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (onChange !== undefined) {
      const listInfo = lists?.find(list => listName === list.name);
      onChange(listInfo?.id ?? undefined);
    }
  }, [listName, lists, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between overflow-x-hidden'
        >
          {listName ? listName : 'Select list...'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 p-0' avoidCollisions={false}>
        <Command>
          <CommandInput placeholder='Search list...' />
          <CommandList>
            <ScrollArea>
              <CommandEmpty>
                {isPending ? 'Loading ...' : 'No list found'}
              </CommandEmpty>
              <CommandGroup>
                {lists?.map(list => (
                  <CommandItem
                    key={list.id}
                    value={list.name}
                    onSelect={currentValue => {
                      setlistName(
                        currentValue === listName ? '' : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <div className='flex items-center gap-2 overflow-hidden'>
                      <Check
                        className={cn(
                          'h-4 w-4 shrink-0 text-primary',
                          listName === list.name ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <p>{list.name}</p>
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
