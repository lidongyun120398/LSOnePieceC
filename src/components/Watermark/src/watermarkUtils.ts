import { WatermarkOptions } from "./UseWatermark";

//判断参数是否为number
export function isNumber(obj: any): obj is number {
  return Object.prototype.toString.call(obj) === "[object Number]" && obj === obj;
}

//将数据转为number
export const toNumber = (value?: string | number, defaultValue?: number) => {
  if (value === undefined) {
    return defaultValue;
  }
  if (isNumber(value)) {
    return value;
  }
  const numberVal = parseFloat(value);
  return isNumber(numberVal) ? numberVal : defaultValue;
};

//默认生成的options
const defaultOptions = {
  rotate: -20,
  zIndex: 1,
  width: 100,
  gap: [100, 100],
  fontStyle: {
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.15)",
    fontFamily: "sans-serif",
    fontWeight: "normal",
  },
  offset: [0, 0],
  getContainer: Element,
};

//合并默认options和传入的options
export const getMergedOptions = (o: Partial<WatermarkOptions>) => {
  const options = o || {};

  const mergedOptions = {
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
    width: toNumber(options.width, options.image ? defaultOptions.width : undefined),
    height: toNumber(options.height, undefined)!,
    getContainer: options.getContainer!,
    gap: [
      toNumber(options.gap?.[0], defaultOptions.gap[0]),
      toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1]),
    ],
    offset: options.offset || defaultOptions.offset,
  } as Required<WatermarkOptions>;

  const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!;
  const mergedOffsetY = toNumber(mergedOptions.offset?.[1] || mergedOptions.offset?.[0], 0)!;
  while (mergedOptions.offset?.length > 0) {
    mergedOptions.offset.pop();
  }
  mergedOptions.offset?.push(mergedOffsetX);
  mergedOptions.offset?.push(mergedOffsetY);

  return mergedOptions;
};

//在没有传入width和height的情况下自己自己算生成水印的尺寸
export const measureTextSize = (ctx: CanvasRenderingContext2D, content: string[], rotate: number) => {
  let width = 0;
  let height = 0;
  const lineSize: Array<{ width: number; height: number }> = [];

  content.forEach((item) => {
    const { width: textWidth, fontBoundingBoxAscent, fontBoundingBoxDescent } = ctx.measureText(item);

    const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

    if (textWidth > width) {
      width = textWidth;
    }

    height += textHeight;
    lineSize.push({ height: textHeight, width: textWidth });
  });

  const angle = (rotate * Math.PI) / 180;

  return {
    originWidth: width,
    originHeight: height,
    width: Math.ceil(Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)),
    height: Math.ceil(Math.abs(Math.sin(angle) * width) + Math.abs(height * Math.cos(angle))),
    lineSize,
  };
};

//绘制Canvas
export const getCanvasData = async (
  options: Required<WatermarkOptions>,
): Promise<{ width: number; height: number; base64Url: string }> => {
  const { rotate, image, content, fontStyle, gap } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const ratio = window.devicePixelRatio;

  const configCanvas = (size: { width: number; height: number }) => {
    const canvasWidth = gap[0] + size.width;
    const canvasHeight = gap[1] + size.height;

    canvas.setAttribute("width", `${canvasWidth * ratio}px`);
    canvas.setAttribute("height", `${canvasHeight * ratio}px`);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2);
    ctx.scale(ratio, ratio);

    const RotateAngle = (rotate * Math.PI) / 180;
    ctx.rotate(RotateAngle);
  };

  //绘制图片
  function drawImage() {
    return new Promise<{ width: number; height: number; base64Url: string }>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";

      img.src = image;
      img.onload = () => {
        let { width, height } = options;
        if (!width || !height) {
          if (width) {
            height = (img.height / img.width) * +width;
          } else {
            width = (img.width / img.height) * +height;
          }
        }
        configCanvas({ width, height });

        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        return resolve({ base64Url: canvas.toDataURL(), width, height });
      };
      img.onerror = () => {
        return drawText();
      };
    });
  }

  //绘制文字
  const drawText = () => {
    const { fontSize, color, fontWeight, fontFamily } = fontStyle;
    const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize;

    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    const measureSize = measureTextSize(ctx, [...content], rotate);

    const width = options.width || measureSize.width;
    const height = options.height || measureSize.height;

    configCanvas({ width, height });

    ctx.fillStyle = color!;
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    ctx.textBaseline = "top";

    [...content].forEach((item, index) => {
      const { height: lineHeight, width: lineWidth } = measureSize.lineSize[index];

      // const xStartPoint = -lineWidth / 2;
      // const yStartPoint = -(options.height || measureSize.originHeight) / 2 + lineHeight * index;

      const xStartPoint = -lineWidth / 2;
      const yStartPoint = -(options.height || measureSize.originHeight) / 2 + lineHeight * index;

      ctx.fillText(item, xStartPoint, yStartPoint, options.width || measureSize.originWidth);
    });
    return Promise.resolve({ base64Url: canvas.toDataURL(), height, width });
  };

  return image ? drawImage() : drawText();
};
