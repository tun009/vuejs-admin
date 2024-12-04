<template>
  <!--  eslint-disable-next-line -->
  <!-- //NOSONAR --><div v-html="html.replace(/\n/g, '<br />')" />
</template>

<script setup lang="ts">

interface Props {
  html?: string
}

withDefaults(defineProps<Props>(), {
  html: ''
})
</script>
