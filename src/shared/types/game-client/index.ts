export interface PlayerList {
  championName: string
  isBot: boolean
  isDead: boolean
  items: Item[]
  level: number
  position: string
  rawChampionName: string
  respawnTimer: number
  riotId: string
  riotIdGameName: string
  riotIdTagLine: string
  runes: Runes
  scores: Scores
  skinID: number
  summonerName: string
  summonerSpells: SummonerSpells
  team: string
}

interface SummonerSpells {
  summonerSpellOne: SummonerSpellOne
  summonerSpellTwo: SummonerSpellOne
}

interface SummonerSpellOne {
  displayName: string
  rawDescription: string
  rawDisplayName: string
}

interface Scores {
  assists: number
  creepScore: number
  deaths: number
  kills: number
  wardScore: number
}

interface Runes {
  keystone: Keystone
  primaryRuneTree: Keystone
  secondaryRuneTree: Keystone
}

interface Keystone {
  displayName: string
  id: number
  rawDescription: string
  rawDisplayName: string
}

interface Item {
  canUse: boolean
  consumable: boolean
  count: number
  displayName: string
  itemID: number
  price: number
  rawDescription: string
  rawDisplayName: string
  slot: number
}

export interface GameStats {
  gameMode: string
  gameTime: number // in seconds (float)
  mapName: string // e.g. 'Map11
  mapNumber: number
  mapTerrain: number
}

// AllGameData 接口 - 包含完整的游戏数据，包括玩家坐标
export interface AllGameData {
  activePlayer: ActivePlayer
  allPlayers: AllPlayerData[]
  events: Events
  gameData: GameStats
}

export interface ActivePlayer {
  abilities: any
  championStats: any
  currentGold: number
  fullRunes: any
  level: number
  summonerName: string
  teamRelativeColors: boolean
}

export interface AllPlayerData {
  championName: string
  isBot: boolean
  isDead: boolean
  items: Item[]
  level: number
  position: Position  // 这是包含x,y坐标的对象
  rawChampionName: string
  respawnTimer: number
  riotId: string
  riotIdGameName: string
  riotIdTagLine: string
  runes: Runes
  scores: Scores
  skinID: number
  summonerName: string
  summonerSpells: SummonerSpells
  team: string
}

export interface Position {
  x: number
  y: number
}

export interface Events {
  Events: GameEvent[]
}

export interface GameEvent {
  EventID: number
  EventName: string
  EventTime: number
  [key: string]: any
}
