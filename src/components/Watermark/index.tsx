import { defineComponent, ExtractPublicPropTypes, type CSSProperties, type PropType } from "vue";

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
  getContainer: () => HTMLElement,
} as const;

export type WatermarkProps = ExtractPublicPropTypes<typeof watermarkProps>;

export default defineComponent({
  name: "Watermark",
  props: watermarkProps,
  setup() {
    return () => {};
  },
});
