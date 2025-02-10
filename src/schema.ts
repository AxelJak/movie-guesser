import {
  boolean,
  createSchema,
  definePermissions,
  NOBODY_CAN,
  ANYONE_CAN,
  number,
  relationships,
  string,
  table,
  type Row,
} from '@rocicorp/zero';

// Table definitions
const player = table('player')
  .columns({
    id: string(),
    name: string(),
    score: number(),
    roomID: string().optional(),
    isHost: boolean(),
    created_at: number(),
  })
  .primaryKey('id');

const room = table('room')
  .columns({
    id: string(),
    room_key: string(),
    created_at: number(),
  })
  .primaryKey('id');

const round = table('round')
  .columns({
    id: string(),
    round: number(),
    playerID: string(),
    roomID: string(),
    timestamp: number(),
    movie: string(),
  })
  .primaryKey('id');

const settings = table('settings')
  .columns({
    id: string(),
    rounds: number(),
    time: number(),
    players: number(),
    roomID: string(),
    emoji_explain_limit: number(),
    hints: number(),
    listID: string(),
  })
  .primaryKey('id');

const guess = table('guess')
  .columns({
    id: string(),
    senderID: string(),
    roomID: string(),
    guess: string(),
    timestamp: number(),
  })
  .primaryKey('id');

const message = table('message')
  .columns({
    id: string(),
    senderID: string(),
    roomID: string(),
    message: string(),
    timestamp: number(),
  })
  .primaryKey('id');

const gameState = table('game_state')
  .columns({
    id: string(),
    roomID: string(),
    currentRound: number().from('current_round'),
    currentPlayerExplaining: string().optional().from('current_player_explaining'),
    gameStatus: string().from('game_status'),
    startedAt: number().optional().from('started_at'),
    endedAt: number().optional().from('ended_at'),
  })
  .primaryKey('id');

const movie = table('movie')
  .columns({
    id: string(),
    title: string(),
    overview: string(),
    poster_path: string(),
    backdrop_path: string(),
    release_date: string(),
    vote_average: number(),
    vote_count: number(),
  })
  .primaryKey('id');

const list = table('list')
  .columns({
    id: string(),
    name: string(),
    description: string(),
  })
  .primaryKey('id');

const movie_list = table('movie_list')
  .columns({
    movie_id: string(),
    list_id: string(),
  })
  .primaryKey('movie_id', 'list_id');

// Relationships
const playerRelationships = relationships(player, ({many}) => ({
  rounds: many({
    sourceField: ['id'],
    destField: ['playerID'],
    destSchema: round,
  }),
  guesses: many({
    sourceField: ['id'],
    destField: ['senderID'],
    destSchema: guess,
  }),
}));

const roomRelationships = relationships(room, ({many}) => ({
  players: many({
    sourceField: ['id'],
    destField: ['roomID'],
    destSchema: player,
  }),
  rounds: many({
    sourceField: ['id'],
    destField: ['roomID'],
    destSchema: round,
  }),
  settings: many({
    sourceField: ['id'],
    destField: ['roomID'],
    destSchema: settings,
  }),
  guesses: many({
    sourceField: ['id'],
    destField: ['roomID'],
    destSchema: guess,
  }),
  gameState: many({
    sourceField: ['id'],
    destField: ['roomID'],
    destSchema: gameState,
  }),
  messages: many({
    sourceField: ['id'],
    destField: ['roomID'],
    destSchema: message,
  }),
}));

const movieRelationships = relationships(movie, ({one}) => ({
  list: one(
    {
      sourceField: ['id'],
      destField: ['movie_id'],
      destSchema: movie_list,
    },
    { 
      sourceField: ['list_id'],
      destField: ['id'],
      destSchema: list,
    }
  ),
}));

const listRelationships = relationships(list, ({many}) => ({
  moives: many(
    {
      sourceField: ['id'],
      destField: ['list_id'],
      destSchema: movie_list,
    },
    { 
      sourceField: ['movie_id'],
      destField: ['id'],
      destSchema: movie,
    }
  ),
 }));

const settingsRelationships = relationships(settings, ({one}) => ({
  room: one({
    sourceField: ['roomID'],
    destField: ['id'],
    destSchema: room,
  }),
  list: one({
    sourceField: ['listID'],
    destField: ['id'],
    destSchema: list,
  }),
}));

const messageRelationships = relationships(message, ({one}) => ({
  sender: one({
    sourceField: ['senderID'],
    destField: ['id'],
    destSchema: player,
  }),
  room: one({
    sourceField: ['roomID'],
    destField: ['id'],
    destSchema: room,
  }),
}));

const roundRelationships = relationships(round, ({one}) => ({
  room: one({
    sourceField: ['roomID'],
    destField: ['id'],
    destSchema: room,
  }),
}));

const gameStateRelationships = relationships(gameState, ({one}) => ({
  room: one({
    sourceField: ['roomID'],
    destField: ['id'],
    destSchema: room,
  }),
  currentPlayerExplaining: one({
    sourceField: ['currentPlayerExplaining'],
    destField: ['id'],
    destSchema: player,
  }),
  currentRound: one({
    sourceField: ['currentRound'],
    destField: ['id'],
    destSchema: round,
  }),
}));

const guessRelationships = relationships(guess, ({many}) => ({
  sender: many({
    sourceField: ['senderID'],
    destField: ['id'],
    destSchema: player,
  }),
}));

/** The contents of the game JWT */
type AuthData = {
  sub: string | null;
  isHost?: boolean;
};

export const schema = createSchema(2, {
  tables: [
    player,
    room,
    settings,
    guess,
    round,
    movie,
    list,
    movie_list,
    gameState,
    message,
  ],
  relationships: [
    playerRelationships,
    roomRelationships,
    movieRelationships,
    guessRelationships,
    messageRelationships,
    roundRelationships,
    listRelationships,
    settingsRelationships,
    gameStateRelationships,
  ],
});

export type Schema = typeof schema;

export type Player = Row<typeof schema.tables.player>;
export type Room = Row<typeof schema.tables.room>;
export type Round = Row<typeof schema.tables.round>;
export type Movie = Row<typeof schema.tables.movie>;
export type List = Row<typeof schema.tables.list>;
export type MovieList = Row<typeof schema.tables.movie_list>;
export type GameState = Row<typeof schema.tables.game_state>;
export type Settings = Row<typeof schema.tables.settings>;
export type Guess = Row<typeof schema.tables.guess>;

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  
  return {
    player: {
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
          preMutation: ANYONE_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    settings: {
      row: {
        insert: ANYONE_CAN,
        update: ANYONE_CAN,
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
    round: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    game_state: {
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
    movie_list: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: ANYONE_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    message: {
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