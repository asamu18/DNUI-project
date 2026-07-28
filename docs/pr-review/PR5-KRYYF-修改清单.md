# PR #5 修改清单

**PR:** https://github.com/asamu18/DNUI-project/pull/5  
**作者:** KRYYF  
**分支:** `grid-member-frontend` → `main`  
**模块:** 网格员端前后端（NEPG）  
**修复分支（本地）:** `pr-5-fix`

---

## Must fix

1. [x] 提交实测写 `statistics.af_id`（`setAfId(feedback.getAfId())`）
2. [x] 开发端口改为 `8082`
3. [x] 还原 `application.yml` 默认密码为 `root`
4. [x] 提交要求 `state == 1`；`gmId == null` 防 NPE；token 须 `gm_` 前缀

## Should fix

5. [x] `Index.vue` 改为 NEPG 欢迎与任务入口
6. [x] `state === 2` 隐藏提交按钮
7. [x] README / `docs/api-list.md` / `rules.md` 同步 NEPG
8. [x] 已 merge `origin/main`（保留 neps/nepm/nepv）

## 待办（仓库协作）

- [ ] 将本分支推送到远程并更新 PR#5（或作者 cherry-pick）
- [ ] 关闭已过时的 PR#2
