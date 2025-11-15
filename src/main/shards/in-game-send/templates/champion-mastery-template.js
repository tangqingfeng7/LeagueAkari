const TRANS = {
  'zh-CN': {
    unknownSummoner: '未知召唤师',
    unknownChampion: '未知英雄',
    text: '{name}：{champion} 熟练度{mastery}级 {count}场 胜率{winRate}%'
  },
  en: {
    unknownSummoner: 'Unknown Summoner',
    unknownChampion: 'Unknown Champion',
    text: '{name}: {champion} M{mastery}, {count} games, WR {winRate}%'
  }
}

function getMessages(env) {
  if (!env.playerStats) return []

  return env.targetMembers
    .map((puuid) => {
      let name
      let championName
      let championId
      
      if (env.queryStage.phase === 'champ-select') {
        name = env.summoner[puuid]?.data.gameName || TRANS[env.locale].unknownSummoner
        championId = env.championSelections[puuid] || -1
        championName = env.gameData.champions[championId]?.name || TRANS[env.locale].unknownChampion
      } else {
        let selection = env.championSelections[puuid] || -1
        championName = env.gameData.champions[selection]?.name || TRANS[env.locale].unknownChampion
        name = championName
        championId = selection
      }

      const stats = env.playerStats.players[puuid]?.summary || {}
      const championMastery = env.championMastery?.[puuid]?.[championId]
      
      const mastery = championMastery?.championLevel || 0
      const {
        count = 0,
        winRate = 0
      } = stats

      return { puuid, name, champion: championName, mastery, count, winRate }
    })
    .map(({ name, champion, mastery, count, winRate }) =>
      TRANS[env.locale].text
        .replace('{name}', name)
        .replace('{champion}', champion)
        .replace('{mastery}', mastery)
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
