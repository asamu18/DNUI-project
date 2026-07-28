<template>
  <div class="login-page">
    <div class="hero">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <BrandLogo size="lg" />
      <h1 class="hero-title">NEPS 公众监督员</h1>
      <p class="hero-sub">守护绿水青山 · 东软环保公众监督系统</p>
    </div>

    <div class="form-card">
      <van-form @submit="onSubmit">
        <van-cell-group inset :border="false">
          <van-field
            v-model="form.phone"
            name="phone"
            label="手机号"
            type="tel"
            maxlength="11"
            placeholder="请输入手机号"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '手机号格式不正确' },
            ]"
          />
          <van-field
            v-model="form.password"
            name="password"
            label="密码"
            type="password"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </van-cell-group>
        <div class="nep-actions">
          <van-button
            class="nep-primary-btn"
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            登 录
          </van-button>
          <div class="nep-link" @click="$router.push('/register')">没有账号？去注册</div>
        </div>
      </van-form>
      <p class="footer">NEP 监督员端 v1.0</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import BrandLogo from '../components/BrandLogo.vue'
import { login } from '../api/supervisor'
import { useUserStore } from '../store/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const form = reactive({
  phone: '',
  password: '',
})

async function onSubmit() {
  loading.value = true
  try {
    const res = await login({
      phone: form.phone,
      password: form.password,
    })
    userStore.setUser({
      token: res.data.token,
      supervisorId: res.data.supervisorId,
      realName: res.data.realName,
    })
    showToast('登录成功')
    router.replace('/selectGrid')
  } catch {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--nep-bg);
  display: flex;
  flex-direction: column;
}

.hero {
  position: relative;
  overflow: hidden;
  padding: 48px 24px 36px;
  text-align: center;
  color: #fff;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 45%, #43a047 100%);
}

.glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(40px);
}
.glow-1 {
  width: 160px;
  height: 160px;
  background: rgba(255, 249, 196, 0.22);
  top: -20px;
  right: 10%;
}
.glow-2 {
  width: 140px;
  height: 140px;
  background: rgba(110, 208, 128, 0.25);
  bottom: -30px;
  left: 8%;
}

.hero :deep(.brand-logo) {
  position: relative;
  z-index: 1;
  margin: 0 auto 14px;
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.18));
}

.hero-title {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 2px;
}

.hero-sub {
  position: relative;
  z-index: 1;
  margin: 8px 0 0;
  font-size: 13px;
  opacity: 0.88;
  letter-spacing: 1px;
}

.form-card {
  margin: -18px 16px 0;
  padding: 20px 8px 8px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--nep-border);
  box-shadow: 0 8px 28px rgba(27, 94, 32, 0.12);
  position: relative;
  z-index: 2;
}

.footer {
  margin: 8px 0 16px;
  text-align: center;
  font-size: 12px;
  color: #bbb;
  letter-spacing: 0.5px;
}
</style>
