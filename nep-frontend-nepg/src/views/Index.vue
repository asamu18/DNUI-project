<template>
  <div class="index-page">
    <div class="welcome-banner">
      <div class="banner-content">
        <h2 class="page-title">欢迎使用 NEPG 网格员端</h2>
        <p class="page-subtitle">东软环保公众监督系统 — 现场实测填报</p>
      </div>
      <div class="banner-decor">
        <div class="decor-circle c1"></div>
        <div class="decor-circle c2"></div>
        <div class="decor-circle c3"></div>
      </div>
    </div>

    <el-row :gutter="20" class="stat-cards">
      <el-col :span="12" v-for="card in statCards" :key="card.label">
        <el-card shadow="hover" class="stat-card" @click="router.push(card.link)">
          <div class="stat-icon" :style="{ background: card.color }">
            <el-icon :size="28"><component :is="card.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">{{ card.label }}</div>
            <div class="stat-desc">{{ card.desc }}</div>
          </div>
          <div class="stat-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { List, Checked, ArrowRight } from '@element-plus/icons-vue'
import { useUserStore } from '../store/user'

const router = useRouter()
const userStore = useUserStore()

const statCards = [
  {
    label: '我的任务',
    desc: '查看已指派的公众反馈并进入详情',
    icon: List,
    color: 'linear-gradient(135deg, #43A047, #2E7D32)',
    link: '/grid/task',
  },
  {
    label: '当前账号',
    desc: userStore.gmName
      ? `${userStore.gmName}（${userStore.gmCode}）`
      : '登录后显示网格员信息',
    icon: Checked,
    color: 'linear-gradient(135deg, #66BB6A, #388E3C)',
    link: '/grid/task',
  },
]
</script>

<style scoped>
.index-page {
  max-width: 960px;
}

.welcome-banner {
  position: relative;
  background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #43A047 100%);
  border-radius: 16px;
  padding: 32px 40px;
  margin-bottom: 28px;
  overflow: hidden;
  box-shadow:
    0 4px 16px rgba(27, 94, 32, 0.18),
    0 8px 32px rgba(67, 160, 71, 0.12);
}
.banner-content {
  position: relative;
  z-index: 1;
}
.banner-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.decor-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}
.decor-circle.c1 {
  width: 200px;
  height: 200px;
  top: -60px;
  right: 30px;
}
.decor-circle.c2 {
  width: 140px;
  height: 140px;
  bottom: -40px;
  right: 180px;
}
.decor-circle.c3 {
  width: 80px;
  height: 80px;
  top: 20px;
  right: 280px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 3px;
}
.page-subtitle {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
}

.stat-cards {
  margin: 0 !important;
}
.stat-card {
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 16px;
  border: 1px solid #eef3ee;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.stat-card:hover {
  transform: translateY(-6px);
  border-color: #c8e6c9;
  box-shadow: 0 8px 28px rgba(67, 160, 71, 0.15);
}
.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 24px;
}
.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}
.stat-info {
  flex: 1;
}
.stat-label {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}
.stat-desc {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}
.stat-arrow {
  color: #c0c4cc;
  font-size: 16px;
  transition: all 0.3s;
}
.stat-card:hover .stat-arrow {
  color: #43A047;
  transform: translateX(4px);
}
</style>
