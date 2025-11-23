import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 保存游戏结束时的对局分析数据
 */
@Entity('GameAnalyses')
export class GameAnalysis {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  @Index('game_analyses_game_id_index')
  gameId: number

  /**
   * 使用 League Akari 的玩家 PUUID
   */
  @Column({ type: 'varchar', nullable: false })
  @Index('game_analyses_self_puuid_index')
  selfPuuid: string

  /**
   * 地区
   */
  @Column({ type: 'varchar', nullable: false })
  region: string

  /**
   * 平台
   */
  @Column({ type: 'varchar', nullable: false })
  rsoPlatformId: string

  /**
   * 队列类型
   */
  @Column({ type: 'varchar', nullable: false })
  queueType: string

  /**
   * 游戏模式
   */
  @Column({ type: 'varchar', nullable: true })
  gameMode: string | null

  /**
   * 游戏时长（秒）
   */
  @Column({ type: 'integer', nullable: true })
  gameDuration: number | null

  /**
   * 是否胜利
   */
  @Column({ type: 'boolean', nullable: true })
  win: boolean | null

  /**
   * 玩家分析数据（JSON格式）
   * 存储所有玩家的详细分析数据
   */
  @Column({ type: 'text', nullable: false })
  playerAnalyses: string

  /**
   * 队伍分析数据（JSON格式）
   * 存储各队伍的整体分析数据
   */
  @Column({ type: 'text', nullable: false })
  teamAnalyses: string

  /**
   * 预组队信息（JSON格式）
   * 存储预组队检测结果
   */
  @Column({ type: 'text', nullable: true })
  teamUpInfo: string | null

  /**
   * 创建时间
   */
  @Column({ type: 'datetime', nullable: false })
  @Index('game_analyses_created_at_index')
  createdAt: Date
}

