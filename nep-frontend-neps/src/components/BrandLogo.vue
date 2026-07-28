<template>
  <div class="brand-logo" :class="size">
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="4" width="40" height="40" rx="10" :fill="`url(#${gradId})`" />
      <path
        d="M14 30L22 18L30 24L36 14"
        stroke="#fff"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="36" cy="14" r="3" fill="#fff" />
      <defs>
        <linearGradient :id="gradId" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stop-color="#43A047" />
          <stop offset="100%" stop-color="#1B5E20" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
  },
})

const gradId = `nepsLogoGrad-${Math.random().toString(36).slice(2, 9)}`
</script>

<style scoped>
.brand-logo {
  display: inline-flex;
  line-height: 0;
}
.brand-logo svg {
  width: 100%;
  height: 100%;
  display: block;
}
.brand-logo.sm {
  width: 36px;
  height: 36px;
}
.brand-logo.md {
  width: 56px;
  height: 56px;
}
.brand-logo.lg {
  width: 72px;
  height: 72px;
}
</style>
