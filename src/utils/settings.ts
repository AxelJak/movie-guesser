import { Settings } from "../schema";

const defaultRounds = 10;
const defaultTime = 60;
const defaultPlayers = 4;

export function createSetting(
  id: string,
  roomID: string,
  rounds: number = defaultRounds,
  time: number = defaultTime,
  players: number = defaultPlayers,
  emojiExplainLimit: number = 4,
  hints: number = 3,
  listID: string = 'zny1ju25l6n',
): Settings {
  return {
    id: id,
    roomID,
    rounds,
    time,
    players,
    emoji_explain_limit: emojiExplainLimit,
    hints,
    listID,
  };
}
