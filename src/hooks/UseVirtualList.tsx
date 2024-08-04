import { reactive } from "vue";

interface Props {
  listData?: any[];
  itemSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  listData: () => [],
  itemSize: 200,
});

const UseVirtualList = () => {
  const visibleData: any[] = [],
    position = reactive({
      //可视区域高度
      screenHeight: 0,
      //偏移量
      startOffset: 0,
      //起始索引
      start: 0,
      //结束索引
      end: null,
    });
  console.log(props, position);

  return (
    <>
      {/* 可视区域 */}
      <div class="infinite-list-container">
        {/* 列表总高度 */}
        <div class="infinite-list-phantom"></div>
        {/* 渲染区域 */}
        <div class="infinite-list">
          {visibleData.map((item: any) => {
            return (
              <div
                class="infinite-list-item"
                key={item.id}
                style={{ height: props.itemSize + "px", lineHeight: props.itemSize + "px" }}
              ></div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default UseVirtualList;
