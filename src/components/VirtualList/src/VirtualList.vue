<template>
  <div ref="listRef" class="infinite-list-container" @scroll="scrollEvent()">
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <div ref="infiniteRef" class="infinite-list" :style="{ transform: getTransform }">
      <div v-for="item in visibleData" :ref="(el) => setItemRef(el)" :key="item.id" class="infinite-list-item">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, toRefs, onMounted, onUpdated, nextTick } from "vue";

interface IProps {
  listData?: any[];
  estimatedItemSize?: number;
}

interface IData {
  screenHeight: number;
  startOffset: number;
  start: number;
  end: number | null;
}

const props = withDefaults(defineProps<IProps>(), {
  listData: () => [],
  estimatedItemSize: 100,
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

const listRef = ref<InstanceType<typeof HTMLDivElement>>();
const infiniteRef = ref<InstanceType<typeof HTMLDivElement>>();
const itemsRef = ref<(InstanceType<typeof HTMLDivElement> | null)[]>([]);

//存储每一条的高度信息以及位置
let positions = ref<{ index: number; height: number; top: number; bottom: number }[]>([]);
const { listData, estimatedItemSize } = toRefs(props);
const initPositions = () => {
  positions.value = listData.value.map((_, index) => {
    return {
      index,
      height: estimatedItemSize.value,
      top: index * estimatedItemSize.value,
      bottom: (index + 1) * estimatedItemSize.value,
    };
  });
};
initPositions();

//列表总高度:因为高度不确定，所以获取整个列表高度的方式由注释掉的改为新的
// const listHeight = computed(() => listData.value.length * itemSize.value);
const listHeight = computed(() => positions.value[positions.value.length - 1]?.bottom);
//可显示的列表项数
const visibleCount = computed(() => Math.ceil(data.screenHeight / estimatedItemSize.value));
//偏移量对应的style
const getTransform = computed(() => `translate3d(0,${data.startOffset}px,0)`);
//获取真实显示列表数据
const visibleData = computed(() =>
  listData.value.slice(data.start, Math.min(data.end as number, listData.value.length)),
);

const setItemRef = (el: any) => {
  if (el) itemsRef.value.push(el);
};

const scrollEvent = () => {
  let scrollTop = listRef!.value!.scrollTop;
  //此时的开始索引
  // data.start = Math.floor(scrollTop / itemSize.value);
  data.start = getStartIndex(scrollTop);
  //此时的结束索引
  data.end = data.start + visibleCount.value;
  //此时的偏移量
  // data.startOffset = scrollTop - (scrollTop % itemSize.value);
  data.startOffset = data.start >= 1 ? positions.value[data.start - 1].bottom : 0;
};

const updateItemsSize = () => {
  let nodes = itemsRef.value;
  nodes!.forEach((node) => {
    let rect = node!.getBoundingClientRect();
    let height = rect.height;
    let index = +node!.id.slice(1);
    let oldHeight = positions.value[index].height;
    let dValue = oldHeight - height;
    //存在差值
    if (dValue) {
      positions.value[index].bottom = positions.value[index].bottom - dValue;
      positions.value[index].height = height;
      for (let k = index + 1; k < positions.value.length; k++) {
        positions.value[k].top = positions.value[k - 1].bottom;
        positions.value[k].bottom = positions.value[k].bottom - dValue;
      }
    }
  });
};

//二分查找来获取开始索引
const getStartIndex = (scrollTop = 0): number => {
  return binarySearch(positions.value, scrollTop);
};
//二分法查找
const binarySearch = (
  list: { index: number; height: number; top: number; bottom: number }[],
  value: number,
): number => {
  let start = 0;
  let end = list.length - 1;
  let tempIndex = null;
  while (start <= end) {
    let midIndex = parseInt((start + end) / 2 + "");
    let midValue = list[midIndex].bottom;
    if (midValue === value) {
      return midIndex + 1;
    } else if (midValue < value) {
      start = midIndex + 1;
    } else if (midValue > value) {
      if (tempIndex === null || tempIndex > midIndex) {
        tempIndex = midIndex;
      }
      end = midIndex - 1;
    }
  }
  return tempIndex as number;
};

onUpdated(() => {
  nextTick(() => {
    if (itemsRef?.value?.length) return;

    updateItemsSize();
  });
});

onMounted(() => {
  data.screenHeight = listRef!.value!.clientHeight;
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
