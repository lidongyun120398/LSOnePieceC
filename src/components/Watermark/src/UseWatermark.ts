import { ref, watchEffect, toRaw } from "vue";

import { WatermarkProps } from "..";
import { merge } from "lodash-es";

import { getCanvasData, getMergedOptions } from "./watermarkUtils";

export type WatermarkOptions = Omit<WatermarkProps, "className" | "style" | "children">;

const useWatermark = (params: WatermarkOptions) => {
  const options = ref(params);

  const mergedOptions = getMergedOptions(toRaw(options.value));
  const watermarkDiv = ref<InstanceType<typeof HTMLDivElement>>();

  const container = mergedOptions.getContainer();
  const { zIndex, gap } = mergedOptions;

  const drawWatermark = () => {
    if (!container) {
      return;
    }

    getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {
      const wmStyle = `
      width:100%;
      height:100%;
      position:absolute;
      top:0;
      left:0;
      bottom:0;
      right:0;
      pointer-events: none;
      z-index:${zIndex};
      background-position: 0 0;
      background-size:${gap[0] + width}px ${gap[1] + height}px;
      background-repeat: repeat;
      background-image:url(${base64Url})`;

      if (!watermarkDiv.value) {
        const div = document.createElement("div");
        watermarkDiv.value = div;
        container.append(div);
        container.style.position = "relative";
      }

      watermarkDiv.value?.setAttribute("style", wmStyle.trim());
    });
  };

  watchEffect(() => {
    drawWatermark();
  });

  return {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      options.value = merge({}, options.value, newOptions);
    },
    destroy: () => {},
  };
};

export default useWatermark;
