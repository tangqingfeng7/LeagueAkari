<div align="center">
  <div>
    <img
    src="https://github.com/LeagueAkari/LeagueAkari/raw/HEAD/pictures/logo.png"
    width="128"
    height="128"
    />
  </div>
  A League of Legends client toolkit based on the LCU API
</div>

<p align="center">
    <a href="https://github.com/LeagueAkari/LeagueAkari/releases"><img src="https://img.shields.io/github/release/LeagueAkari/LeagueAkari.svg?style=flat-square&maxAge=600" alt="Downloads"></a>
    <a href="https://github.com/LeagueAkari/LeagueAkari/releases">
    <img src="https://img.shields.io/github/downloads/LeagueAkari/LeagueAkari/total?style=flat&label=Downloads"></a>
    <a href="https://github.com/LeagueAkari/LeagueAkari/stargazers">
    <img src="https://img.shields.io/github/stars/LeagueAkari/LeagueAkari?style=flat&label=Stars">
  </a>
</p>

# 1. League Akari

A League of Legends client toolkit based on the LCU API.

## 1.2 Usage Instructions

Admin privileges are not required to run, but they enable additional features.

Supports most of the riot servers (not including Tencent).

## 1.3 Feedback Group

Fun places for casual chats, party setups, bug reports, and suggestions.

QQ Group: [301157623](https://qm.qq.com/q/F1Xv85etlm) (Passcode: akari)

QQ Group: [543703181](https://qm.qq.com/q/3V9pqYEspq) (Passcode: akari)

Telegram Group: [@KawaiiAkari](https://t.me/KawaiiAkari)

## 1.4 Beta Versions (.rabi)

"rabi" versions with features slated for the next release are periodically shared in the group chat.

# 2. Contributing to Development

Issues are inevitable; as a user, you can:

## 2.1 GitHub Issues

GitHub Issues is the primary channel for feedback. Please clearly describe your requirements, issues, or suggestions.

## 2.2 Contribute Code

Interested in the project? Feel free to contribute by submitting PRs and adding new features.

# 3. 最近优化

本项目包含多项性能增强和新功能：

## 3.1 性能优化

### 核心模块优化
- **战绩分析缓存**：为战绩分析结果添加30秒缓存，减少重复计算
- **预组队检测优化**：实现预组队计算的缓存机制
- **性能监控**：集成自动性能追踪，监控耗时操作
- **内存优化**：增强游戏数据的LRU缓存管理

### 工具库
- **缓存助手** (`@shared/utils/cache-helper.ts`)：支持TTL和请求去重的简单内存缓存
- **错误处理器** (`@shared/utils/error-handler.ts`)：高级错误处理，支持重试逻辑、超时控制和错误分类
- **性能监视器** (`@shared/utils/performance-monitor.ts`)：性能追踪、指标收集和慢操作自动警告
- **数据处理器** (`@shared/utils/data-processor.ts`)：高性能数据处理工具，包括分块处理、并发控制和数组操作


### 使用方式
这些工具可以在整个项目中导入使用：
```typescript
import { SimpleCache, withRetry, throttle, processInChunks } from '@shared/utils'
```

# 4. 构建与运行

本节描述如何从源代码构建 League Akari。

## 4.1 Electron 主程序

```bash
yarn install
yarn dev
yarn build:win
```

## 私有包

安装私有包需要有效的 GitHub PAT。

需要将 `NODE_AUTH_TOKEN` 设置为 PAT 值。

## 5. 参考项目

**League Akari** 的开发受到了多个优秀开源项目的启发。这些项目为软件的各个模块提供了宝贵的见解和指导。我们衷心感谢以下资源的作者和维护者：

| 项目                                                                                            | 描述                                                                          |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Pengu Loader](https://github.com/PenguLoader/PenguLoader)                                         | 终极 JavaScript 插件加载器，构建你的无与伦比的 LoL 客户端。              |
| [League of Legends LCU and Riot Client API Docs](https://github.com/KebsCS/lcu-and-riotclient-api) | 英雄联盟 LCU 和 Riot 客户端 API 文档                                       |
| [Community Dragon](https://www.communitydragon.org/documentation/assets)                           | 资源管理和资产文档参考。                               |
| [Seraphine](https://github.com/Zzaphkiel/Seraphine)                                                | 提供了集成方法和多工具组合的见解。          |
| [fix-lcu-window](https://github.com/LeagueTavern/fix-lcu-window)                                   | 解决了英雄联盟客户端窗口大小异常的问题。        |
| [Joi](https://github.com/watchingfun/Joi)                                                          | 英雄联盟助手工具                                                  |
| [vscode-league-respawn-timer](https://github.com/Coooookies/vscode-league-respawn-timer)           | 在 Visual Studio Code 中显示英雄联盟玩家复活时间的扩展。 |
| [LeaguePrank](https://github.com/LeagueTavern/LeaguePrank)                                         | 为趣味和幽默功能提供了灵感。                              |

# 6. 免责声明

本软件是基于 Riot 的英雄联盟客户端更新（LCU）API 开发的工具。它不使用侵入式技术，理论上不会直接干扰或修改游戏数据。但是，请注意与游戏更新或反作弊系统相关的潜在兼容性问题或风险。

开发者不对使用本软件导致的任何后果（如账号封禁或数据丢失）负责。建议用户充分了解风险并为自己的行为负责。

此外，**本应用程序未获得 Riot Games 的官方支持或认可**，所有权利归 Riot Games 所有。使用本软件需自行承担风险，因为它可能违反游戏的服务条款。

本免责声明旨在提供透明度并使用户能够做出明智的决定。感谢您的理解，请确保在游戏环境中公平竞争。

[![Star History Chart](https://api.star-history.com/svg?repos=LeagueAkari/LeagueAkari&type=Date)](https://star-history.com/#LeagueAkari/LeagueAkari&Date)
