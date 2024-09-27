<script lang="ts" setup>
import { useLayoutMode } from '@/hooks/useLayoutMode'
import { EximbankLogo, EximbankLogoWhite, EximbankLogoMiniWhite } from '@/assets'

interface Props {
  collapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapse: true
})

const { isLeft, isTop } = useLayoutMode()
</script>

<template>
  <div class="layout-logo-container flex justify-center items-center" :class="{ 'layout-mode-top': isTop }">
    <router-link v-if="props.collapse" key="collapse" to="/">
      <img :src="EximbankLogoMiniWhite" class="h-7" />
    </router-link>
    <router-link v-else key="expand" to="/">
      <img :src="isTop || !isLeft ? EximbankLogo : EximbankLogoWhite" class="layout-logo-text h-7" />
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.layout-logo-container {
  position: relative;
  width: 100%;
  height: var(--prefix-header-height);
  line-height: var(--prefix-header-height);
  text-align: center;
  overflow: hidden;
  .layout-logo {
    display: none;
  }
  .layout-logo-text {
    height: 100%;
    vertical-align: middle;
  }
}

.layout-mode-top {
  height: var(--prefix-navigationbar-height);
  line-height: var(--prefix-navigationbar-height);
}

.collapse {
  .layout-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
  }
  .layout-logo-text {
    display: none;
  }
}
</style>
