<template>
<div>
    <CHeder/>
   <div>
     <router-view></router-view>
   </div>
  <computer/>

</div>
</template>
<script setup lang="ts">
import CHeder from '@/components/CHeder.vue';
import Computer from '@/components/Computer.vue';

</script>