# 东软环保公众监督系统（NEP）

基于公众监督与网格员实测的空气质量信息收集与管理平台。本仓库为课程实践工程。

## 系统组成

| 模块 | 目录 | 端口 | 状态 |
|---|---|---|---|
| 后端 API | `nep-backend/` | 8080 | 已接入 |
| 公众监督员端（NEPS） | `nep-frontend-neps/` | 8081 | 已接入 |
| 网格员端（NEPG） | — | 8082 | 开发中（见 [PR #2](https://github.com/asamu18/DNUI-project/pull/2)） |
| 系统管理员端（NEPM） | `nep-frontend-nepm/` | 8083 | 已接入 |
| 决策者大屏（NEPV） | `nep-frontend-nepv/` | 8084 | 已接入 |

## 业务概览

1. **公众监督员**注册/登录，选择省-市网格，预估 AQI 等级并提交反馈  
2. **管理员**审核反馈并指派网格员  
3. **网格员**现场实测 SO₂ / CO / PM2.5，写入 `statistics`（含 `af_id` 关联反馈单）  
4. **决策者**查看覆盖率、分布、趋势与超标地图大屏  

## 技术栈

- **后端**：JDK 17+、Spring Boot 3.x、MyBatis-Plus、Druid、MySQL 8  
- **公众监督员端**：Vue 3、Vite、Vue Router、Pinia、Axios、Vant 4  
- **管理员端 / 决策大屏**：Vue 3、Vite、Vue Router、Pinia、Axios、Element Plus、ECharts  
- **协作文档**：`rules.md`、`docs/api-list.md`

## 快速开始

### 1. 环境要求

- JDK 17+
- Maven 3.8+
- Node.js 18+（建议）
- MySQL 8.x（默认账号 `root` / `root`，与 `application.yml` 一致）

### 2. 初始化数据库

以官方 dump 为权威（含 `statistics.af_id` 与完整 `grid_city` 种子数据）：

```bash
mysql -uroot -proot -e "DROP DATABASE IF EXISTS nep; CREATE DATABASE nep DEFAULT CHARACTER SET utf8mb3;"
mysql -uroot -proot nep < nep-backend/src/main/resources/sql/nep.sql
```

若本地已有旧库、只需升级 `af_id`：

```bash
mysql -uroot -proot nep < nep-backend/src/main/resources/sql/patch_statistics_af_id.sql
```

> `init.sql` / `seed.sql` 已过时，请勿再作为权威。

### 3. 启动后端

```bash
cd nep-backend
mvn spring-boot:run
```

验证：

```bash
curl http://localhost:8080/api/test/hello
curl http://localhost:8080/api/statistics/realTimeCount
```

### 4. 启动公众监督员端（NEPS）

```bash
cd nep-frontend-neps
npm install
npm run dev
```

访问：http://localhost:8081  
（开发环境通过 Vite 将 `/api` 代理到 `http://localhost:8080`）

### 5. 启动管理员端（NEPM）

```bash
cd nep-frontend-nepm
npm install
npm run dev
```

访问：http://localhost:8083  
账号：`admin` / `123`

### 6. 启动决策者大屏（NEPV）

```bash
cd nep-frontend-nepv
npm install
npm run dev
```

访问：http://localhost:8084  
（大屏统计只读接口可匿名访问；确认列表等管理接口需登录）

## 演示账号（来自 nep.sql）

| 角色 | 账号 | 密码 |
|---|---|---|
| 系统管理员 | `admin` | `123` |
| 公众监督员 | `13147859658` | `123` |
| 公众监督员 | `13776567898` | `123456` |
| 网格员示例 | `caocao` | `123` |

说明：官方库密码为**明文**存储；Token 为内存 UUID，重启后端后需重新登录。

## 目录说明

```
DNUI-project/
├── nep-backend/                      # 后端
│   └── src/main/resources/sql/
│       ├── nep.sql                   # 官方库（权威）
│       ├── patch_statistics_af_id.sql# 已有库升级补丁
│       ├── init.sql / seed.sql       # 旧脚手架（已过时）
├── nep-frontend-neps/                # 公众监督员端
├── nep-frontend-nepm/                # 系统管理员端
├── nep-frontend-nepv/                # 决策者大屏
├── docs/
│   └── api-list.md                   # 接口清单
├── rules.md                          # 团队 / AI 开发硬约束
├── doc/                              # 需求书、原型等资料
├── wbs.html                          # 任务分解
└── README.md
```

## 重要约定

1. **数据库字段**以 `nep-backend/src/main/resources/sql/nep.sql` 为准  
2. **实测关联反馈**使用 `statistics.af_id`（= `aqi_feedback.af_id`）；`fd_id` 为监督员电话  
3. **接口路径与字段映射**以 `docs/api-list.md`「已实现」为准  
4. **开发规则**见 `rules.md`（字段命名、AQI 限值、鉴权、密码策略等）  
5. 监督员主键为手机号 `tel_id`；前端可用 `supervisorId`，值为手机号字符串  
6. 接口统一前缀 `/api`；大屏只读统计可匿名，确认数据与业务写接口需鉴权  

## 文档与协作

| 文件 | 用途 |
|---|---|
| [rules.md](./rules.md) | 字段命名、接口契约、AQI 规则、安全约定 |
| [docs/api-list.md](./docs/api-list.md) | 已实现 / 规划中接口清单 |
| [nep-backend/README.md](./nep-backend/README.md) | 后端启动与结构说明 |
| [nep-frontend-neps/README.md](./nep-frontend-neps/README.md) | NEPS 前端启动与流程说明 |
| [nep-frontend-nepv/README.md](./nep-frontend-nepv/README.md) | 决策大屏启动说明 |
| [wbs.html](./wbs.html) | 项目 WBS |

## 仓库

https://github.com/asamu18/DNUI-project
