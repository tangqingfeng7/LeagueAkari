const TRANS = {
  'zh-CN': {
    unknownSummoner: '未知召唤师',
    unknownChampion: '未知英雄',
    text: '{name}：{count}场 KDA {averageKda} 胜率{winRate}% 场均伤害{avgDamage} 参团率{kp}%'
  },
  en: {
    unknownSummoner: 'Unknown Summoner',
    unknownChampion: 'Unknown Champion',
    text: '{name}: {count} games, KDA {averageKda}, WR {winRate}%, Avg DMG {avgDamage}, KP {kp}%'
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
      const {
        averageKda = 0,
        count = 0,
        winRate = 0
      } = stats

      // 计算场均伤害和参团率（示例数据）
      const avgDamage = Math.round((stats.totalDamage || 0) / (count || 1))
      const kp = Math.round((stats.killParticipation || 0) * 100)

      return { puuid, name, averageKda, count, winRate, avgDamage, kp }
    })
    .map(({ name, averageKda, count, winRate, avgDamage, kp }) =>
      TRANS[env.locale].text
        .replace('{name}', name)
        .replace('{count}', count)
        .replace('{averageKda}', averageKda.toFixed(2))
        .replace('{winRate}', (winRate * 100).toFixed(0))
        .replace('{avgDamage}', avgDamage)
        .replace('{kp}', kp)
    )
}

function getMetadata() {
  return {
    version: 10,
    type: 'ongoing-game'
  }
}
