<template>
  <div class="home">
    <!-- <UseUpload /> -->
    <Watermark content="李东运">
      <virtual-list v-if="listData.length" :list-data="listData" />
    </Watermark>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// import UseUpload from "@/hooks/UseUpload";
import VirtualList from "@/components/VirtualList";
import Watermark from "@/components/Watermark";

import { fakerDE as faker } from "@faker-js/faker";

const listData = ref<Record<string, string | number>[]>([]);

onMounted(() => {
  for (let i = 0; i < 1000; i++) {
    listData.value.push({ id: i, value: faker.lorem.sentences() });
  }
});
</script>

<style scoped lang="scss"></style>
