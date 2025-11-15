// 报点模板 - 用于快速发送队友位置信息
// 注意：这个模板会生成多条消息，每条对应一个队友和常见位置

const TRANS = {
  'zh-CN': {
    unknownChampion: '未知英雄',
    positions: [
      '在大龙',
      '在小龙',
      '在红buff',
      '在蓝buff',
      '在回程',
      '在上路',
      '在中路',
      '在下路',
      '在野区',
      '在河道'
    ]
  },
  en: {
    unknownChampion: 'Unknown Champion',
    positions: [
      'at Baron',
      'at Dragon',
      'at Red buff',
      'at Blue buff',
      'recalling',
      'at Top',
      'at Mid',
      'at Bot',
      'in Jungle',
      'at River'
    ]
  }
}

function getMessages(env) {
  if (!env.playerStats) return []

  const messages = []
  const positions = TRANS[env.locale].positions

  // 为每个队友生成所有可能的位置消息
  env.targetMembers.forEach((puuid) => {
    let championName
    let selection = env.championSelections[puuid] || -1
    championName = env.gameData.champions[selection]?.name || TRANS[env.locale].unknownChampion

    // 为每个英雄生成所有位置的消息
    positions.forEach((position) => {
      messages.push(`我们的${championName}${position}`)
    })
  })

  return messages
}

function getMetadata() {
  return {
    version: 10,
    type: 'ongoing-game'
  }
}
