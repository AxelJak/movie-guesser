import { 
  Card,
  CardContent,
  CardFooter,
  CardTitle
} from "@/components/ui/card";
import type { Movie } from "@/schema";

export default function MovieCard({movies}: { movies: Movie[]}) {

  return (
    <div className="absolute inset-22 flex items-center justify-center gap-5 ">
      {movies.map((movie) => (
        <Card key={movie.id} className="w-[300px] rounded-lg hover:scale-105 transition-transform duration-300">
          <CardContent className="p-0">
            <img className="rounded-t-lg" src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} alt={movie.title} />
          </CardContent>
          <CardFooter className="flex flex-col justify-between">
            <CardTitle className="text-xl">{movie.title}</CardTitle>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}