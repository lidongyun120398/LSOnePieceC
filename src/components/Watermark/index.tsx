import {
  defineComponent,
  ExtractPublicPropTypes,
  type CSSProperties,
  type PropType,
  ref,
  computed,
  watch,
  onMounted,
} from "vue";
import useWatermark from "./src/UseWatermark";

interface IFontStyle {
  color?: string;
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
}

export const watermarkProps = {
  style: Object as PropType<CSSProperties>,
  className: String,
  zIndex: [Number, String] as PropType<string | number>,
  width: {
    type: Number,
    default: 32,
  },
  height: {
    type: Number,
    default: 32,
  },
  rotate: {
    type: Number,
    default: 40,
  },
  image: String,
  content: [String, Array] as PropType<string | string[]>,
  fontStyle: Object as PropType<IFontStyle>,
  gap: {
    type: Object as PropType<[number, number]>,
  },
  offset: {
    type: Object as PropType<[number, number]>,
  },
  getContainer: Function as PropType<() => HTMLElement>,
} as const;

export type WatermarkProps = ExtractPublicPropTypes<typeof watermarkProps>;

export default defineComponent({
  name: "Watermark",
  props: watermarkProps,
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { zIndex, width, height, rotate, image, content, fontStyle, gap, offset } = props;

    const containerRef = ref<InstanceType<typeof HTMLDivElement> | null>(null);
    // const getContainer = computed(() => (props.getContainer ? props.getContainer : containerRef.value!));

    onMounted(() => {
      const getContainer = () => {
        return props.getContainer ? props.getContainer() : containerRef.value!;
      };

      const combine = computed(() => {
        return {
          zIndex,
          width,
          height,
          rotate,
          image,
          content,
          fontStyle,
          gap,
          offset,
          getContainer,
        };
      });

      const { generateWatermark } = useWatermark({
        zIndex,
        width,
        height,
        rotate,
        image,
        content,
        fontStyle,
        gap,
        offset,
        getContainer,
      });

      watch(
        combine,
        (newValue) => {
          generateWatermark(newValue);
        },
        { immediate: true },
      );
    });

    return {
      containerRef,
    };
  },
  render() {
    const { className, style, $slots } = this;
    return (
      <div class={[className, "water"]} style={style} ref="containerRef">
        {$slots.default?.()}
      </div>
    );
  },
});
