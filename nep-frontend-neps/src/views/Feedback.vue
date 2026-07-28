<template>
  <div class="nep-page">
    <NavBar title="提交反馈" show-logout />
    <div class="region">反馈区域：{{ provinceName }} - {{ cityName }}</div>

    <van-cell-group inset>
      <van-field
        v-model="detailAddress"
        label="具体地址"
        placeholder="请输入详细地址"
        maxlength="100"
      />
    </van-cell-group>

    <div class="nep-section-title">AQI 等级参考</div>
    <van-cell-group inset>
      <van-cell
        v-for="item in levels"
        :key="item.level"
        :title="`${item.level} ${item.grade}`"
        :label="item.description"
      >
        <template #value>
          <span class="color-dot" :style="{ background: item.color }"></span>
        </template>
      </van-cell>
    </van-cell-group>

    <div class="nep-section-title">预估等级</div>
    <van-radio-group v-model="estimatedLevel" class="level-group">
      <van-cell-group inset>
        <van-cell
          v-for="item in levels"
          :key="item.level"
          clickable
          :title="`${item.level} ${item.grade}`"
          @click="estimatedLevel = item.level"
        >
          <template #right-icon>
            <van-radio :name="item.level" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>

    <van-cell-group inset class="desc-group">
      <van-field
        v-model="feedbackDesc"
        rows="3"
        autosize
        type="textarea"
        maxlength="200"
        show-word-limit
        label="反馈描述"
        placeholder="请描述空气质量情况"
      />
    </van-cell-group>

    <div class="nep-actions">
      <van-button
        class="nep-primary-btn"
        round
        block
        type="primary"
        :disabled="!estimatedLevel"
        :loading="loading"
        @click="onSubmit"
      >
        提 交
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import NavBar from '../components/NavBar.vue'
import { getAqiLevels } from '../api/aqi'
import { submitFeedback } from '../api/feedback'
import { useUserStore } from '../store/user'
import { AQI_LEVELS } from '../utils/aqi'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const provinceId = Number(route.query.provinceId)
const cityId = Number(route.query.cityId)
const provinceName = ref(route.query.provinceName || '')
const cityName = ref(route.query.cityName || '')

const levels = ref([...AQI_LEVELS])
const detailAddress = ref('')
const estimatedLevel = ref(null)
const feedbackDesc = ref('')
const loading = ref(false)

onMounted(async () => {
  if (!provinceId || !cityId) {
    showToast('请先选择网格')
    router.replace('/selectGrid')
    return
  }
  try {
    const res = await getAqiLevels()
    if (res.data?.length) {
      levels.value = res.data
    }
  } catch {
    // 使用本地兜底 AQI_LEVELS
  }
})

async function onSubmit() {
  if (!estimatedLevel.value) {
    showToast('请选择 AQI 等级')
    return
  }
  loading.value = true
  try {
    await submitFeedback({
      supervisorId: userStore.supervisorId,
      provinceId,
      cityId,
      detailAddress: detailAddress.value,
      estimatedLevel: estimatedLevel.value,
      feedbackDesc: feedbackDesc.value,
    })
    showToast('提交成功')
    router.replace('/history')
  } catch {
    // interceptor
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.region {
  margin: 12px 16px;
  padding: 12px 14px;
  background: var(--nep-primary-soft);
  border: 1px solid #c8e6c9;
  border-radius: 12px;
  color: var(--nep-primary-mid);
  font-weight: 600;
}
.color-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #ddd;
}
.level-group {
  margin-bottom: 8px;
}
.desc-group {
  margin-top: 12px;
}
</style>
