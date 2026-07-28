# PR #2 修改清单

**PR:** https://github.com/asamu18/DNUI-project/pull/2  
**作者:** KRYYF  
**模块:** 网格员端  
**目标:** 网格员登录/任务/填报；不破坏监督员端；等 PR#1 合入后 rebase

## Must fix

1. 恢复 `AqiFeedbackServiceImpl.submit/myList` 原逻辑，禁止空实现
2. 对齐提交字段：
   - 请求用 `afId` 查任务
   - `statistics.fdId = task.telId`（不是 afId）
   - PM2.5 统一 `spmValue`（前后端一致）
   - `gmId` 从登录态取，校验任务归属
3. `so2Level/coLevel/spmLevel` 按浓度计算，禁止写死 `0`
4. 登录响应脱敏，不返回 `password`；其余接口加鉴权
5. 接口统一到 `/api/gridMember/**`；业务下沉 Service；Controller 不直注 Mapper

## Should fix

6. 前端复用现有 `request`/路由守卫，少用裸 `fetch` + `alert`
7. `submit` 加 `@Transactional`；校验任务存在/已确认/非本人
8. rebase PR#1 后合并：
   - 保留 PR1 的 `StatisticsService` 统计方法
   - 不要改回空 `IService`
   - 与 PR1 的 `GridMemberController` 合并，不要保留 `/grid` 第二套

## 自测

- [ ] 监督员注册/登录/提交/列表正常
- [ ] 网格员登录无 password；任务列表/详情/提交需鉴权
- [ ] 填报后 `statistics` 字段正确；`aqi_feedback.state=2`
