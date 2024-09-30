<script lang="ts" setup>
import { getCurrentInstance, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { type RouteRecordName, type RouteRecordRaw } from 'vue-router'

interface Props {
  list: RouteRecordRaw[]
  isPressUpOrDown: boolean
}

/** Selected menu */
const modelValue = defineModel<RouteRecordName | undefined>({ required: true })
const props = defineProps<Props>()

const instance = getCurrentInstance()
const scrollbarHeight = ref<number>(0)

/** Menu Style */
const itemStyle = (item: RouteRecordRaw) => {
  const flag = item.name === modelValue.value
  return {
    background: flag ? 'var(--el-color-primary)' : '',
    color: flag ? '#ffffff' : ''
  }
}

/** Mouse over */
const handleMouseenter = (item: RouteRecordRaw) => {
  // If the up or down key and the mouseenter event are in effect at the same time, the up or down key will take precedence and the assignment logic of this function will not be executed.
  if (props.isPressUpOrDown) return
  modelValue.value = item.name
}

/** Calculate the height of the scrollable viewport */
const getScrollbarHeight = () => {
  // el-scrollbar max-height="40vh"
  scrollbarHeight.value = Number((window.innerHeight * 0.4).toFixed(1))
}

/** Calculate the distance to the top based on the subscript */
const getScrollTop = (index: number) => {
  const currentInstance = instance?.proxy?.$refs[`resultItemRef${index}`] as HTMLDivElement[]
  if (!currentInstance) return 0
  const currentRef = currentInstance[0]
  const scrollTop = currentRef.offsetTop + 128 // 128 = The sum of the heights of the two result-items (56 + 56 = 112) and the top and bottom margins (8 + 8 = 16)
  return scrollTop > scrollbarHeight.value ? scrollTop - scrollbarHeight.value : 0
}

/** Add a window size change event listener before the component is mounted */
onBeforeMount(() => {
  window.addEventListener('resize', getScrollbarHeight)
})

/** Calculate the scroll viewport height immediately when the component is mounted */
onMounted(() => {
  getScrollbarHeight()
})

/** Remove the window size change event listener before the component is unmounted */
onBeforeUnmount(() => {
  window.removeEventListener('resize', getScrollbarHeight)
})

defineExpose({ getScrollTop })
</script>

<template>
  <!-- The outer div cannot be deleted, it is used to receive the click event of the parent component -->
  <div>
    <div
      v-for="(item, index) in list"
      :key="index"
      :ref="`resultItemRef${index}`"
      class="result-item"
      :style="itemStyle(item)"
      @mouseenter="handleMouseenter(item)"
    >
      <SvgIcon v-if="item.meta?.svgIcon" :name="item.meta.svgIcon" />
      <component v-else-if="item.meta?.elIcon" :is="item.meta.elIcon" class="el-icon" />
      <span class="result-item-title">
        {{ $t('router.' + item.meta?.title) }}
      </span>
      <SvgIcon v-if="modelValue && modelValue === item.name" name="keyboard-enter" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result-item {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 15px;
  margin-top: 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  .svg-icon {
    min-width: 1em;
    font-size: 18px;
  }
  .el-icon {
    width: 1em;
    font-size: 18px;
  }
  &-title {
    flex: 1;
    margin-left: 12px;
  }
}
</style>
