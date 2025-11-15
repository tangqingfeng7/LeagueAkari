const TRANS = {
  'zh-CN': {
    unknownSummoner: '未知召唤师',
    unknownChampion: '未知英雄',
    text: '{name} 胜率{winRate}%'
  },
  en: {
    unknownSummoner: 'Unknown Summoner',
    unknownChampion: 'Unknown Champion',
    text: '{name} WR {winRate}%'
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

      const { winRate = 0 } = env.playerStats.players[puuid]?.summary || {}
      return { puuid, name, winRate }
    })
    .map(({ name, winRate }) =>
      TRANS[env.locale].text
        .replace('{name}', name)
        .replace('{winRate}', (winRate * 100).toFixed(0))
    )
}

function getMetadata() {
  return {
    version: 10,
    type: 'ongoing-game'
  }
}
