
const defaultRounds = 10;
const defaultTime = 60;
const defaultPlayers = 4;

export function createSetting(
  id: string,
  roomID: string,
  rounds: number = defaultRounds,
  time: number = defaultTime,
  players: number = defaultPlayers
) {
  return {
    id: id,
    roomID,
    rounds,
    time,
    players,
  };
}
