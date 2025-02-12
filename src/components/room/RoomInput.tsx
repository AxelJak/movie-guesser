import { useZero } from "@/hooks/use-zero";
import { useEffect, useState } from "react";
import { useQuery } from "@rocicorp/zero/react";
import { createMessage } from "@/utils/message";
import { createGuess } from "@/utils/guess";
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Movie } from "@/schema";

export type AutocompleteOption = {
  value: string
  label: string
}
export default function RoomInput({ listId, roomId, playerId }: { listId: string, roomId: string, playerId: string }) {
  const z = useZero();
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [message, setMessage] = useState('');
  const [guess, setGuess] = useState('');
  const listQuery = z.query.list.related('movies').where('id', listId)
  const [list] = useQuery(listQuery.one());
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])

  useEffect(() => {
    if (!list) return;
    setMovies([...list.movies])
  }, [list])

  function sendMessage() {
    if (!message) return;
    z.mutate.message.insert(
      createMessage(message, playerId, roomId)
    );
  }

  function sendGuess() {
    if (!guess) return;
    z.mutate.guess.insert(
      createGuess(guess, playerId, roomId)
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)
    setOpen(inputValue.length > 0)

    const filtered = movies.filter((movie) => movie.title.toLowerCase().includes(inputValue.toLowerCase()))
    setFilteredMovies(filtered)
  }

  const handleSelect = (selectedValue: string) => {
    console.log(selectedValue);
    sendGuess()
    setValue("")
    setOpen(false);    
  }

  function handleKeyDownEvent(event: any) {
    if (event.key === 'Enter') {
      handleSelect(filteredMovies[0].title);
    }
  }

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={""}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDownEvent}
        className=""
      />
      {open && (
        <div className="absolute w-full mt-1 bg-background border rounded-md shadow-md z-10">
          <Command>
            <CommandList>
              <CommandEmpty>{"No movies in list"}</CommandEmpty>
              <CommandGroup>
                {filteredMovies.map((movie) => (
                  <CommandItem key={movie.id} value={movie.title} onSelect={handleSelect}>
                    {movie.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}

