<template>
<div class="main">
  <CBanner/>
  <telephone/>
  <meny/>
  <feature-cards/>
  <brandesmap/>
</div>


</template>
<script setup lang="ts">
import CBanner from '@/components/sections/CBanner.vue';
import Telephone from '@/components/card/Telephone.vue';
import FeatureCards from '@/components/FeatureCards.vue';
import Brandesmap from '@/components/location/Brandesmap.vue';
import Meny from '@/components/card/Meny.vue';
</script>
<style scoped>
.main{
  overflow: hidden;
}
</style>