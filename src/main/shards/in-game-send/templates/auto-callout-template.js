// 自动报点模板 - 根据玩家实时位置自动生成报点消息
// 使用游戏客户端API获取玩家的实时坐标，并转换为易懂的位置描述

const TRANS = {
  'zh-CN': {
    unknownChampion: '未知英雄',
    noLiveData: '无法获取实时游戏数据，请确保在游戏中使用',
    playerDead: '(已阵亡)',
    atLocation: '{champion} 在 {location}',
    missing: '{champion} 消失（上次位置：{location}）',
    danger: '⚠️ {champion} 在 {location}',
    respawning: '{champion} 即将复活 ({time}秒)'
  },
  en: {
    unknownChampion: 'Unknown Champion',
    noLiveData: 'Cannot get live game data, please use in game',
    playerDead: '(Dead)',
    atLocation: '{champion} at {location}',
    missing: '{champion} missing (last seen: {location})',
    danger: '⚠️ {champion} at {location}',
    respawning: '{champion} respawning in {time}s'
  }
}

// 地图位置判断 (简化版，包含在模板中)
const MAP_LOCATIONS = {
  BARON: { xMin: 3500, xMax: 5500, yMin: 9500, yMax: 11500, name: { 'zh-CN': '大龙', en: 'Baron' } },
  DRAGON: { xMin: 8500, xMax: 10500, yMin: 3000, yMax: 5000, name: { 'zh-CN': '小龙', en: 'Dragon' } },
  BLUE_RED_BUFF: { xMin: 6000, xMax: 7500, yMin: 2500, yMax: 4000, name: { 'zh-CN': '我方红buff', en: 'Our Red' } },
  BLUE_BLUE_BUFF: { xMin: 2500, xMax: 4000, yMin: 10000, yMax: 11500, name: { 'zh-CN': '我方蓝buff', en: 'Our Blue' } },
  RED_RED_BUFF: { xMin: 7500, xMax: 9000, yMin: 11000, yMax: 12500, name: { 'zh-CN': '敌方红buff', en: 'Enemy Red' } },
  RED_BLUE_BUFF: { xMin: 11000, xMax: 12500, yMin: 3500, yMax: 5000, name: { 'zh-CN': '敌方蓝buff', en: 'Enemy Blue' } },
  BLUE_JUNGLE: { xMin: 2000, xMax: 7000, yMin: 4000, yMax: 10000, name: { 'zh-CN': '我方野区', en: 'Our Jungle' } },
  RED_JUNGLE: { xMin: 8000, xMax: 13000, yMin: 5000, yMax: 11000, name: { 'zh-CN': '敌方野区', en: 'Enemy Jungle' } },
  RIVER: { xMin: 5000, xMax: 9000, yMin: 5000, yMax: 9000, name: { 'zh-CN': '河道', en: 'River' } },
  TOP_LANE: { xMin: 0, xMax: 5000, yMin: 10000, yMax: 15000, name: { 'zh-CN': '上路', en: 'Top' } },
  MID_LANE: { xMin: 4000, xMax: 10000, yMin: 4000, yMax: 10000, name: { 'zh-CN': '中路', en: 'Mid' } },
  BOT_LANE: { xMin: 10000, xMax: 15000, yMin: 0, yMax: 5000, name: { 'zh-CN': '下路', en: 'Bot' } }
}

function getLocationByCoordinates(x, y, locale) {
  const priority = [
    'BARON', 'DRAGON',
    'BLUE_RED_BUFF', 'BLUE_BLUE_BUFF', 'RED_RED_BUFF', 'RED_BLUE_BUFF',
    'BLUE_JUNGLE', 'RED_JUNGLE', 'RIVER',
    'TOP_LANE', 'MID_LANE', 'BOT_LANE'
  ]
  
  for (const key of priority) {
    const loc = MAP_LOCATIONS[key]
    if (x >= loc.xMin && x <= loc.xMax && y >= loc.yMin && y <= loc.yMax) {
      return loc.name[locale] || loc.name['zh-CN']
    }
  }
  
  return locale === 'zh-CN' ? '未知位置' : 'Unknown'
}

function getMessages(env) {
  const trans = TRANS[env.locale]
  
  // 检查是否有实时游戏数据
  if (!env.liveGameData || !env.liveGameData.allPlayers) {
    return [trans.noLiveData]
  }
  
  const messages = []
  const liveData = env.liveGameData
  
  // 获取目标玩家
  env.targetMembers.forEach((puuid) => {
    // 获取英雄名称
    const selection = env.championSelections[puuid] || -1
    const championName = env.gameData.champions[selection]?.name || trans.unknownChampion
    
    // 从召唤师信息中获取游戏内名称
    let summonerDisplayName = ''
    let riotIdName = ''
    
    if (env.summoner && env.summoner[puuid] && env.summoner[puuid].data) {
      const summonerData = env.summoner[puuid].data
      summonerDisplayName = summonerData.displayName || ''
      
      // 构建 Riot ID (gameName#tagLine)
      if (summonerData.gameName && summonerData.tagLine) {
        riotIdName = summonerData.gameName + '#' + summonerData.tagLine
      }
    }
    
    // 在实时数据中查找这个玩家
    const livePlayer = liveData.allPlayers.find(function(p) {
      // 优先通过英雄名称匹配（最可靠）
      if (p.championName === championName || p.rawChampionName === championName) {
        return true
      }
      
      // 尝试通过 Riot ID 匹配
      if (riotIdName && p.riotId === riotIdName) {
        return true
      }
      
      // 尝试通过召唤师名称匹配
      if (summonerDisplayName && p.summonerName === summonerDisplayName) {
        return true
      }
      
      return false
    })
    
    if (!livePlayer) {
      // 找不到该玩家的实时数据，跳过
      return
    }
    
    // 玩家已阵亡
    if (livePlayer.isDead) {
      if (livePlayer.respawnTimer > 0) {
        const respawnTime = Math.ceil(livePlayer.respawnTimer)
        const msg = trans.respawning
          .replace('{champion}', championName)
          .replace('{time}', String(respawnTime))
        messages.push(msg)
      }
      return
    }
    
    // 获取位置信息
    if (livePlayer.position && typeof livePlayer.position === 'object') {
      const x = livePlayer.position.x
      const y = livePlayer.position.y
      
      if (typeof x === 'number' && typeof y === 'number') {
        const location = getLocationByCoordinates(x, y, env.locale)
        
        // 判断是否在危险区域（敌方野区等）
        const isDanger = location.indexOf('敌方') >= 0 || location.indexOf('Enemy') >= 0
        
        const template = isDanger ? trans.danger : trans.atLocation
        const msg = template
          .replace('{champion}', championName)
          .replace('{location}', location)
        messages.push(msg)
      }
    }
  })
  
  // 如果没有生成任何消息
  if (messages.length === 0) {
    return [trans.noLiveData]
  }
  
  return messages
}

function getMetadata() {
  return {
    version: 10,
    type: 'ongoing-game'
  }
}

