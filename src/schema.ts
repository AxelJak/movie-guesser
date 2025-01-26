// These data structures define your client-side schema.
// They must be equal to or a subset of the server-side schema.
// Note the "relationships" field, which defines first-class
// relationships between tables.
// See https://github.com/rocicorp/mono/blob/main/apps/zbugs/src/domain/schema.ts
// for more complex examples, including many-to-many.

import {
  createSchema,
  createTableSchema,
  definePermissions,
  Row,
  NOBODY_CAN,
  ANYONE_CAN,
} from "@rocicorp/zero";

const playerSchema = createTableSchema({
  tableName: "player",
  columns: {
    id: "string",
    name: "string",
    score: "number",
    roomID: "string",
    isHost: "boolean",
  },
  primaryKey: "id",
});


const roomSchema = createTableSchema({
  tableName: "room",
  columns: {
    id: "string",
    room_key: "string",
  },
  primaryKey: "id",
});

const roundSchema = createTableSchema({
  tableName: "round",
  columns: {
    id: "string",
    round: "number",
    playerID: "string",
    roomID: "string",
    timestamp: "number",
    movie: "string",
  },
  primaryKey: "id",
  relationships: {
    player: {
      sourceField: "playerID",
      destSchema: playerSchema,
      destField: "id",
    },
    room: {
      sourceField: "roomID",
      destSchema: roomSchema,
      destField: "id",
    },
  },
})

const settingsSchema = createTableSchema({
  tableName: "settings",
  columns: {
    id: "string",
    rounds: "number",
    time: "number",
    players: "number",
    roomID: "string",
  },
  primaryKey: "id",
  relationships: {
    room: {
      sourceField: "roomID",
      destSchema: roomSchema,
      destField: "id",
    },
  },
});

const guessSchema = createTableSchema({
  tableName: "guess",
  columns: {
    id: "string",
    senderID: "string",
    roomID: "string",
    guess: "string",
    timestamp: "number",
  },
  primaryKey: "id",
  relationships: {
    sender: {
      sourceField: "senderID",
      destSchema: playerSchema,
      destField: "id",
    },
    room: {
      sourceField: "roomID",
      destSchema: roomSchema,
      destField: "id",
    },
  },
});

const gameStateSchema = createTableSchema({
  tableName: "game_state",
  columns: {
    id: "string",
    roomID: "string",
    currentRound: "number",
    currentPlayerExplaining: "string",
    gameStatus: "string",
    startedAt: "number",
    endedAt: "number",
  },
  primaryKey: "id",
  relationships: {
    room: {
      sourceField: "roomID",
      destSchema: roomSchema,
      destField: "id",
    },
    currentPlayerExplaining: {
      sourceField: "currentPlayerExplaining",
      destSchema: playerSchema,
      destField: "id",
    }
  },
});

const movieSchema = createTableSchema({
  tableName: "movie",
  columns: {
    id: "string",
    title: "string",
    overview: "string",
    poster_path: "string",
    backdrop_path: "string",
    release_date: "string",
    vote_average: "number",
    vote_count: "number",
  },
  primaryKey: "id",
});

const listSchema = createTableSchema({
  tableName: "list",
  columns: {
    id: "string",
    name: "string",
  },
  primaryKey: "id",
});

const movieListSchema = createTableSchema({
  tableName: "movie_list",
  columns: {
    movie_id: "string",
    list_id: "string",
  },
  primaryKey: ["movie_id", "list_id"],
  relationships: {
    movie: {
      sourceField: "movie_id",
      destSchema: movieSchema,
      destField: "id",
    },
    list: {
      sourceField: "list_id",
      destSchema: listSchema,
      destField: "id",
    },
  },
});


export const schema = createSchema({
  version: 1,
  tables: {
    player: playerSchema,
    room: roomSchema,
    settings: settingsSchema,
    guess: guessSchema,
    round: roundSchema,
    movie: movieSchema,
    list: listSchema,
    movie_list: movieListSchema,
    game_state: gameStateSchema,
  },
});

export type Schema = typeof schema;
export type Player = Row<typeof playerSchema>;
export type Settings = Row<typeof settingsSchema>;
export type Room = Row<typeof roomSchema>;
export type Round = Row<typeof roundSchema>;
export type Guess = Row<typeof guessSchema>;
export type Movie = Row<typeof movieSchema>;
export type List = Row<typeof listSchema>;
export type MovieList = Row<typeof movieListSchema>;
export type GameState = Row<typeof gameStateSchema>;

// The contents of your decoded JWT.
type AuthData = {
  sub: string | null;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {

  // const allowIfMessageSender = (
  //   authData: AuthData,
  //   { cmp }: ExpressionBuilder<typeof messageSchema>
  // ) => cmp("senderID", "=", authData.sub ?? "");

  return {
    player: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    round: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    settings: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: ANYONE_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    room: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    guess: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    gameState: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: ANYONE_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    movie: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: ANYONE_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    list: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: ANYONE_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    movieList: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: ANYONE_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
  };
});
