<script lang="ts" setup>
import { SelectOptionModel } from '@/@types/common'
import { renderColorByValue, renderLabelByValue } from '@/utils/common'
import { computed } from 'vue'

interface Props {
  options: SelectOptionModel[]
  status: string
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  status: ''
})
const color = computed(() => {
  return renderColorByValue(props.options, props.status)
})
</script>

<template>
  <div
    class="px-2 py-0.5 w-fit rounded-sm"
    :class="[`text-[${color?.text}] bg-[${color?.backgound}]`]"
    :style="{ color: color?.text, backgroundColor: color?.backgound }"
  >
    {{ renderLabelByValue(options, status) }}
  </div>
</template>
