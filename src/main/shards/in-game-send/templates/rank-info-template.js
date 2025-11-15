const TRANS = {
  'zh-CN': {
    unknownSummoner: '未知召唤师',
    unknownChampion: '未知英雄',
    unranked: '未定级',
    text: '{name}：{rank} {count}场 胜率{winRate}%'
  },
  en: {
    unknownSummoner: 'Unknown Summoner',
    unknownChampion: 'Unknown Champion',
    unranked: 'Unranked',
    text: '{name}: {rank}, {count} games, WR {winRate}%'
  }
}

const RANK_NAMES = {
  'zh-CN': {
    'IRON': '黑铁',
    'BRONZE': '青铜',
    'SILVER': '白银',
    'GOLD': '黄金',
    'PLATINUM': '铂金',
    'EMERALD': '翡翠',
    'DIAMOND': '钻石',
    'MASTER': '大师',
    'GRANDMASTER': '宗师',
    'CHALLENGER': '王者'
  },
  'en': {
    'IRON': 'Iron',
    'BRONZE': 'Bronze',
    'SILVER': 'Silver',
    'GOLD': 'Gold',
    'PLATINUM': 'Platinum',
    'EMERALD': 'Emerald',
    'DIAMOND': 'Diamond',
    'MASTER': 'Master',
    'GRANDMASTER': 'Grandmaster',
    'CHALLENGER': 'Challenger'
  }
}

function getMessages(env) {
  if (!env.playerStats) return []

  return env.targetMembers
    .map((puuid) => {
      let name
      if (env.queryStage.phase === 'champ-select') {
        name = env.summoner[puuid]?.data.gameName || TRANS[env.locale].unknownSummoner
      } else {
        let selection = env.championSelections[puuid] || -1
        name = env.gameData.champions[selection]?.name || TRANS[env.locale].unknownChampion
      }

      const stats = env.playerStats.players[puuid]?.summary || {}
      const rankedStats = env.rankedStats?.[puuid]?.queueMap?.['RANKED_SOLO_5x5']
      
      let rank = TRANS[env.locale].unranked
      if (rankedStats && rankedStats.tier) {
        const tierName = RANK_NAMES[env.locale][rankedStats.tier] || rankedStats.tier
        rank = `${tierName} ${rankedStats.division || ''}`
      }

      const {
        count = 0,
        winRate = 0
      } = stats

      return { puuid, name, rank, count, winRate }
    })
    .map(({ name, rank, count, winRate }) =>
      TRANS[env.locale].text
        .replace('{name}', name)
        .replace('{rank}', rank)
        .replace('{count}', count)
        .replace('{winRate}', (winRate * 100).toFixed(0))
    )
}

function getMetadata() {
  return {
    version: 10,
    type: 'ongoing-game'
  }
}
