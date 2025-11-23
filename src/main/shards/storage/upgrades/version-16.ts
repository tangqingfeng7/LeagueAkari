import { QueryRunner, Table, TableIndex } from 'typeorm'

/**
 * Version 16 - 添加 GameAnalyses 表用于保存对局分析
 */
export async function v16_GameAnalysisUpgrade(queryRunner: QueryRunner) {
  // 创建 GameAnalyses 表
  await queryRunner.createTable(
    new Table({
      name: 'GameAnalyses',
      columns: [
        {
          name: 'id',
          type: 'integer',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'gameId',
          type: 'integer',
          isNullable: false
        },
        {
          name: 'selfPuuid',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'region',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'rsoPlatformId',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'queueType',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'gameMode',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'gameDuration',
          type: 'integer',
          isNullable: true
        },
        {
          name: 'win',
          type: 'boolean',
          isNullable: true
        },
        {
          name: 'playerAnalyses',
          type: 'text',
          isNullable: false
        },
        {
          name: 'teamAnalyses',
          type: 'text',
          isNullable: false
        },
        {
          name: 'teamUpInfo',
          type: 'text',
          isNullable: true
        },
        {
          name: 'createdAt',
          type: 'datetime',
          isNullable: false
        }
      ]
    }),
    true
  )

  // 创建索引
  await queryRunner.createIndex(
    'GameAnalyses',
    new TableIndex({
      name: 'game_analyses_game_id_index',
      columnNames: ['gameId']
    })
  )

  await queryRunner.createIndex(
    'GameAnalyses',
    new TableIndex({
      name: 'game_analyses_self_puuid_index',
      columnNames: ['selfPuuid']
    })
  )

  await queryRunner.createIndex(
    'GameAnalyses',
    new TableIndex({
      name: 'game_analyses_created_at_index',
      columnNames: ['createdAt']
    })
  )

  // 更新数据库版本
  await queryRunner.query(`UPDATE Metadata SET value = json('16') WHERE key = 'version'`)
}

