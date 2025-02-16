import { useZero } from "@/hooks/use-zero";
import { useEffect, useState, useRef, useCallback } from "react";
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

  const documentRef = useRef(document);

  const handleSelect = (submit: string) => {
    if (chat) {
      sendMessage(submit)
    } else {
      sendGuess(submit)
      setOpen(false);    
    }
    setValue("")
  }

  const handleKeyDownEvent = useCallback((event: any) => {
    if (event.key === 'Enter') {
      if (!chat) {
        if (filteredMovies.length === 0) return;
        handleSelect(filteredMovies[0].title);
      } else {
        handleSelect(value);
      }
    }
    if (event.ctrlKey && event.key === 's'){
      setChat(!chat);
    }
  }, [chat, setChat, filteredMovies, handleSelect])

  useEffect(() => {
    documentRef.current.addEventListener('keydown', handleKeyDownEvent);
    return () => {
      documentRef.current.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [chat, filteredMovies, setChat, handleKeyDownEvent]);
  

  useEffect(() => {
    if (!list) return;
    setMovies([...list.movies])
  }, [list])

  function sendMessage(message: string) {
    z.mutate.message.insert(
      createMessage(message, roomId, playerId)
    );
  }

  function sendGuess(guess: string) {
    z.mutate.guess.insert(
      createGuess(guess, roomId, playerId)
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)
    setOpen(inputValue.length > 0)
    const filtered = movies.filter((movie) => movie.title.toLowerCase().includes(inputValue.toLowerCase()))
    setFilteredMovies(filtered)
  }

  return (
    <div className="relative w-full">
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
        value={value}
        onChange={handleInputChange}
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

