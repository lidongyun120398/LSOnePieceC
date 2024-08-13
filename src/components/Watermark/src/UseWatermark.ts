import { ref, watchEffect, toRaw } from "vue";

import { WatermarkProps } from "..";
import { merge } from "lodash-es";

import { getCanvasData, getMergedOptions } from "./watermarkUtils";

export type WatermarkOptions = Omit<WatermarkProps, "className" | "style" | "children">;

const useWatermark = (params: WatermarkOptions) => {
  const options = ref(params);

  const mergedOptions = getMergedOptions(toRaw(options.value));
  const watermarkDiv = ref<InstanceType<typeof HTMLDivElement>>();
  const mutationObserver = ref<MutationObserver>();

  const container = mergedOptions.getContainer();
  const { zIndex, gap } = mergedOptions;

  const drawWatermark = () => {
    if (!container) {
      return;
    }

    getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {
      const offsetLeft = mergedOptions.offset[0] + "px";
      const offsetTop = mergedOptions.offset[1] + "px";

      const wmStyle = `
      width:100%;
      height:100%;
      position:absolute;
      top:${offsetTop};
      left:${offsetLeft};
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

      if (container) {
        mutationObserver.value?.disconnect();

        mutationObserver.value = new MutationObserver((mutations) => {
          const isChanged = mutations.some((mutation) => {
            let flag = false;
            if (mutation.removedNodes.length) {
              flag = Array.from(mutation.removedNodes).some((node) => node === watermarkDiv.value);
            }
            if (mutation.type === "attributes" && mutation.target === watermarkDiv.value) {
              flag = true;
            }
            return flag;
          });
          if (isChanged) {
            watermarkDiv.value = undefined;
            drawWatermark();
          }
        });

        mutationObserver.value.observe(container, {
          attributes: true,
          subtree: true,
          childList: true,
        });
      }
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
