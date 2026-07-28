<template>
  <van-nav-bar
    class="nep-nav"
    :title="title"
    :left-arrow="showBack"
    fixed
    placeholder
    @click-left="onBack"
  >
    <template v-if="rightText || showLogout" #right>
      <span v-if="rightText" class="nav-action" @click="$emit('click-right')">
        {{ rightText }}
      </span>
      <span
        v-if="showLogout"
        class="nav-action"
        @click="onLogout"
      >
        退出
      </span>
    </template>
  </van-nav-bar>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useUserStore } from '../store/user'

const props = defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true },
  rightText: { type: String, default: '' },
  backTo: { type: String, default: '' },
  showLogout: { type: Boolean, default: false },
})

defineEmits(['click-right'])

const router = useRouter()
const userStore = useUserStore()

function onBack() {
  if (props.backTo) {
    router.replace(props.backTo)
    return
  }
  if (window.history.length > 1) {
    router.back()
  } else {
    router.replace('/login')
  }
}

async function onLogout() {
  try {
    await showConfirmDialog({
      title: '退出登录',
      message: '确定退出当前账号吗？',
      confirmButtonText: '退出',
      confirmButtonColor: '#2E7D32',
    })
    userStore.clearUser()
    showToast('已退出登录')
    router.replace('/login')
  } catch {
    // 用户取消
  }
}
</script>

<style>
/* 变量挂在组件根上，避免全局白图标落在白底上 */
.nep-nav.van-nav-bar {
  --van-nav-bar-background: #1b5e20;
  --van-nav-bar-icon-color: #ffffff;
  --van-nav-bar-title-text-color: #ffffff;
  --van-nav-bar-text-color: #ffffff;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 55%, #43a047 100%) !important;
}

.nep-nav .van-nav-bar__content {
  color: #ffffff;
}

.nep-nav .van-nav-bar__title {
  color: #ffffff !important;
  font-weight: 700;
  letter-spacing: 1px;
}

.nep-nav .van-nav-bar__arrow,
.nep-nav .van-nav-bar__left .van-icon,
.nep-nav .van-icon-arrow-left,
.nep-nav .van-icon {
  color: #ffffff !important;
  opacity: 1 !important;
}

.nep-nav .nav-action {
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
  padding: 4px 10px;
  color: #1b5e20 !important;
  background: #ffffff !important;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
