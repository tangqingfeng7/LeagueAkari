import { UxCommandLine } from '@main/utils/ux-cmd'
import { makeAutoObservable, observable } from 'mobx'

export class LeagueClientUxSettings {
  useWmic = false

  /**
   * 禁用挑战横幅广告，提高客户端流畅性
   */
  disableChallengeBanner = false

  /**
   * 禁用主页广告轮播
   */
  disableHomePageAds = false

  constructor() {
    makeAutoObservable(this)
  }

  setUseWmic(s: boolean) {
    this.useWmic = s
  }

  setDisableChallengeBanner(s: boolean) {
    this.disableChallengeBanner = s
  }

  setDisableHomePageAds(s: boolean) {
    this.disableHomePageAds = s
  }
}

export class LeagueClientUxState {
  launchedClients: UxCommandLine[] = []

  constructor() {
    makeAutoObservable(this, {
      launchedClients: observable.struct
    })
  }

  setLaunchedClients(c: UxCommandLine[]) {
    this.launchedClients = c
  }
}
