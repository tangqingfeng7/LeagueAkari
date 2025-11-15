// 简化版自动报点 - 更简洁的实时报点模板

function getMetadata() {
  return {
    version: 10,
    type: 'ongoing-game'
  }
}

function getMessages(env) {
  // 检查实时游戏数据
  if (!env.liveGameData || !env.liveGameData.allPlayers) {
    return ['请在游戏中使用此功能']
  }
  
  const messages = []
  
  // 地图关键位置（简化版）
  const locations = [
    { x: [3500, 5500], y: [9500, 11500], name: '大龙' },
    { x: [8500, 10500], y: [3000, 5000], name: '小龙' },
    { x: [8000, 13000], y: [5000, 11000], name: '敌方野区' },
    { x: [5000, 9000], y: [5000, 9000], name: '河道' }
  ]
  
  // 判断位置
  function getLocation(x, y) {
    for (const loc of locations) {
      if (x >= loc.x[0] && x <= loc.x[1] && y >= loc.y[0] && y <= loc.y[1]) {
        return loc.name
      }
    }
    return '线上'
  }
  
  // 遍历目标玩家
  env.targetMembers.forEach(function(puuid) {
    // 获取英雄名
    const championId = env.championSelections[puuid] || -1
    const championName = env.gameData.champions[championId]?.name || '未知'
    
    // 在实时数据中查找（优先用英雄名匹配）
    const player = env.liveGameData.allPlayers.find(function(p) {
      return p.championName === championName || p.rawChampionName === championName
    })
    
    if (!player) return
    
    // 阵亡检查
    if (player.isDead) {
      if (player.respawnTimer > 0) {
        messages.push(championName + ' 复活倒计时 ' + Math.ceil(player.respawnTimer) + '秒')
      }
      return
    }
    
    // 报告位置
    if (player.position && typeof player.position.x === 'number' && typeof player.position.y === 'number') {
      const loc = getLocation(player.position.x, player.position.y)
      const mark = (loc.indexOf('敌方') >= 0 || loc === '大龙' || loc === '小龙') ? '⚠️ ' : ''
      messages.push(mark + championName + ' ' + loc)
    }
  })
  
  return messages.length > 0 ? messages : ['暂无位置信息']
}

