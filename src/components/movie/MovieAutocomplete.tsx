import { useEffect, useState } from "react"
import { useZero } from "@/hooks/use-zero"
import { useQuery } from "@rocicorp/zero/react"
import type { Movie } from "@/schema"

import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function MovieAutocomplete({ listId, onSelect }: { listId: string, onSelect?: (movieId: string) => void }) {
  const z = useZero();
  const [open, setOpen] = useState(false);
  const [movies, setMovies] = useState<readonly Movie[]>([]);
  const listQuery = z.query.list.related('movies').where('id', listId).one();
  const [list] = useQuery(listQuery);
  useEffect(() => {
    if (list) {
      setMovies(list.movies);
    }
  }, [list]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          Make a guess
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command >
          <CommandInput placeholder="Search for movie" className="h-9" />
          <CommandList>
            <CommandEmpty>No list found.</CommandEmpty>
            <CommandGroup>
              {movies.map((movie) => (
                <CommandItem
                  key={movie.id}
                  value={movie.title}
                  onSelect={(currentValue) => {
                    onSelect && onSelect(currentValue);
                    setOpen(false);
                  }}
                >
                  {movie.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}