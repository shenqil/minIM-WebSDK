<template>
  <a-space wrap>
    <a-button type="primary">Primary Button</a-button>
    <a-button>Default Button</a-button>
    <a-button type="dashed">Dashed Button</a-button>
    <a-button type="text">Text Button</a-button>
    <a-button type="link">Link Button</a-button>
  </a-space>
</template>


<script setup lang="ts">
import {onMounted} from 'vue'
import * as minIm from "min-im"

console.log(minIm.create)

onMounted(()=>{
  // imInstance = create({brokerUrl: ''})
  // console.log(`[init] 创建IM实例`,imInstance)
})

</script>



<style scoped></style>
