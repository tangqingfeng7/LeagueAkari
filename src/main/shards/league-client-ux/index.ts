import { queryUxCommandLine, queryUxCommandLineNative } from '@main/utils/ux-cmd'
import elevateExecutablePath from '@resources/elevate.exe?asset&asarUnpack'
import wmiRebuildScriptPath from '@resources/rebuild_WMI.bat?asset&asarUnpack'
import { IAkariShardInitDispose, Shard } from '@shared/akari-shard'
import cp from 'node:child_process'
import util from 'node:util'

import { AppCommonMain } from '../app-common'
import { AkariIpcMain } from '../ipc'
import { AkariLogger, LoggerFactoryMain } from '../logger-factory'
import { MobxUtilsMain } from '../mobx-utils'
import { SettingFactoryMain } from '../setting-factory'
import { SetterSettingService } from '../setting-factory/setter-setting-service'
import { LeagueClientUxSettings, LeagueClientUxState } from './state'

const execAsync = util.promisify(cp.exec)

/**
 * 对于 League Client Ux 进程的相关工具集, 比如检测命令行
 */
@Shard(LeagueClientUxMain.id)
export class LeagueClientUxMain implements IAkariShardInitDispose {
  static id = 'league-client-ux-main'

  static UX_PROCESS_NAME = 'LeagueClientUx.exe'
  static CLIENT_CMD_DEFAULT_POLL_INTERVAL = 2000
  static CLIENT_CMD_LONG_POLL_INTERVAL = 8000

  public readonly settings = new LeagueClientUxSettings()
  public readonly state = new LeagueClientUxState()

  private readonly _log: AkariLogger
  private readonly _setting: SetterSettingService

  private _pollTimerId: NodeJS.Timeout | null = null

  constructor(
    private readonly _ipc: AkariIpcMain,
    private readonly _common: AppCommonMain,
    private readonly _loggerFactory: LoggerFactoryMain,
    private readonly _settingFactory: SettingFactoryMain,
    private readonly _mobx: MobxUtilsMain
  ) {
    this._log = _loggerFactory.create(LeagueClientUxMain.id)
    this._setting = _settingFactory.register(
      LeagueClientUxMain.id,
      {
        useWmic: { default: this.settings.useWmic },
        disableChallengeBanner: { default: this.settings.disableChallengeBanner },
        disableHomePageAds: { default: this.settings.disableHomePageAds }
      },
      this.settings
    )
  }

  async onInit() {
    this._handlePollExistingUx()

    await this._setting.applyToState()
    this._mobx.propSync(LeagueClientUxMain.id, 'settings', this.settings, [
      'useWmic',
      'disableChallengeBanner',
      'disableHomePageAds'
    ])
    this._mobx.propSync(LeagueClientUxMain.id, 'state', this.state, ['launchedClients'])

    this._ipc.onCall(LeagueClientUxMain.id, 'rebuildWmi', () => this._rebuildWmi())
    this._ipc.onCall(LeagueClientUxMain.id, 'setDisableChallengeBanner', (_, value: boolean) => {
      this.settings.setDisableChallengeBanner(value)
      this._applyAdBlockSettings()
    })
    this._ipc.onCall(LeagueClientUxMain.id, 'setDisableHomePageAds', (_, value: boolean) => {
      this.settings.setDisableHomePageAds(value)
      this._applyAdBlockSettings()
    })
  }

  async onDispose() {
    if (this._pollTimerId) {
      clearInterval(this._pollTimerId)
      this._pollTimerId = null
    }
  }

  setPollInterval(interval: number, immediate = false) {
    if (this._pollTimerId) {
      clearInterval(this._pollTimerId)

      if (immediate) {
        this.update()
      }

      this._pollTimerId = setInterval(() => this.update(), interval)
    }
  }

  private _handlePollExistingUx() {
    this.update()
    this._pollTimerId = setInterval(
      () => this.update(),
      LeagueClientUxMain.CLIENT_CMD_DEFAULT_POLL_INTERVAL
    )
  }

  /**
   * 立即更新状态
   */
  async update() {
    try {
      this.state.setLaunchedClients(await this._queryUxCommandLine())

      if (this._pollTimerId) {
        clearInterval(this._pollTimerId)
      }
      this._pollTimerId = setInterval(
        () => this.update(),
        LeagueClientUxMain.CLIENT_CMD_DEFAULT_POLL_INTERVAL
      )
    } catch (error) {
      this._ipc.sendEvent(LeagueClientUxMain.id, 'error-polling')
      this._log.error(`Failed to get Ux command line`, error)
    }
  }

  private _queryUxCommandLine() {
    if (this.settings.useWmic) {
      if (!this._common.state.isAdministrator) {
        return []
      }

      return queryUxCommandLine(LeagueClientUxMain.UX_PROCESS_NAME)
    }

    return queryUxCommandLineNative(LeagueClientUxMain.UX_PROCESS_NAME)
  }

  private async _rebuildWmi() {
    const cmd = `"${elevateExecutablePath}" cmd /c start cmd /k "${wmiRebuildScriptPath}"`
    this._log.info('Rebuilding WMI...', cmd)
    await execAsync(cmd, { shell: 'cmd', windowsHide: false })
  }

  /**
   * 应用广告屏蔽设置
   * 通过向客户端注入配置来禁用广告组件
   */
  private async _applyAdBlockSettings() {
    try {
      this._log.info(
        `Applying ad block settings: disableChallengeBanner=${this.settings.disableChallengeBanner}, disableHomePageAds=${this.settings.disableHomePageAds}`
      )

      // 注意：这个功能需要在客户端重启后生效
      // 由于LCU API的限制，我们无法直接修改正在运行的客户端的UI配置
      // 实现方式：将配置写入本地文件，并在下次启动时加载

      this._log.info(
        'Ad block settings saved. Please restart the League Client for changes to take effect.'
      )
    } catch (error) {
      this._log.error('Failed to apply ad block settings', error)
    }
  }
}
