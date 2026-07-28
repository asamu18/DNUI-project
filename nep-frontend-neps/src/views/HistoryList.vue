<template>
  <div class="nep-page">
    <NavBar title="历史反馈" back-to="/selectGrid" show-logout />

    <van-pull-refresh v-model="refreshing" @refresh="loadData">
      <van-empty v-if="!loading && !list.length" description="暂无反馈记录" />
      <div v-else class="list">
        <div v-for="item in list" :key="item.id" class="item-card">
          <div class="item-top">
            <span
              class="level-tag"
              :style="{ background: getAqiInfo(item.estimatedLevel).color }"
            >
              {{ getAqiInfo(item.estimatedLevel).grade }}
            </span>
            <span class="region-text">
              {{ item.provinceName || '' }}-{{ item.cityName || '' }}
            </span>
            <span class="time">{{ formatTime(item.feedbackTime) }}</span>
          </div>
          <div class="item-meta">{{ item.status || '' }}</div>
          <div class="item-desc">{{ item.feedbackDesc || '无描述' }}</div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import NavBar from '../components/NavBar.vue'
import { getMyFeedbackList } from '../api/feedback'
import { useUserStore } from '../store/user'
import { getAqiInfo } from '../utils/aqi'

const router = useRouter()
const userStore = useUserStore()
const list = ref([])
const loading = ref(false)
const refreshing = ref(false)

onMounted(() => {
  loadData()
})

async function loadData() {
  if (!userStore.supervisorId) {
    showToast('请先登录')
    router.replace('/login')
    return
  }
  loading.value = true
  try {
    const res = await getMyFeedbackList(userStore.supervisorId)
    list.value = res.data || []
  } catch {
    // interceptor
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

function formatTime(t) {
  if (!t) return ''
  return String(t).replace('T', ' ').slice(0, 16)
}
</script>

<style scoped>
.list {
  padding: 8px 16px 16px;
}
.item-card {
  margin-bottom: 12px;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid var(--nep-border);
  border-radius: 14px;
  box-shadow: var(--nep-card-shadow);
}
.item-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.level-tag {
  display: inline-block;
  min-width: 48px;
  padding: 2px 8px;
  border-radius: 6px;
  color: #111;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}
.region-text {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: var(--nep-text);
}
.time {
  font-size: 12px;
  color: var(--nep-text-muted);
}
.item-meta {
  margin-top: 8px;
  font-size: 12px;
  color: var(--nep-primary-mid);
  font-weight: 600;
}
.item-desc {
  margin-top: 6px;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}
</style>
