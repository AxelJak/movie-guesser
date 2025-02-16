
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function NumberInput( {min, max }: { min: number, max: number }) {
  const [number, setNumber] = useState(0);

  if (number < min) setNumber(min);
  if (number > max) setNumber(max);

return (
  <div className="flex justify-center gap-2">
    <Button className="rounded-full p-2" onClick={() => setNumber(number - 1)}><Minus /></Button>
    <span className="mt-1">{number}</span>
    <Button className="rounded-full p-2" onClick={() => setNumber(number + 1)}><Plus /></Button>
  </div> 
)}