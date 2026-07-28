<template>
  <div class="nep-page">
    <NavBar
      title="选择网格"
      :show-back="false"
      right-text="历史"
      show-logout
      @click-right="$router.push('/history')"
    />

    <div class="welcome">
      <div class="welcome-title">选择监督网格</div>
      <div class="welcome-sub">请选择省 / 市区域后继续填写空气质量反馈</div>
    </div>

    <van-cell-group inset>
      <van-field
        v-model="provinceName"
        is-link
        readonly
        label="省份"
        placeholder="请选择省份"
        @click="showProvince = true"
      />
      <van-field
        v-model="cityName"
        is-link
        readonly
        label="城市"
        placeholder="请先选择省份"
        :disabled="!provinceId"
        @click="onOpenCity"
      />
    </van-cell-group>

    <div class="nep-actions">
      <van-button
        class="nep-primary-btn"
        round
        block
        type="primary"
        :disabled="!provinceId || !cityId"
        :loading="loading"
        @click="goNext"
      >
        下一步
      </van-button>
    </div>

    <van-popup v-model:show="showProvince" position="bottom" round>
      <van-picker
        :columns="provinceColumns"
        @confirm="onProvinceConfirm"
        @cancel="showProvince = false"
      />
    </van-popup>

    <van-popup v-model:show="showCity" position="bottom" round>
      <van-picker
        :columns="cityColumns"
        @confirm="onCityConfirm"
        @cancel="showCity = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import NavBar from '../components/NavBar.vue'
import { getCities, getProvinces } from '../api/region'

const router = useRouter()
const loading = ref(false)
const provinces = ref([])
const cities = ref([])

const provinceId = ref(null)
const cityId = ref(null)
const provinceName = ref('')
const cityName = ref('')

const showProvince = ref(false)
const showCity = ref(false)

const provinceColumns = computed(() =>
  provinces.value.map((p) => ({ text: p.provinceName, value: p.id }))
)
const cityColumns = computed(() =>
  cities.value.map((c) => ({ text: c.cityName, value: c.id }))
)

onMounted(async () => {
  loading.value = true
  try {
    const res = await getProvinces()
    provinces.value = res.data || []
  } catch {
    // toast by interceptor
  } finally {
    loading.value = false
  }
})

async function onProvinceConfirm({ selectedOptions }) {
  const opt = selectedOptions[0]
  provinceId.value = opt.value
  provinceName.value = opt.text
  cityId.value = null
  cityName.value = ''
  cities.value = []
  showProvince.value = false
  try {
    const res = await getCities(provinceId.value)
    cities.value = res.data || []
  } catch {
    // ignore
  }
}

function onOpenCity() {
  if (!provinceId.value) {
    showToast('请先选择省份')
    return
  }
  if (!cities.value.length) {
    showToast('该省份暂无城市数据')
    return
  }
  showCity.value = true
}

function onCityConfirm({ selectedOptions }) {
  const opt = selectedOptions[0]
  cityId.value = opt.value
  cityName.value = opt.text
  showCity.value = false
}

function goNext() {
  router.push({
    path: '/feedback',
    query: {
      provinceId: provinceId.value,
      cityId: cityId.value,
      provinceName: provinceName.value,
      cityName: cityName.value,
    },
  })
}
</script>

<style scoped>
.welcome {
  margin: 16px;
  padding: 20px 18px;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #43a047 100%);
  box-shadow: 0 6px 20px rgba(27, 94, 32, 0.2);
}
.welcome-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
}
.welcome-sub {
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.9;
}
</style>
