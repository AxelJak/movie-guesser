import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { Movie } from "@/schema";

export default function MovieCard({movie}: { movie: Movie,}) {

  return (
    <Card className="w-[350px] rounded-lg">
      <CardContent className="p-0">
        <img className="rounded-t-lg" src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} alt={movie.title} />
      </CardContent>
      <CardFooter className="flex flex-col justify-between">
        <CardTitle className="text-xl">{movie.title}</CardTitle>
      </CardFooter>
    </Card>
  );
}