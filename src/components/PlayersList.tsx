import { Player } from "../schema";
import crown from "@/assets/crown.svg";


export default function PlayersList({ roomPlayers }: { roomPlayers: readonly Player[] }) {
  return (
    <div className="flex flex-col grow w-48 gap-1 border-2 rounded-md p-4">
      <span className="text-xl font-bold">Players</span>
      {roomPlayers.map((player) =>
        <div key={player.id} className="flex justify-between">
          <span className="flex">
            {player.name}
            {player.isHost ? <img src={crown} alt="crown" className="w-6 h-6" /> : null}
          </span>
          <span>{player.score}</span>
        </div>
      )}
    </div>
  );
}