const TRANS = {
  'zh-CN': {
    unknownSummoner: '未知召唤师',
    unknownChampion: '未知英雄',
    header: '===== 我方阵容 =====',
    text: '{position} {name}：{count}场 胜率{winRate}% KDA {kda}'
  },
  en: {
    unknownSummoner: 'Unknown Summoner',
    unknownChampion: 'Unknown Champion',
    header: '===== Our Team =====',
    text: '{position} {name}: {count} games, WR {winRate}%, KDA {kda}'
  }
}

const POSITION_NAMES = {
  'zh-CN': {
    'TOP': '上单',
    'JUNGLE': '打野',
    'MIDDLE': '中单',
    'BOTTOM': 'ADC',
    'UTILITY': '辅助',
    'UNKNOWN': '未知'
  },
  'en': {
    'TOP': 'Top',
    'JUNGLE': 'Jungle',
    'MIDDLE': 'Mid',
    'BOTTOM': 'ADC',
    'UTILITY': 'Support',
    'UNKNOWN': 'Unknown'
  }
}

function getMessages(env) {
  if (!env.playerStats) return []

  const messages = [TRANS[env.locale].header]

  const teamMembers = env.targetMembers
    .map((puuid) => {
      let name
      let position = 'UNKNOWN'
      
      if (env.queryStage.phase === 'champ-select') {
        name = env.summoner[puuid]?.data.gameName || TRANS[env.locale].unknownSummoner
        // 尝试从选人阶段获取位置信息
        const session = env.champSelectSession
        if (session && session.myTeam) {
          const player = session.myTeam.find(p => p.puuid === puuid)
          if (player && player.assignedPosition) {
            position = player.assignedPosition
          }
        }
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

      const positionName = POSITION_NAMES[env.locale][position] || position

      return { 
        puuid, 
        name, 
        position: positionName,
        averageKda, 
        count, 
        winRate 
      }
    })

  // 按位置排序
  const positionOrder = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY', 'UNKNOWN']
  teamMembers.sort((a, b) => {
    const aIndex = positionOrder.indexOf(a.position)
    const bIndex = positionOrder.indexOf(b.position)
    return aIndex - bIndex
  })

  teamMembers.forEach(({ name, position, averageKda, count, winRate }) => {
    messages.push(
      TRANS[env.locale].text
        .replace('{position}', position)
        .replace('{name}', name)
        .replace('{count}', count)
        .replace('{winRate}', (winRate * 100).toFixed(0))
        .replace('{kda}', averageKda.toFixed(2))
    )
  })

  return messages
}

function getMetadata() {
  return {
    version: 10,
    type: 'ongoing-game'
  }
}
