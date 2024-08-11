<template>
  <div ref="listRef" class="infinite-list-container" @scroll="scrollEvent()">
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div
        v-for="item in visibleData"
        ref="items"
        :key="item.id"
        class="infinite-list-item"
        :style="{ height: props.itemSize + 'px', lineHeight: props.itemSize + 'px' }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, toRefs, onMounted } from "vue";

interface IProps {
  listData?: any[];
  itemSize?: number;
}

interface IData {
  screenHeight: number;
  startOffset: number;
  start: number;
  end: number | null;
}

const props = withDefaults(defineProps<IProps>(), {
  listData: () => [],
  itemSize: 100,
});

const data = reactive<IData>({
  //可视区域高度
  screenHeight: 0,
  //偏移量
  startOffset: 0,
  //起始索引
  start: 0,
  //结束索引
  end: null,
});

const { listData, itemSize } = toRefs(props);
//列表总高度
const listHeight = computed(() => listData.value.length * itemSize.value);
//可显示的列表项数
const visibleCount = computed(() => Math.ceil(data.screenHeight / itemSize.value));
//偏移量对应的style
const getTransform = computed(() => `translate3d(0,${data.startOffset}px,0)`);
//获取真实显示列表数据
const visibleData = computed(() =>
  listData.value.slice(data.start, Math.min(data.end as number, listData.value.length)),
);
const listRef = ref<InstanceType<typeof HTMLDivElement>>();

const scrollEvent = () => {
  let scrollTop = listRef!.value!.scrollTop;
  //此时的开始索引
  data.start = Math.floor(scrollTop / itemSize.value);
  //此时的结束索引
  data.end = data.start + visibleCount.value;
  //此时的偏移量
  data.startOffset = scrollTop - (scrollTop % itemSize.value);
};

onMounted(() => {
  data.screenHeight = listRef!.value!.clientHeight;
  console.log(data.screenHeight);
  data.start = 0;
  data.end = data.start + visibleCount.value;
});
</script>

<style scoped>
.infinite-list-container {
  height: 100vh;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
