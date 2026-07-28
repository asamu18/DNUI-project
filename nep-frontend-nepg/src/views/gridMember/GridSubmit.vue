<template>
  <div>
    <h2>提交AQI数据</h2>

    <el-card>
      <el-form :model="form" label-width="120px">
        <el-form-item label="任务编号">
          <el-input v-model="form.afId" disabled />
        </el-form-item>

        <el-form-item label="SO₂值">
          <el-input-number v-model="form.so2Value" :min="0" @change="onValueChange" />
          <el-tag class="level-tag" :color="so2Info.color" effect="dark">
            等级 {{ so2Level }} · {{ so2Info.grade }}
          </el-tag>
        </el-form-item>

        <el-form-item label="CO值">
          <el-input-number v-model="form.coValue" :min="0" @change="onValueChange" />
          <el-tag class="level-tag" :color="coInfo.color" effect="dark">
            等级 {{ coLevel }} · {{ coInfo.grade }}
          </el-tag>
        </el-form-item>

        <el-form-item label="PM2.5值">
          <el-input-number v-model="form.spmValue" :min="0" @change="onValueChange" />
          <el-tag class="level-tag" :color="spmInfo.color" effect="dark">
            等级 {{ spmLevel }} · {{ spmInfo.grade }}
          </el-tag>
        </el-form-item>

        <el-form-item label="综合AQI">
          <el-tag size="large" :color="totalInfo.color" effect="dark" class="total-tag">
            等级 {{ totalLevel }} · {{ totalInfo.grade }}
          </el-tag>
          <span class="hint">取 SO₂ / CO / PM2.5 三项中最差等级</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="submit">
            提交实测数据
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { submitAqi } from '../../api/gridMember'
import { calcItemLevel, calcTotalLevel, getAqiInfo } from '../../utils/aqi'

const route = useRoute()
const router = useRouter()
const submitting = ref(false)

const form = reactive({
  afId: null,
  so2Value: 0,
  coValue: 0,
  spmValue: 0,
})

const so2Level = computed(() => calcItemLevel(form.so2Value, 'so2'))
const coLevel = computed(() => calcItemLevel(form.coValue, 'co'))
const spmLevel = computed(() => calcItemLevel(form.spmValue, 'spm'))
const totalLevel = computed(() =>
  calcTotalLevel(form.so2Value, form.coValue, form.spmValue)
)

const so2Info = computed(() => getAqiInfo(so2Level.value))
const coInfo = computed(() => getAqiInfo(coLevel.value))
const spmInfo = computed(() => getAqiInfo(spmLevel.value))
const totalInfo = computed(() => getAqiInfo(totalLevel.value))

function onValueChange() {
  // computed 会随 v-model 自动更新；保留钩子满足「Change 即算」交互
}

onMounted(() => {
  form.afId = Number(route.params.afId)
})

async function submit() {
  if (form.so2Value == null || form.coValue == null || form.spmValue == null) {
    ElMessage.warning('请填写完整的 AQI 实测数据')
    return
  }

  submitting.value = true
  try {
    await submitAqi({
      afId: form.afId,
      so2Value: form.so2Value,
      coValue: form.coValue,
      spmValue: form.spmValue,
    })
    ElMessage.success('提交成功')
    router.push('/grid/task')
  } catch {
    // 错误提示由 request 拦截器统一处理
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.level-tag {
  margin-left: 12px;
  border: none;
  color: #1a1a1a;
  font-weight: 600;
}
.total-tag {
  border: none;
  color: #1a1a1a;
  font-weight: 700;
  padding: 0 14px;
  height: 32px;
  line-height: 32px;
}
.hint {
  margin-left: 12px;
  color: #909399;
  font-size: 13px;
}
</style>
