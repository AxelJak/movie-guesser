import { 
  Card,
  CardContent,
  CardFooter,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Movie } from "@/schema";

export default function MovieCard({movies}: { movies: Movie[]}) {
  const [hide, setHide] = useState(false);

  function handleClick() {
    setHide(!hide);
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-5 ">
      {hide && movies.map((movie) => (
        <Card key={movie.id} className="w-[300px] rounded-lg hover:scale-105 transition-transform duration-300">
          <CardContent className="p-0">
            <img className="rounded-t-lg" src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} alt={movie.title} />
          </CardContent>
          <CardFooter className="flex flex-col justify-between">
            <CardTitle className="text-xl">{movie.title}</CardTitle>
          </CardFooter>
        </Card>
      ))}
      <Button className="absolute bottom-0 right-0" onClick={handleClick}>
        {hide ? "Show all" : "Hide"}
      </Button>
    </div>
  );
}