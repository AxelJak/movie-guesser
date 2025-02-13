import { useZero } from "@/hooks/use-zero";
import { useEffect, useState } from "react";
import { useQuery } from "@rocicorp/zero/react";
import { createMessage } from "@/utils/message";
import { createGuess } from "@/utils/guess";
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Movie } from "@/schema";
import { motion, AnimatePresence } from "motion/react";

export type AutocompleteOption = {
  value: string
  label: string
}
export default function RoomInput({ listId, roomId, playerId }: { listId: string, roomId: string, playerId: string }) {
  const z = useZero();
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [chat, setChat] = useState(false);
  const listQuery = z.query.list.related('movies').where('id', listId)
  const [list] = useQuery(listQuery.one());
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])

  useEffect(() => {
    if (!list) return;
    setMovies([...list.movies])
  }, [list])

  function sendMessage() {
    z.mutate.message.insert(
      createMessage(value, playerId, roomId)
    );
  }

  function sendGuess() {
    z.mutate.guess.insert(
      createGuess(value, playerId, roomId)
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)
    if(!chat) return;
    setOpen(inputValue.length > 0)
    const filtered = movies.filter((movie) => movie.title.toLowerCase().includes(inputValue.toLowerCase()))
    setFilteredMovies(filtered)
  }

  const handleSelect = () => {
    if (!value) return;
    if (chat) {
      sendMessage()
    } else {
      sendGuess()
      setOpen(false);    
    }
    setValue("")
  }

  function handleKeyDownEvent(event: any) {
    if (event.key === 'Enter') {
      if(!chat) {
        setValue(filteredMovies[0].title);
      }
      handleSelect();
    }
    if (event.ctrlKey && event.key === 's'){
      setChat(!chat);
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        { chat ? 
          <motion.label 
            key="message"
            className="text-xs bg-green-200 p-1 rounded-t-sm"
            initial={{ opacity: 0.5, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.5, scale: 0.5 }}
          >
            Message
          </motion.label> :
          <motion.label
            key="guess"
            className="text-xs bg-blue-400 p-1 rounded-t-sm"
            initial={{ opacity: 0.5, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.5, scale: 0.5 }}
          >
            Guess movie
          </motion.label>
        }
      </AnimatePresence>
      <Input
        type="text"
        className={chat ? "border-green-200 rounded-tl-none" : "border-blue-400 rounded-tl-none"} 
        placeholder={""}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDownEvent}
      />
      {open && !chat && (
        <div className="absolute w-full mt-1 bg-background border rounded-md shadow-md z-10">
          <Command>
            <CommandList>
              <CommandEmpty>{"No results found"}</CommandEmpty>
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

