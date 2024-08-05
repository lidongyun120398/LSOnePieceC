<template>
  <div class="home">
    <!-- <UseUpload /> -->
    <virtual-list :list-data="listData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// import UseUpload from "@/hooks/UseUpload";
import VirtualList from "@/components/VirtualList";

const listData = ref<Record<string, number>[]>([]);

onMounted(() => {
  for (let i = 0; i < 100000; i++) {
    listData.value.push({ id: i, value: i });
  }
});
</script>

<style scoped lang="scss"></style>
