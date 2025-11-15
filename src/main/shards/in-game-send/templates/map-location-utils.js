// 地图位置工具函数
// 用于将游戏内坐标映射到具体的游戏区域

// 召唤师峡谷地图的关键位置坐标范围 (地图11)
// 坐标系统：左下角为原点，右上角为最大值
const SUMMONERS_RIFT_LOCATIONS = {
  // 大龙区域 (蓝色方上半野区靠近大龙坑)
  BARON: {
    xMin: 3500,
    xMax: 5500,
    yMin: 9500,
    yMax: 11500,
    name: {
      'zh-CN': '大龙',
      en: 'Baron'
    }
  },
  
  // 小龙区域 (蓝色方下半野区靠近小龙坑)
  DRAGON: {
    xMin: 8500,
    xMax: 10500,
    yMin: 3000,
    yMax: 5000,
    name: {
      'zh-CN': '小龙',
      en: 'Dragon'
    }
  },
  
  // 蓝色方上路
  BLUE_TOP_LANE: {
    xMin: 0,
    xMax: 4000,
    yMin: 10000,
    yMax: 15000,
    name: {
      'zh-CN': '上路',
      en: 'Top'
    }
  },
  
  // 蓝色方中路
  BLUE_MID_LANE: {
    xMin: 4000,
    xMax: 10000,
    yMin: 4000,
    yMax: 10000,
    name: {
      'zh-CN': '中路',
      en: 'Mid'
    }
  },
  
  // 蓝色方下路
  BLUE_BOT_LANE: {
    xMin: 10000,
    xMax: 15000,
    yMin: 0,
    yMax: 4000,
    name: {
      'zh-CN': '下路',
      en: 'Bot'
    }
  },
  
  // 红色方上路 (实际上是地图右上角)
  RED_TOP_LANE: {
    xMin: 10000,
    xMax: 15000,
    yMin: 10000,
    yMax: 15000,
    name: {
      'zh-CN': '上路',
      en: 'Top'
    }
  },
  
  // 红色方下路 (实际上是地图左下角)
  RED_BOT_LANE: {
    xMin: 0,
    xMax: 4000,
    yMin: 0,
    yMax: 4000,
    name: {
      'zh-CN': '下路',
      en: 'Bot'
    }
  },
  
  // 蓝色方野区
  BLUE_JUNGLE: {
    xMin: 2000,
    xMax: 7000,
    yMin: 4000,
    yMax: 10000,
    name: {
      'zh-CN': '我方野区',
      en: 'Our Jungle'
    }
  },
  
  // 红色方野区
  RED_JUNGLE: {
    xMin: 8000,
    xMax: 13000,
    yMin: 5000,
    yMax: 11000,
    name: {
      'zh-CN': '敌方野区',
      en: 'Enemy Jungle'
    }
  },
  
  // 河道
  RIVER: {
    xMin: 5000,
    xMax: 9000,
    yMin: 5000,
    yMax: 9000,
    name: {
      'zh-CN': '河道',
      en: 'River'
    }
  },
  
  // 蓝色方红buff
  BLUE_RED_BUFF: {
    xMin: 6000,
    xMax: 7500,
    yMin: 2500,
    yMax: 4000,
    name: {
      'zh-CN': '我方红buff',
      en: 'Our Red Buff'
    }
  },
  
  // 蓝色方蓝buff
  BLUE_BLUE_BUFF: {
    xMin: 2500,
    xMax: 4000,
    yMin: 10000,
    yMax: 11500,
    name: {
      'zh-CN': '我方蓝buff',
      en: 'Our Blue Buff'
    }
  },
  
  // 红色方红buff
  RED_RED_BUFF: {
    xMin: 7500,
    xMax: 9000,
    yMin: 11000,
    yMax: 12500,
    name: {
      'zh-CN': '敌方红buff',
      en: 'Enemy Red Buff'
    }
  },
  
  // 红色方蓝buff
  RED_BLUE_BUFF: {
    xMin: 11000,
    xMax: 12500,
    yMin: 3500,
    yMax: 5000,
    name: {
      'zh-CN': '敌方蓝buff',
      en: 'Enemy Blue Buff'
    }
  },
  
  // 蓝色方基地
  BLUE_BASE: {
    xMin: 0,
    xMax: 2500,
    yMin: 0,
    yMax: 2500,
    name: {
      'zh-CN': '我方基地',
      en: 'Our Base'
    }
  },
  
  // 红色方基地
  RED_BASE: {
    xMin: 12500,
    xMax: 15000,
    yMin: 12500,
    yMax: 15000,
    name: {
      'zh-CN': '敌方基地',
      en: 'Enemy Base'
    }
  }
}

/**
 * 根据坐标判断玩家所在位置
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {string} team - 玩家队伍 ('ORDER' 蓝色方 或 'CHAOS' 红色方)
 * @param {string} locale - 语言环境
 * @returns {string} - 位置描述
 */
function getLocationByCoordinates(x, y, team, locale = 'zh-CN') {
  // 优先级顺序：特殊区域（大龙、小龙、buff）> 基地 > 野区 > 河道 > 路线
  const priorityOrder = [
    'BARON',
    'DRAGON',
    'BLUE_RED_BUFF',
    'BLUE_BLUE_BUFF',
    'RED_RED_BUFF',
    'RED_BLUE_BUFF',
    'BLUE_BASE',
    'RED_BASE',
    'BLUE_JUNGLE',
    'RED_JUNGLE',
    'RIVER',
    'BLUE_TOP_LANE',
    'BLUE_MID_LANE',
    'BLUE_BOT_LANE',
    'RED_TOP_LANE',
    'RED_BOT_LANE'
  ]
  
  for (const key of priorityOrder) {
    const location = SUMMONERS_RIFT_LOCATIONS[key]
    if (x >= location.xMin && x <= location.xMax && 
        y >= location.yMin && y <= location.yMax) {
      return location.name[locale] || location.name['zh-CN']
    }
  }
  
  return locale === 'zh-CN' ? '未知位置' : 'Unknown Location'
}

/**
 * 获取适合报点的位置描述
 * @param {object} player - 玩家数据
 * @param {string} locale - 语言环境
 * @returns {string|null} - 位置描述，如果玩家阵亡返回null
 */
function getPlayerLocationDescription(player, locale = 'zh-CN') {
  if (!player || !player.position) {
    return null
  }
  
  if (player.isDead) {
    return null
  }
  
  const { x, y } = player.position
  const team = player.team
  
  return getLocationByCoordinates(x, y, team, locale)
}

/**
 * 判断玩家是否在危险区域（敌方野区、敌方基地等）
 * @param {object} player - 玩家数据
 * @param {string} selfTeam - 己方队伍
 * @returns {boolean}
 */
function isInDangerZone(player, selfTeam) {
  if (!player || !player.position) {
    return false
  }
  
  const { x, y } = player.position
  const location = getLocationByCoordinates(x, y, player.team)
  
  // 蓝色方视角
  if (selfTeam === 'ORDER') {
    return location.includes('敌方') || location.includes('Enemy')
  }
  // 红色方视角
  else if (selfTeam === 'CHAOS') {
    return location.includes('敌方') || location.includes('Enemy')
  }
  
  return false
}

// 导出函数供模板使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLocationByCoordinates,
    getPlayerLocationDescription,
    isInDangerZone,
    SUMMONERS_RIFT_LOCATIONS
  }
}

