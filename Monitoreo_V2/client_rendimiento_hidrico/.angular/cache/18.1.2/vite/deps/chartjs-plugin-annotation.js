import {
  Animations,
  Chart,
  Element,
  HALF_PI,
  PI,
  QUARTER_PI,
  RAD_PER_DEG,
  TAU,
  TWO_THIRDS_PI,
  addRoundedRectPath,
  callback,
  clipArea,
  defaults,
  defined,
  distanceBetweenPoints,
  isArray,
  isFunction,
  isNumber,
  isNumberFinite,
  isObject,
  toDegrees,
  toFont,
  toPadding,
  toRadians,
  toTRBLCorners,
  unclipArea,
  valueOrDefault
} from "./chunk-MC6V4B3W.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-RKE6QIOW.js";

// node_modules/chartjs-plugin-annotation/dist/chartjs-plugin-annotation.esm.js
var interaction = {
  modes: {
    /**
     * Point mode returns all elements that hit test based on the event position
     * @param {Object} state - the state of the plugin
     * @param {ChartEvent} event - the event we are find things at
     * @return {AnnotationElement[]} - elements that are found
     */
    point(state, event) {
      return filterElements(state, event, {
        intersect: true
      });
    },
    /**
     * Nearest mode returns the element closest to the event position
     * @param {Object} state - the state of the plugin
     * @param {ChartEvent} event - the event we are find things at
     * @param {Object} options - interaction options to use
     * @return {AnnotationElement[]} - elements that are found (only 1 element)
     */
    nearest(state, event, options) {
      return getNearestItem(state, event, options);
    },
    /**
     * x mode returns the elements that hit-test at the current x coordinate
     * @param {Object} state - the state of the plugin
     * @param {ChartEvent} event - the event we are find things at
     * @param {Object} options - interaction options to use
     * @return {AnnotationElement[]} - elements that are found
     */
    x(state, event, options) {
      return filterElements(state, event, {
        intersect: options.intersect,
        axis: "x"
      });
    },
    /**
     * y mode returns the elements that hit-test at the current y coordinate
     * @param {Object} state - the state of the plugin
     * @param {ChartEvent} event - the event we are find things at
     * @param {Object} options - interaction options to use
     * @return {AnnotationElement[]} - elements that are found
     */
    y(state, event, options) {
      return filterElements(state, event, {
        intersect: options.intersect,
        axis: "y"
      });
    }
  }
};
function getElements(state, event, options) {
  const mode = interaction.modes[options.mode] || interaction.modes.nearest;
  return mode(state, event, options);
}
function inRangeByAxis(element, event, axis) {
  if (axis !== "x" && axis !== "y") {
    return element.inRange(event.x, event.y, "x", true) || element.inRange(event.x, event.y, "y", true);
  }
  return element.inRange(event.x, event.y, axis, true);
}
function getPointByAxis(event, center, axis) {
  if (axis === "x") {
    return {
      x: event.x,
      y: center.y
    };
  } else if (axis === "y") {
    return {
      x: center.x,
      y: event.y
    };
  }
  return center;
}
function filterElements(state, event, options) {
  return state.visibleElements.filter((element) => options.intersect ? element.inRange(event.x, event.y) : inRangeByAxis(element, event, options.axis));
}
function getNearestItem(state, event, options) {
  let minDistance = Number.POSITIVE_INFINITY;
  return filterElements(state, event, options).reduce((nearestItems, element) => {
    const center = element.getCenterPoint();
    const evenPoint = getPointByAxis(event, center, options.axis);
    const distance = distanceBetweenPoints(event, evenPoint);
    if (distance < minDistance) {
      nearestItems = [element];
      minDistance = distance;
    } else if (distance === minDistance) {
      nearestItems.push(element);
    }
    return nearestItems;
  }, []).sort((a, b) => a._index - b._index).slice(0, 1);
}
var isOlderPart = (act, req) => req > act || act.length > req.length && act.slice(0, req.length) === req;
var EPSILON = 1e-3;
var clamp = (x, from, to) => Math.min(to, Math.max(from, x));
function clampAll(obj, from, to) {
  for (const key of Object.keys(obj)) {
    obj[key] = clamp(obj[key], from, to);
  }
  return obj;
}
function inPointRange(point, center, radius, borderWidth) {
  if (!point || !center || radius <= 0) {
    return false;
  }
  const hBorderWidth = borderWidth / 2;
  return Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2) <= Math.pow(radius + hBorderWidth, 2);
}
function inBoxRange(point, {
  x,
  y,
  x2,
  y2
}, axis, borderWidth) {
  const hBorderWidth = borderWidth / 2;
  const inRangeX = point.x >= x - hBorderWidth - EPSILON && point.x <= x2 + hBorderWidth + EPSILON;
  const inRangeY = point.y >= y - hBorderWidth - EPSILON && point.y <= y2 + hBorderWidth + EPSILON;
  if (axis === "x") {
    return inRangeX;
  } else if (axis === "y") {
    return inRangeY;
  }
  return inRangeX && inRangeY;
}
function getElementCenterPoint(element, useFinalPosition) {
  const {
    centerX,
    centerY
  } = element.getProps(["centerX", "centerY"], useFinalPosition);
  return {
    x: centerX,
    y: centerY
  };
}
function requireVersion(pkg, min, ver, strict = true) {
  const parts = ver.split(".");
  let i = 0;
  for (const req of min.split(".")) {
    const act = parts[i++];
    if (parseInt(req, 10) < parseInt(act, 10)) {
      break;
    }
    if (isOlderPart(act, req)) {
      if (strict) {
        throw new Error(`${pkg} v${ver} is not supported. v${min} or newer is required.`);
      } else {
        return false;
      }
    }
  }
  return true;
}
var isPercentString = (s) => typeof s === "string" && s.endsWith("%");
var toPercent = (s) => parseFloat(s) / 100;
var toPositivePercent = (s) => clamp(toPercent(s), 0, 1);
var boxAppering = (x, y) => ({
  x,
  y,
  x2: x,
  y2: y,
  width: 0,
  height: 0
});
var defaultInitAnimation = {
  box: (properties) => boxAppering(properties.centerX, properties.centerY),
  ellipse: (properties) => ({
    centerX: properties.centerX,
    centerY: properties.centerX,
    radius: 0,
    width: 0,
    height: 0
  }),
  label: (properties) => boxAppering(properties.centerX, properties.centerY),
  line: (properties) => boxAppering(properties.x, properties.y),
  point: (properties) => ({
    centerX: properties.centerX,
    centerY: properties.centerY,
    radius: 0,
    width: 0,
    height: 0
  }),
  polygon: (properties) => boxAppering(properties.centerX, properties.centerY)
};
function getRelativePosition2(size, position) {
  if (position === "start") {
    return 0;
  }
  if (position === "end") {
    return size;
  }
  if (isPercentString(position)) {
    return toPositivePercent(position) * size;
  }
  return size / 2;
}
function getSize(size, value, positivePercent = true) {
  if (typeof value === "number") {
    return value;
  } else if (isPercentString(value)) {
    return (positivePercent ? toPositivePercent(value) : toPercent(value)) * size;
  }
  return size;
}
function calculateTextAlignment(size, options) {
  const {
    x,
    width
  } = size;
  const textAlign = options.textAlign;
  if (textAlign === "center") {
    return x + width / 2;
  } else if (textAlign === "end" || textAlign === "right") {
    return x + width;
  }
  return x;
}
function toPosition(value, defaultValue = "center") {
  if (isObject(value)) {
    return {
      x: valueOrDefault(value.x, defaultValue),
      y: valueOrDefault(value.y, defaultValue)
    };
  }
  value = valueOrDefault(value, defaultValue);
  return {
    x: value,
    y: value
  };
}
function isBoundToPoint(options) {
  return options && (defined(options.xValue) || defined(options.yValue));
}
function initAnimationProperties(chart, properties, options) {
  const initAnim = options.init;
  if (!initAnim) {
    return;
  } else if (initAnim === true) {
    return applyDefault(properties, options);
  }
  return execCallback(chart, properties, options);
}
function loadHooks(options, hooks2, hooksContainer) {
  let activated = false;
  hooks2.forEach((hook) => {
    if (isFunction(options[hook])) {
      activated = true;
      hooksContainer[hook] = options[hook];
    } else if (defined(hooksContainer[hook])) {
      delete hooksContainer[hook];
    }
  });
  return activated;
}
function applyDefault(properties, options) {
  const type = options.type || "line";
  return defaultInitAnimation[type](properties);
}
function execCallback(chart, properties, options) {
  const result = callback(options.init, [{
    chart,
    properties,
    options
  }]);
  if (result === true) {
    return applyDefault(properties, options);
  } else if (isObject(result)) {
    return result;
  }
}
var widthCache = /* @__PURE__ */ new Map();
var notRadius = (radius) => isNaN(radius) || radius <= 0;
var fontsKey = (fonts) => fonts.reduce(function(prev, item) {
  prev += item.string;
  return prev;
}, "");
function isImageOrCanvas(content) {
  if (content && typeof content === "object") {
    const type = content.toString();
    return type === "[object HTMLImageElement]" || type === "[object HTMLCanvasElement]";
  }
}
function translate(ctx, {
  x,
  y
}, rotation) {
  if (rotation) {
    ctx.translate(x, y);
    ctx.rotate(toRadians(rotation));
    ctx.translate(-x, -y);
  }
}
function setBorderStyle(ctx, options) {
  if (options && options.borderWidth) {
    ctx.lineCap = options.borderCapStyle;
    ctx.setLineDash(options.borderDash);
    ctx.lineDashOffset = options.borderDashOffset;
    ctx.lineJoin = options.borderJoinStyle;
    ctx.lineWidth = options.borderWidth;
    ctx.strokeStyle = options.borderColor;
    return true;
  }
}
function setShadowStyle(ctx, options) {
  ctx.shadowColor = options.backgroundShadowColor;
  ctx.shadowBlur = options.shadowBlur;
  ctx.shadowOffsetX = options.shadowOffsetX;
  ctx.shadowOffsetY = options.shadowOffsetY;
}
function measureLabelSize(ctx, options) {
  const content = options.content;
  if (isImageOrCanvas(content)) {
    return {
      width: getSize(content.width, options.width),
      height: getSize(content.height, options.height)
    };
  }
  const optFont = options.font;
  const fonts = isArray(optFont) ? optFont.map((f) => toFont(f)) : [toFont(optFont)];
  const strokeWidth = options.textStrokeWidth;
  const lines = isArray(content) ? content : [content];
  const mapKey = lines.join() + fontsKey(fonts) + strokeWidth + (ctx._measureText ? "-spriting" : "");
  if (!widthCache.has(mapKey)) {
    widthCache.set(mapKey, calculateLabelSize(ctx, lines, fonts, strokeWidth));
  }
  return widthCache.get(mapKey);
}
function drawBox(ctx, rect, options) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  ctx.save();
  setShadowStyle(ctx, options);
  const stroke = setBorderStyle(ctx, options);
  ctx.fillStyle = options.backgroundColor;
  ctx.beginPath();
  addRoundedRectPath(ctx, {
    x,
    y,
    w: width,
    h: height,
    radius: clampAll(toTRBLCorners(options.borderRadius), 0, Math.min(width, height) / 2)
  });
  ctx.closePath();
  ctx.fill();
  if (stroke) {
    ctx.shadowColor = options.borderShadowColor;
    ctx.stroke();
  }
  ctx.restore();
}
function drawLabel(ctx, rect, options) {
  const content = options.content;
  if (isImageOrCanvas(content)) {
    ctx.save();
    ctx.globalAlpha = getOpacity(options.opacity, content.style.opacity);
    ctx.drawImage(content, rect.x, rect.y, rect.width, rect.height);
    ctx.restore();
    return;
  }
  const labels = isArray(content) ? content : [content];
  const optFont = options.font;
  const fonts = isArray(optFont) ? optFont.map((f) => toFont(f)) : [toFont(optFont)];
  const optColor = options.color;
  const colors = isArray(optColor) ? optColor : [optColor];
  const x = calculateTextAlignment(rect, options);
  const y = rect.y + options.textStrokeWidth / 2;
  ctx.save();
  ctx.textBaseline = "middle";
  ctx.textAlign = options.textAlign;
  if (setTextStrokeStyle(ctx, options)) {
    applyLabelDecoration(ctx, {
      x,
      y
    }, labels, fonts);
  }
  applyLabelContent(ctx, {
    x,
    y
  }, labels, {
    fonts,
    colors
  });
  ctx.restore();
}
function setTextStrokeStyle(ctx, options) {
  if (options.textStrokeWidth > 0) {
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.lineWidth = options.textStrokeWidth;
    ctx.strokeStyle = options.textStrokeColor;
    return true;
  }
}
function drawPoint2(ctx, element, x, y) {
  const {
    radius,
    options
  } = element;
  const style = options.pointStyle;
  const rotation = options.rotation;
  let rad = (rotation || 0) * RAD_PER_DEG;
  if (isImageOrCanvas(style)) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rad);
    ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
    ctx.restore();
    return;
  }
  if (notRadius(radius)) {
    return;
  }
  drawPointStyle(ctx, {
    x,
    y,
    radius,
    rotation,
    style,
    rad
  });
}
function drawPointStyle(ctx, {
  x,
  y,
  radius,
  rotation,
  style,
  rad
}) {
  let xOffset, yOffset, size, cornerRadius;
  ctx.beginPath();
  switch (style) {
    default:
      ctx.arc(x, y, radius, 0, TAU);
      ctx.closePath();
      break;
    case "triangle":
      ctx.moveTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
      rad += TWO_THIRDS_PI;
      ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
      rad += TWO_THIRDS_PI;
      ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
      ctx.closePath();
      break;
    case "rectRounded":
      cornerRadius = radius * 0.516;
      size = radius - cornerRadius;
      xOffset = Math.cos(rad + QUARTER_PI) * size;
      yOffset = Math.sin(rad + QUARTER_PI) * size;
      ctx.arc(x - xOffset, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
      ctx.arc(x + yOffset, y - xOffset, cornerRadius, rad - HALF_PI, rad);
      ctx.arc(x + xOffset, y + yOffset, cornerRadius, rad, rad + HALF_PI);
      ctx.arc(x - yOffset, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
      ctx.closePath();
      break;
    case "rect":
      if (!rotation) {
        size = Math.SQRT1_2 * radius;
        ctx.rect(x - size, y - size, 2 * size, 2 * size);
        break;
      }
      rad += QUARTER_PI;
    case "rectRot":
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + yOffset, y - xOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      ctx.lineTo(x - yOffset, y + xOffset);
      ctx.closePath();
      break;
    case "crossRot":
      rad += QUARTER_PI;
    case "cross":
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      ctx.moveTo(x + yOffset, y - xOffset);
      ctx.lineTo(x - yOffset, y + xOffset);
      break;
    case "star":
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      ctx.moveTo(x + yOffset, y - xOffset);
      ctx.lineTo(x - yOffset, y + xOffset);
      rad += QUARTER_PI;
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      ctx.moveTo(x + yOffset, y - xOffset);
      ctx.lineTo(x - yOffset, y + xOffset);
      break;
    case "line":
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      break;
    case "dash":
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(rad) * radius, y + Math.sin(rad) * radius);
      break;
  }
  ctx.fill();
}
function calculateLabelSize(ctx, lines, fonts, strokeWidth) {
  ctx.save();
  const count = lines.length;
  let width = 0;
  let height = strokeWidth;
  for (let i = 0; i < count; i++) {
    const font = fonts[Math.min(i, fonts.length - 1)];
    ctx.font = font.string;
    const text = lines[i];
    width = Math.max(width, ctx.measureText(text).width + strokeWidth);
    height += font.lineHeight;
  }
  ctx.restore();
  return {
    width,
    height
  };
}
function applyLabelDecoration(ctx, {
  x,
  y
}, labels, fonts) {
  ctx.beginPath();
  let lhs = 0;
  labels.forEach(function(l, i) {
    const f = fonts[Math.min(i, fonts.length - 1)];
    const lh = f.lineHeight;
    ctx.font = f.string;
    ctx.strokeText(l, x, y + lh / 2 + lhs);
    lhs += lh;
  });
  ctx.stroke();
}
function applyLabelContent(ctx, {
  x,
  y
}, labels, {
  fonts,
  colors
}) {
  let lhs = 0;
  labels.forEach(function(l, i) {
    const c = colors[Math.min(i, colors.length - 1)];
    const f = fonts[Math.min(i, fonts.length - 1)];
    const lh = f.lineHeight;
    ctx.beginPath();
    ctx.font = f.string;
    ctx.fillStyle = c;
    ctx.fillText(l, x, y + lh / 2 + lhs);
    lhs += lh;
    ctx.fill();
  });
}
function getOpacity(value, elementValue) {
  const opacity = isNumber(value) ? value : elementValue;
  return isNumber(opacity) ? clamp(opacity, 0, 1) : 1;
}
var limitedLineScale = {
  xScaleID: {
    min: "xMin",
    max: "xMax",
    start: "left",
    end: "right",
    startProp: "x",
    endProp: "x2"
  },
  yScaleID: {
    min: "yMin",
    max: "yMax",
    start: "bottom",
    end: "top",
    startProp: "y",
    endProp: "y2"
  }
};
function scaleValue(scale, value, fallback) {
  value = typeof value === "number" ? value : scale.parse(value);
  return isNumberFinite(value) ? scale.getPixelForValue(value) : fallback;
}
function retrieveScaleID(scales, options, key) {
  const scaleID = options[key];
  if (scaleID || key === "scaleID") {
    return scaleID;
  }
  const axis = key.charAt(0);
  const axes = Object.values(scales).filter((scale) => scale.axis && scale.axis === axis);
  if (axes.length) {
    return axes[0].id;
  }
  return axis;
}
function getDimensionByScale(scale, options) {
  if (scale) {
    const reverse = scale.options.reverse;
    const start = scaleValue(scale, options.min, reverse ? options.end : options.start);
    const end = scaleValue(scale, options.max, reverse ? options.start : options.end);
    return {
      start,
      end
    };
  }
}
function getChartPoint(chart, options) {
  const {
    chartArea,
    scales
  } = chart;
  const xScale = scales[retrieveScaleID(scales, options, "xScaleID")];
  const yScale = scales[retrieveScaleID(scales, options, "yScaleID")];
  let x = chartArea.width / 2;
  let y = chartArea.height / 2;
  if (xScale) {
    x = scaleValue(xScale, options.xValue, xScale.left + xScale.width / 2);
  }
  if (yScale) {
    y = scaleValue(yScale, options.yValue, yScale.top + yScale.height / 2);
  }
  return {
    x,
    y
  };
}
function resolveBoxProperties(chart, options) {
  const scales = chart.scales;
  const xScale = scales[retrieveScaleID(scales, options, "xScaleID")];
  const yScale = scales[retrieveScaleID(scales, options, "yScaleID")];
  if (!xScale && !yScale) {
    return {};
  }
  let {
    left: x,
    right: x2
  } = xScale || chart.chartArea;
  let {
    top: y,
    bottom: y2
  } = yScale || chart.chartArea;
  const xDim = getChartDimensionByScale(xScale, {
    min: options.xMin,
    max: options.xMax,
    start: x,
    end: x2
  });
  x = xDim.start;
  x2 = xDim.end;
  const yDim = getChartDimensionByScale(yScale, {
    min: options.yMin,
    max: options.yMax,
    start: y2,
    end: y
  });
  y = yDim.start;
  y2 = yDim.end;
  return {
    x,
    y,
    x2,
    y2,
    width: x2 - x,
    height: y2 - y,
    centerX: x + (x2 - x) / 2,
    centerY: y + (y2 - y) / 2
  };
}
function resolvePointProperties(chart, options) {
  if (!isBoundToPoint(options)) {
    const box = resolveBoxProperties(chart, options);
    let radius = options.radius;
    if (!radius || isNaN(radius)) {
      radius = Math.min(box.width, box.height) / 2;
      options.radius = radius;
    }
    const size = radius * 2;
    const adjustCenterX = box.centerX + options.xAdjust;
    const adjustCenterY = box.centerY + options.yAdjust;
    return {
      x: adjustCenterX - radius,
      y: adjustCenterY - radius,
      x2: adjustCenterX + radius,
      y2: adjustCenterY + radius,
      centerX: adjustCenterX,
      centerY: adjustCenterY,
      width: size,
      height: size,
      radius
    };
  }
  return getChartCircle(chart, options);
}
function resolveLineProperties(chart, options) {
  const {
    scales,
    chartArea
  } = chart;
  const scale = scales[options.scaleID];
  const area = {
    x: chartArea.left,
    y: chartArea.top,
    x2: chartArea.right,
    y2: chartArea.bottom
  };
  if (scale) {
    resolveFullLineProperties(scale, area, options);
  } else {
    resolveLimitedLineProperties(scales, area, options);
  }
  return area;
}
function resolveBoxAndLabelProperties(chart, options) {
  const properties = resolveBoxProperties(chart, options);
  properties.initProperties = initAnimationProperties(chart, properties, options);
  properties.elements = [{
    type: "label",
    optionScope: "label",
    properties: resolveLabelElementProperties$1(chart, properties, options),
    initProperties: properties.initProperties
  }];
  return properties;
}
function getChartCircle(chart, options) {
  const point = getChartPoint(chart, options);
  const size = options.radius * 2;
  return {
    x: point.x - options.radius + options.xAdjust,
    y: point.y - options.radius + options.yAdjust,
    x2: point.x + options.radius + options.xAdjust,
    y2: point.y + options.radius + options.yAdjust,
    centerX: point.x + options.xAdjust,
    centerY: point.y + options.yAdjust,
    radius: options.radius,
    width: size,
    height: size
  };
}
function getChartDimensionByScale(scale, options) {
  const result = getDimensionByScale(scale, options) || options;
  return {
    start: Math.min(result.start, result.end),
    end: Math.max(result.start, result.end)
  };
}
function resolveFullLineProperties(scale, area, options) {
  const min = scaleValue(scale, options.value, NaN);
  const max = scaleValue(scale, options.endValue, min);
  if (scale.isHorizontal()) {
    area.x = min;
    area.x2 = max;
  } else {
    area.y = min;
    area.y2 = max;
  }
}
function resolveLimitedLineProperties(scales, area, options) {
  for (const scaleId of Object.keys(limitedLineScale)) {
    const scale = scales[retrieveScaleID(scales, options, scaleId)];
    if (scale) {
      const {
        min,
        max,
        start,
        end,
        startProp,
        endProp
      } = limitedLineScale[scaleId];
      const dim = getDimensionByScale(scale, {
        min: options[min],
        max: options[max],
        start: scale[start],
        end: scale[end]
      });
      area[startProp] = dim.start;
      area[endProp] = dim.end;
    }
  }
}
function calculateX({
  properties,
  options
}, labelSize, position, padding) {
  const {
    x: start,
    x2: end,
    width: size
  } = properties;
  return calculatePosition$1({
    start,
    end,
    size,
    borderWidth: options.borderWidth
  }, {
    position: position.x,
    padding: {
      start: padding.left,
      end: padding.right
    },
    adjust: options.label.xAdjust,
    size: labelSize.width
  });
}
function calculateY({
  properties,
  options
}, labelSize, position, padding) {
  const {
    y: start,
    y2: end,
    height: size
  } = properties;
  return calculatePosition$1({
    start,
    end,
    size,
    borderWidth: options.borderWidth
  }, {
    position: position.y,
    padding: {
      start: padding.top,
      end: padding.bottom
    },
    adjust: options.label.yAdjust,
    size: labelSize.height
  });
}
function calculatePosition$1(boxOpts, labelOpts) {
  const {
    start,
    end,
    borderWidth
  } = boxOpts;
  const {
    position,
    padding: {
      start: padStart,
      end: padEnd
    },
    adjust
  } = labelOpts;
  const availableSize = end - borderWidth - start - padStart - padEnd - labelOpts.size;
  return start + borderWidth / 2 + adjust + getRelativePosition2(availableSize, position);
}
function resolveLabelElementProperties$1(chart, properties, options) {
  const label = options.label;
  label.backgroundColor = "transparent";
  label.callout.display = false;
  const position = toPosition(label.position);
  const padding = toPadding(label.padding);
  const labelSize = measureLabelSize(chart.ctx, label);
  const x = calculateX({
    properties,
    options
  }, labelSize, position, padding);
  const y = calculateY({
    properties,
    options
  }, labelSize, position, padding);
  const width = labelSize.width + padding.width;
  const height = labelSize.height + padding.height;
  return {
    x,
    y,
    x2: x + width,
    y2: y + height,
    width,
    height,
    centerX: x + width / 2,
    centerY: y + height / 2,
    rotation: label.rotation
  };
}
function rotated(point, center, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const cx = center.x;
  const cy = center.y;
  return {
    x: cx + cos * (point.x - cx) - sin * (point.y - cy),
    y: cy + sin * (point.x - cx) + cos * (point.y - cy)
  };
}
var moveHooks = ["enter", "leave"];
var eventHooks = moveHooks.concat("click");
function updateListeners(chart, state, options) {
  state.listened = loadHooks(options, eventHooks, state.listeners);
  state.moveListened = false;
  state._getElements = getElements;
  moveHooks.forEach((hook) => {
    if (isFunction(options[hook])) {
      state.moveListened = true;
    }
  });
  if (!state.listened || !state.moveListened) {
    state.annotations.forEach((scope) => {
      if (!state.listened && isFunction(scope.click)) {
        state.listened = true;
      }
      if (!state.moveListened) {
        moveHooks.forEach((hook) => {
          if (isFunction(scope[hook])) {
            state.listened = true;
            state.moveListened = true;
          }
        });
      }
    });
  }
}
function handleEvent(state, event, options) {
  if (state.listened) {
    switch (event.type) {
      case "mousemove":
      case "mouseout":
        return handleMoveEvents(state, event, options);
      case "click":
        return handleClickEvents(state, event, options);
    }
  }
}
function handleMoveEvents(state, event, options) {
  if (!state.moveListened) {
    return;
  }
  let elements;
  if (event.type === "mousemove") {
    elements = getElements(state, event, options.interaction);
  } else {
    elements = [];
  }
  const previous = state.hovered;
  state.hovered = elements;
  const context = {
    state,
    event
  };
  let changed = dispatchMoveEvents(context, "leave", previous, elements);
  return dispatchMoveEvents(context, "enter", elements, previous) || changed;
}
function dispatchMoveEvents({
  state,
  event
}, hook, elements, checkElements) {
  let changed;
  for (const element of elements) {
    if (checkElements.indexOf(element) < 0) {
      changed = dispatchEvent(element.options[hook] || state.listeners[hook], element, event) || changed;
    }
  }
  return changed;
}
function handleClickEvents(state, event, options) {
  const listeners = state.listeners;
  const elements = getElements(state, event, options.interaction);
  let changed;
  for (const element of elements) {
    changed = dispatchEvent(element.options.click || listeners.click, element, event) || changed;
  }
  return changed;
}
function dispatchEvent(handler, element, event) {
  return callback(handler, [element.$context, event]) === true;
}
var elementHooks = ["afterDraw", "beforeDraw"];
function updateHooks(chart, state, options) {
  const visibleElements = state.visibleElements;
  state.hooked = loadHooks(options, elementHooks, state.hooks);
  if (!state.hooked) {
    visibleElements.forEach((scope) => {
      if (!state.hooked) {
        elementHooks.forEach((hook) => {
          if (isFunction(scope.options[hook])) {
            state.hooked = true;
          }
        });
      }
    });
  }
}
function invokeHook(state, element, hook) {
  if (state.hooked) {
    const callbackHook = element.options[hook] || state.hooks[hook];
    return callback(callbackHook, [element.$context]);
  }
}
function adjustScaleRange(chart, scale, annotations) {
  const range = getScaleLimits(chart.scales, scale, annotations);
  let changed = changeScaleLimit(scale, range, "min", "suggestedMin");
  changed = changeScaleLimit(scale, range, "max", "suggestedMax") || changed;
  if (changed && isFunction(scale.handleTickRangeOptions)) {
    scale.handleTickRangeOptions();
  }
}
function verifyScaleOptions(annotations, scales) {
  for (const annotation2 of annotations) {
    verifyScaleIDs(annotation2, scales);
  }
}
function changeScaleLimit(scale, range, limit, suggestedLimit) {
  if (isNumberFinite(range[limit]) && !scaleLimitDefined(scale.options, limit, suggestedLimit)) {
    const changed = scale[limit] !== range[limit];
    scale[limit] = range[limit];
    return changed;
  }
}
function scaleLimitDefined(scaleOptions, limit, suggestedLimit) {
  return defined(scaleOptions[limit]) || defined(scaleOptions[suggestedLimit]);
}
function verifyScaleIDs(annotation2, scales) {
  for (const key of ["scaleID", "xScaleID", "yScaleID"]) {
    const scaleID = retrieveScaleID(scales, annotation2, key);
    if (scaleID && !scales[scaleID] && verifyProperties(annotation2, key)) {
      console.warn(`No scale found with id '${scaleID}' for annotation '${annotation2.id}'`);
    }
  }
}
function verifyProperties(annotation2, key) {
  if (key === "scaleID") {
    return true;
  }
  const axis = key.charAt(0);
  for (const prop of ["Min", "Max", "Value"]) {
    if (defined(annotation2[axis + prop])) {
      return true;
    }
  }
  return false;
}
function getScaleLimits(scales, scale, annotations) {
  const axis = scale.axis;
  const scaleID = scale.id;
  const scaleIDOption = axis + "ScaleID";
  const limits = {
    min: valueOrDefault(scale.min, Number.NEGATIVE_INFINITY),
    max: valueOrDefault(scale.max, Number.POSITIVE_INFINITY)
  };
  for (const annotation2 of annotations) {
    if (annotation2.scaleID === scaleID) {
      updateLimits(annotation2, scale, ["value", "endValue"], limits);
    } else if (retrieveScaleID(scales, annotation2, scaleIDOption) === scaleID) {
      updateLimits(annotation2, scale, [axis + "Min", axis + "Max", axis + "Value"], limits);
    }
  }
  return limits;
}
function updateLimits(annotation2, scale, props, limits) {
  for (const prop of props) {
    const raw = annotation2[prop];
    if (defined(raw)) {
      const value = scale.parse(raw);
      limits.min = Math.min(limits.min, value);
      limits.max = Math.max(limits.max, value);
    }
  }
}
var BoxAnnotation = class extends Element {
  inRange(mouseX, mouseY, axis, useFinalPosition) {
    const {
      x,
      y
    } = rotated({
      x: mouseX,
      y: mouseY
    }, this.getCenterPoint(useFinalPosition), toRadians(-this.options.rotation));
    return inBoxRange({
      x,
      y
    }, this.getProps(["x", "y", "x2", "y2"], useFinalPosition), axis, this.options.borderWidth);
  }
  getCenterPoint(useFinalPosition) {
    return getElementCenterPoint(this, useFinalPosition);
  }
  draw(ctx) {
    ctx.save();
    translate(ctx, this.getCenterPoint(), this.options.rotation);
    drawBox(ctx, this, this.options);
    ctx.restore();
  }
  get label() {
    return this.elements && this.elements[0];
  }
  resolveElementProperties(chart, options) {
    return resolveBoxAndLabelProperties(chart, options);
  }
};
BoxAnnotation.id = "boxAnnotation";
BoxAnnotation.defaults = {
  adjustScaleRange: true,
  backgroundShadowColor: "transparent",
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: "miter",
  borderRadius: 0,
  borderShadowColor: "transparent",
  borderWidth: 1,
  display: true,
  init: void 0,
  label: {
    backgroundColor: "transparent",
    borderWidth: 0,
    callout: {
      display: false
    },
    color: "black",
    content: null,
    display: false,
    drawTime: void 0,
    font: {
      family: void 0,
      lineHeight: void 0,
      size: void 0,
      style: void 0,
      weight: "bold"
    },
    height: void 0,
    opacity: void 0,
    padding: 6,
    position: "center",
    rotation: void 0,
    textAlign: "start",
    textStrokeColor: void 0,
    textStrokeWidth: 0,
    width: void 0,
    xAdjust: 0,
    yAdjust: 0,
    z: void 0
  },
  rotation: 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  z: 0
};
BoxAnnotation.defaultRoutes = {
  borderColor: "color",
  backgroundColor: "color"
};
BoxAnnotation.descriptors = {
  label: {
    _fallback: true
  }
};
var positions = ["left", "bottom", "top", "right"];
var LabelAnnotation = class extends Element {
  inRange(mouseX, mouseY, axis, useFinalPosition) {
    const {
      x,
      y
    } = rotated({
      x: mouseX,
      y: mouseY
    }, this.getCenterPoint(useFinalPosition), toRadians(-this.rotation));
    return inBoxRange({
      x,
      y
    }, this.getProps(["x", "y", "x2", "y2"], useFinalPosition), axis, this.options.borderWidth);
  }
  getCenterPoint(useFinalPosition) {
    return getElementCenterPoint(this, useFinalPosition);
  }
  draw(ctx) {
    const options = this.options;
    const visible = !defined(this._visible) || this._visible;
    if (!options.display || !options.content || !visible) {
      return;
    }
    ctx.save();
    translate(ctx, this.getCenterPoint(), this.rotation);
    drawCallout(ctx, this);
    drawBox(ctx, this, options);
    drawLabel(ctx, getLabelSize(this), options);
    ctx.restore();
  }
  resolveElementProperties(chart, options) {
    let point;
    if (!isBoundToPoint(options)) {
      const {
        centerX,
        centerY
      } = resolveBoxProperties(chart, options);
      point = {
        x: centerX,
        y: centerY
      };
    } else {
      point = getChartPoint(chart, options);
    }
    const padding = toPadding(options.padding);
    const labelSize = measureLabelSize(chart.ctx, options);
    const boxSize = measureRect(point, labelSize, options, padding);
    return __spreadProps(__spreadValues({
      initProperties: initAnimationProperties(chart, boxSize, options),
      pointX: point.x,
      pointY: point.y
    }, boxSize), {
      rotation: options.rotation
    });
  }
};
LabelAnnotation.id = "labelAnnotation";
LabelAnnotation.defaults = {
  adjustScaleRange: true,
  backgroundColor: "transparent",
  backgroundShadowColor: "transparent",
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: "miter",
  borderRadius: 0,
  borderShadowColor: "transparent",
  borderWidth: 0,
  callout: {
    borderCapStyle: "butt",
    borderColor: void 0,
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: "miter",
    borderWidth: 1,
    display: false,
    margin: 5,
    position: "auto",
    side: 5,
    start: "50%"
  },
  color: "black",
  content: null,
  display: true,
  font: {
    family: void 0,
    lineHeight: void 0,
    size: void 0,
    style: void 0,
    weight: void 0
  },
  height: void 0,
  init: void 0,
  opacity: void 0,
  padding: 6,
  position: "center",
  rotation: 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  textAlign: "center",
  textStrokeColor: void 0,
  textStrokeWidth: 0,
  width: void 0,
  xAdjust: 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  xValue: void 0,
  yAdjust: 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  yValue: void 0,
  z: 0
};
LabelAnnotation.defaultRoutes = {
  borderColor: "color"
};
function measureRect(point, size, options, padding) {
  const width = size.width + padding.width + options.borderWidth;
  const height = size.height + padding.height + options.borderWidth;
  const position = toPosition(options.position, "center");
  const x = calculatePosition(point.x, width, options.xAdjust, position.x);
  const y = calculatePosition(point.y, height, options.yAdjust, position.y);
  return {
    x,
    y,
    x2: x + width,
    y2: y + height,
    width,
    height,
    centerX: x + width / 2,
    centerY: y + height / 2
  };
}
function calculatePosition(start, size, adjust = 0, position) {
  return start - getRelativePosition2(size, position) + adjust;
}
function drawCallout(ctx, element) {
  const {
    pointX,
    pointY,
    options
  } = element;
  const callout = options.callout;
  const calloutPosition = callout && callout.display && resolveCalloutPosition(element, callout);
  if (!calloutPosition || isPointInRange(element, callout, calloutPosition)) {
    return;
  }
  ctx.save();
  ctx.beginPath();
  const stroke = setBorderStyle(ctx, callout);
  if (!stroke) {
    return ctx.restore();
  }
  const {
    separatorStart,
    separatorEnd
  } = getCalloutSeparatorCoord(element, calloutPosition);
  const {
    sideStart,
    sideEnd
  } = getCalloutSideCoord(element, calloutPosition, separatorStart);
  if (callout.margin > 0 || options.borderWidth === 0) {
    ctx.moveTo(separatorStart.x, separatorStart.y);
    ctx.lineTo(separatorEnd.x, separatorEnd.y);
  }
  ctx.moveTo(sideStart.x, sideStart.y);
  ctx.lineTo(sideEnd.x, sideEnd.y);
  const rotatedPoint = rotated({
    x: pointX,
    y: pointY
  }, element.getCenterPoint(), toRadians(-element.rotation));
  ctx.lineTo(rotatedPoint.x, rotatedPoint.y);
  ctx.stroke();
  ctx.restore();
}
function getCalloutSeparatorCoord(element, position) {
  const {
    x,
    y,
    x2,
    y2
  } = element;
  const adjust = getCalloutSeparatorAdjust(element, position);
  let separatorStart, separatorEnd;
  if (position === "left" || position === "right") {
    separatorStart = {
      x: x + adjust,
      y
    };
    separatorEnd = {
      x: separatorStart.x,
      y: y2
    };
  } else {
    separatorStart = {
      x,
      y: y + adjust
    };
    separatorEnd = {
      x: x2,
      y: separatorStart.y
    };
  }
  return {
    separatorStart,
    separatorEnd
  };
}
function getCalloutSeparatorAdjust(element, position) {
  const {
    width,
    height,
    options
  } = element;
  const adjust = options.callout.margin + options.borderWidth / 2;
  if (position === "right") {
    return width + adjust;
  } else if (position === "bottom") {
    return height + adjust;
  }
  return -adjust;
}
function getCalloutSideCoord(element, position, separatorStart) {
  const {
    y,
    width,
    height,
    options
  } = element;
  const start = options.callout.start;
  const side = getCalloutSideAdjust(position, options.callout);
  let sideStart, sideEnd;
  if (position === "left" || position === "right") {
    sideStart = {
      x: separatorStart.x,
      y: y + getSize(height, start)
    };
    sideEnd = {
      x: sideStart.x + side,
      y: sideStart.y
    };
  } else {
    sideStart = {
      x: separatorStart.x + getSize(width, start),
      y: separatorStart.y
    };
    sideEnd = {
      x: sideStart.x,
      y: sideStart.y + side
    };
  }
  return {
    sideStart,
    sideEnd
  };
}
function getCalloutSideAdjust(position, options) {
  const side = options.side;
  if (position === "left" || position === "top") {
    return -side;
  }
  return side;
}
function resolveCalloutPosition(element, options) {
  const position = options.position;
  if (positions.includes(position)) {
    return position;
  }
  return resolveCalloutAutoPosition(element, options);
}
function resolveCalloutAutoPosition(element, options) {
  const {
    x,
    y,
    x2,
    y2,
    width,
    height,
    pointX,
    pointY,
    centerX,
    centerY,
    rotation
  } = element;
  const center = {
    x: centerX,
    y: centerY
  };
  const start = options.start;
  const xAdjust = getSize(width, start);
  const yAdjust = getSize(height, start);
  const xPoints = [x, x + xAdjust, x + xAdjust, x2];
  const yPoints = [y + yAdjust, y2, y, y2];
  const result = [];
  for (let index = 0; index < 4; index++) {
    const rotatedPoint = rotated({
      x: xPoints[index],
      y: yPoints[index]
    }, center, toRadians(rotation));
    result.push({
      position: positions[index],
      distance: distanceBetweenPoints(rotatedPoint, {
        x: pointX,
        y: pointY
      })
    });
  }
  return result.sort((a, b) => a.distance - b.distance)[0].position;
}
function getLabelSize({
  x,
  y,
  width,
  height,
  options
}) {
  const hBorderWidth = options.borderWidth / 2;
  const padding = toPadding(options.padding);
  return {
    x: x + padding.left + hBorderWidth,
    y: y + padding.top + hBorderWidth,
    width: width - padding.left - padding.right - options.borderWidth,
    height: height - padding.top - padding.bottom - options.borderWidth
  };
}
function isPointInRange(element, callout, position) {
  const {
    pointX,
    pointY
  } = element;
  const margin = callout.margin;
  let x = pointX;
  let y = pointY;
  if (position === "left") {
    x += margin;
  } else if (position === "right") {
    x -= margin;
  } else if (position === "top") {
    y += margin;
  } else if (position === "bottom") {
    y -= margin;
  }
  return element.inRange(x, y);
}
var pointInLine = (p1, p2, t) => ({
  x: p1.x + t * (p2.x - p1.x),
  y: p1.y + t * (p2.y - p1.y)
});
var interpolateX = (y, p1, p2) => pointInLine(p1, p2, Math.abs((y - p1.y) / (p2.y - p1.y))).x;
var interpolateY = (x, p1, p2) => pointInLine(p1, p2, Math.abs((x - p1.x) / (p2.x - p1.x))).y;
var sqr = (v) => v * v;
var rangeLimit = (mouseX, mouseY, {
  x,
  y,
  x2,
  y2
}, axis) => axis === "y" ? {
  start: Math.min(y, y2),
  end: Math.max(y, y2),
  value: mouseY
} : {
  start: Math.min(x, x2),
  end: Math.max(x, x2),
  value: mouseX
};
var coordInCurve = (start, cp, end, t) => (1 - t) * (1 - t) * start + 2 * (1 - t) * t * cp + t * t * end;
var pointInCurve = (start, cp, end, t) => ({
  x: coordInCurve(start.x, cp.x, end.x, t),
  y: coordInCurve(start.y, cp.y, end.y, t)
});
var coordAngleInCurve = (start, cp, end, t) => 2 * (1 - t) * (cp - start) + 2 * t * (end - cp);
var angleInCurve = (start, cp, end, t) => -Math.atan2(coordAngleInCurve(start.x, cp.x, end.x, t), coordAngleInCurve(start.y, cp.y, end.y, t)) + 0.5 * PI;
var LineAnnotation = class extends Element {
  inRange(mouseX, mouseY, axis, useFinalPosition) {
    const hBorderWidth = this.options.borderWidth / 2;
    if (axis !== "x" && axis !== "y") {
      const point = {
        mouseX,
        mouseY
      };
      const {
        path,
        ctx
      } = this;
      if (path) {
        setBorderStyle(ctx, this.options);
        const {
          chart
        } = this.$context;
        const mx = mouseX * chart.currentDevicePixelRatio;
        const my = mouseY * chart.currentDevicePixelRatio;
        const result = ctx.isPointInStroke(path, mx, my) || isOnLabel(this, point, useFinalPosition);
        ctx.restore();
        return result;
      }
      const epsilon = sqr(hBorderWidth);
      return intersects(this, point, epsilon, useFinalPosition) || isOnLabel(this, point, useFinalPosition);
    }
    return inAxisRange(this, {
      mouseX,
      mouseY
    }, axis, {
      hBorderWidth,
      useFinalPosition
    });
  }
  getCenterPoint(useFinalPosition) {
    return getElementCenterPoint(this, useFinalPosition);
  }
  draw(ctx) {
    const {
      x,
      y,
      x2,
      y2,
      cp,
      options
    } = this;
    ctx.save();
    if (!setBorderStyle(ctx, options)) {
      return ctx.restore();
    }
    setShadowStyle(ctx, options);
    const length = Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2));
    if (options.curve && cp) {
      drawCurve(ctx, this, cp, length);
      return ctx.restore();
    }
    const {
      startOpts,
      endOpts,
      startAdjust,
      endAdjust
    } = getArrowHeads(this);
    const angle = Math.atan2(y2 - y, x2 - x);
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0 + startAdjust, 0);
    ctx.lineTo(length - endAdjust, 0);
    ctx.shadowColor = options.borderShadowColor;
    ctx.stroke();
    drawArrowHead(ctx, 0, startAdjust, startOpts);
    drawArrowHead(ctx, length, -endAdjust, endOpts);
    ctx.restore();
  }
  get label() {
    return this.elements && this.elements[0];
  }
  resolveElementProperties(chart, options) {
    const area = resolveLineProperties(chart, options);
    const {
      x,
      y,
      x2,
      y2
    } = area;
    const inside = isLineInArea(area, chart.chartArea);
    const properties = inside ? limitLineToArea({
      x,
      y
    }, {
      x: x2,
      y: y2
    }, chart.chartArea) : {
      x,
      y,
      x2,
      y2,
      width: Math.abs(x2 - x),
      height: Math.abs(y2 - y)
    };
    properties.centerX = (x2 + x) / 2;
    properties.centerY = (y2 + y) / 2;
    properties.initProperties = initAnimationProperties(chart, properties, options);
    if (options.curve) {
      const p1 = {
        x: properties.x,
        y: properties.y
      };
      const p2 = {
        x: properties.x2,
        y: properties.y2
      };
      properties.cp = getControlPoint(properties, options, distanceBetweenPoints(p1, p2));
    }
    const labelProperties = resolveLabelElementProperties(chart, properties, options.label);
    labelProperties._visible = inside;
    properties.elements = [{
      type: "label",
      optionScope: "label",
      properties: labelProperties,
      initProperties: properties.initProperties
    }];
    return properties;
  }
};
LineAnnotation.id = "lineAnnotation";
var arrowHeadsDefaults = {
  backgroundColor: void 0,
  backgroundShadowColor: void 0,
  borderColor: void 0,
  borderDash: void 0,
  borderDashOffset: void 0,
  borderShadowColor: void 0,
  borderWidth: void 0,
  display: void 0,
  fill: void 0,
  length: void 0,
  shadowBlur: void 0,
  shadowOffsetX: void 0,
  shadowOffsetY: void 0,
  width: void 0
};
LineAnnotation.defaults = {
  adjustScaleRange: true,
  arrowHeads: {
    display: false,
    end: Object.assign({}, arrowHeadsDefaults),
    fill: false,
    length: 12,
    start: Object.assign({}, arrowHeadsDefaults),
    width: 6
  },
  borderDash: [],
  borderDashOffset: 0,
  borderShadowColor: "transparent",
  borderWidth: 2,
  curve: false,
  controlPoint: {
    y: "-50%"
  },
  display: true,
  endValue: void 0,
  init: void 0,
  label: {
    backgroundColor: "rgba(0,0,0,0.8)",
    backgroundShadowColor: "transparent",
    borderCapStyle: "butt",
    borderColor: "black",
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: "miter",
    borderRadius: 6,
    borderShadowColor: "transparent",
    borderWidth: 0,
    callout: Object.assign({}, LabelAnnotation.defaults.callout),
    color: "#fff",
    content: null,
    display: false,
    drawTime: void 0,
    font: {
      family: void 0,
      lineHeight: void 0,
      size: void 0,
      style: void 0,
      weight: "bold"
    },
    height: void 0,
    opacity: void 0,
    padding: 6,
    position: "center",
    rotation: 0,
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    textAlign: "center",
    textStrokeColor: void 0,
    textStrokeWidth: 0,
    width: void 0,
    xAdjust: 0,
    yAdjust: 0,
    z: void 0
  },
  scaleID: void 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  value: void 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  z: 0
};
LineAnnotation.descriptors = {
  arrowHeads: {
    start: {
      _fallback: true
    },
    end: {
      _fallback: true
    },
    _fallback: true
  }
};
LineAnnotation.defaultRoutes = {
  borderColor: "color"
};
function inAxisRange(element, {
  mouseX,
  mouseY
}, axis, {
  hBorderWidth,
  useFinalPosition
}) {
  const limit = rangeLimit(mouseX, mouseY, element.getProps(["x", "y", "x2", "y2"], useFinalPosition), axis);
  return limit.value >= limit.start - hBorderWidth && limit.value <= limit.end + hBorderWidth || isOnLabel(element, {
    mouseX,
    mouseY
  }, useFinalPosition, axis);
}
function isLineInArea({
  x,
  y,
  x2,
  y2
}, {
  top,
  right,
  bottom,
  left
}) {
  return !(x < left && x2 < left || x > right && x2 > right || y < top && y2 < top || y > bottom && y2 > bottom);
}
function limitPointToArea({
  x,
  y
}, p2, {
  top,
  right,
  bottom,
  left
}) {
  if (x < left) {
    y = interpolateY(left, {
      x,
      y
    }, p2);
    x = left;
  }
  if (x > right) {
    y = interpolateY(right, {
      x,
      y
    }, p2);
    x = right;
  }
  if (y < top) {
    x = interpolateX(top, {
      x,
      y
    }, p2);
    y = top;
  }
  if (y > bottom) {
    x = interpolateX(bottom, {
      x,
      y
    }, p2);
    y = bottom;
  }
  return {
    x,
    y
  };
}
function limitLineToArea(p1, p2, area) {
  const {
    x,
    y
  } = limitPointToArea(p1, p2, area);
  const {
    x: x2,
    y: y2
  } = limitPointToArea(p2, p1, area);
  return {
    x,
    y,
    x2,
    y2,
    width: Math.abs(x2 - x),
    height: Math.abs(y2 - y)
  };
}
function intersects(element, {
  mouseX,
  mouseY
}, epsilon = EPSILON, useFinalPosition) {
  const {
    x: x1,
    y: y1,
    x2,
    y2
  } = element.getProps(["x", "y", "x2", "y2"], useFinalPosition);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = sqr(dx) + sqr(dy);
  const t = lenSq === 0 ? -1 : ((mouseX - x1) * dx + (mouseY - y1) * dy) / lenSq;
  let xx, yy;
  if (t < 0) {
    xx = x1;
    yy = y1;
  } else if (t > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + t * dx;
    yy = y1 + t * dy;
  }
  return sqr(mouseX - xx) + sqr(mouseY - yy) <= epsilon;
}
function isOnLabel(element, {
  mouseX,
  mouseY
}, useFinalPosition, axis) {
  const label = element.label;
  return label.options.display && label.inRange(mouseX, mouseY, axis, useFinalPosition);
}
function resolveLabelElementProperties(chart, properties, options) {
  const borderWidth = options.borderWidth;
  const padding = toPadding(options.padding);
  const textSize = measureLabelSize(chart.ctx, options);
  const width = textSize.width + padding.width + borderWidth;
  const height = textSize.height + padding.height + borderWidth;
  return calculateLabelPosition(properties, options, {
    width,
    height,
    padding
  }, chart.chartArea);
}
function calculateAutoRotation(properties) {
  const {
    x,
    y,
    x2,
    y2
  } = properties;
  const rotation = Math.atan2(y2 - y, x2 - x);
  return rotation > PI / 2 ? rotation - PI : rotation < PI / -2 ? rotation + PI : rotation;
}
function calculateLabelPosition(properties, label, sizes, chartArea) {
  const {
    width,
    height,
    padding
  } = sizes;
  const {
    xAdjust,
    yAdjust
  } = label;
  const p1 = {
    x: properties.x,
    y: properties.y
  };
  const p2 = {
    x: properties.x2,
    y: properties.y2
  };
  const rotation = label.rotation === "auto" ? calculateAutoRotation(properties) : toRadians(label.rotation);
  const size = rotatedSize(width, height, rotation);
  const t = calculateT(properties, label, {
    labelSize: size,
    padding
  }, chartArea);
  const pt = properties.cp ? pointInCurve(p1, properties.cp, p2, t) : pointInLine(p1, p2, t);
  const xCoordinateSizes = {
    size: size.w,
    min: chartArea.left,
    max: chartArea.right,
    padding: padding.left
  };
  const yCoordinateSizes = {
    size: size.h,
    min: chartArea.top,
    max: chartArea.bottom,
    padding: padding.top
  };
  const centerX = adjustLabelCoordinate(pt.x, xCoordinateSizes) + xAdjust;
  const centerY = adjustLabelCoordinate(pt.y, yCoordinateSizes) + yAdjust;
  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
    x2: centerX + width / 2,
    y2: centerY + height / 2,
    centerX,
    centerY,
    pointX: pt.x,
    pointY: pt.y,
    width,
    height,
    rotation: toDegrees(rotation)
  };
}
function rotatedSize(width, height, rotation) {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  return {
    w: Math.abs(width * cos) + Math.abs(height * sin),
    h: Math.abs(width * sin) + Math.abs(height * cos)
  };
}
function calculateT(properties, label, sizes, chartArea) {
  let t;
  const space = spaceAround(properties, chartArea);
  if (label.position === "start") {
    t = calculateTAdjust({
      w: properties.x2 - properties.x,
      h: properties.y2 - properties.y
    }, sizes, label, space);
  } else if (label.position === "end") {
    t = 1 - calculateTAdjust({
      w: properties.x - properties.x2,
      h: properties.y - properties.y2
    }, sizes, label, space);
  } else {
    t = getRelativePosition2(1, label.position);
  }
  return t;
}
function calculateTAdjust(lineSize, sizes, label, space) {
  const {
    labelSize,
    padding
  } = sizes;
  const lineW = lineSize.w * space.dx;
  const lineH = lineSize.h * space.dy;
  const x = lineW > 0 && (labelSize.w / 2 + padding.left - space.x) / lineW;
  const y = lineH > 0 && (labelSize.h / 2 + padding.top - space.y) / lineH;
  return clamp(Math.max(x, y), 0, 0.25);
}
function spaceAround(properties, chartArea) {
  const {
    x,
    x2,
    y,
    y2
  } = properties;
  const t = Math.min(y, y2) - chartArea.top;
  const l = Math.min(x, x2) - chartArea.left;
  const b = chartArea.bottom - Math.max(y, y2);
  const r = chartArea.right - Math.max(x, x2);
  return {
    x: Math.min(l, r),
    y: Math.min(t, b),
    dx: l <= r ? 1 : -1,
    dy: t <= b ? 1 : -1
  };
}
function adjustLabelCoordinate(coordinate, labelSizes) {
  const {
    size,
    min,
    max,
    padding
  } = labelSizes;
  const halfSize = size / 2;
  if (size > max - min) {
    return (max + min) / 2;
  }
  if (min >= coordinate - padding - halfSize) {
    coordinate = min + padding + halfSize;
  }
  if (max <= coordinate + padding + halfSize) {
    coordinate = max - padding - halfSize;
  }
  return coordinate;
}
function getArrowHeads(line) {
  const options = line.options;
  const arrowStartOpts = options.arrowHeads && options.arrowHeads.start;
  const arrowEndOpts = options.arrowHeads && options.arrowHeads.end;
  return {
    startOpts: arrowStartOpts,
    endOpts: arrowEndOpts,
    startAdjust: getLineAdjust(line, arrowStartOpts),
    endAdjust: getLineAdjust(line, arrowEndOpts)
  };
}
function getLineAdjust(line, arrowOpts) {
  if (!arrowOpts || !arrowOpts.display) {
    return 0;
  }
  const {
    length,
    width
  } = arrowOpts;
  const adjust = line.options.borderWidth / 2;
  const p1 = {
    x: length,
    y: width + adjust
  };
  const p2 = {
    x: 0,
    y: adjust
  };
  return Math.abs(interpolateX(0, p1, p2));
}
function drawArrowHead(ctx, offset, adjust, arrowOpts) {
  if (!arrowOpts || !arrowOpts.display) {
    return;
  }
  const {
    length,
    width,
    fill,
    backgroundColor,
    borderColor
  } = arrowOpts;
  const arrowOffsetX = Math.abs(offset - length) + adjust;
  ctx.beginPath();
  setShadowStyle(ctx, arrowOpts);
  setBorderStyle(ctx, arrowOpts);
  ctx.moveTo(arrowOffsetX, -width);
  ctx.lineTo(offset + adjust, 0);
  ctx.lineTo(arrowOffsetX, width);
  if (fill === true) {
    ctx.fillStyle = backgroundColor || borderColor;
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = "transparent";
  } else {
    ctx.shadowColor = arrowOpts.borderShadowColor;
  }
  ctx.stroke();
}
function getControlPoint(properties, options, distance) {
  const {
    x,
    y,
    x2,
    y2,
    centerX,
    centerY
  } = properties;
  const angle = Math.atan2(y2 - y, x2 - x);
  const cp = toPosition(options.controlPoint, 0);
  const point = {
    x: centerX + getSize(distance, cp.x, false),
    y: centerY + getSize(distance, cp.y, false)
  };
  return rotated(point, {
    x: centerX,
    y: centerY
  }, angle);
}
function drawArrowHeadOnCurve(ctx, {
  x,
  y
}, {
  angle,
  adjust
}, arrowOpts) {
  if (!arrowOpts || !arrowOpts.display) {
    return;
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  drawArrowHead(ctx, 0, -adjust, arrowOpts);
  ctx.restore();
}
function drawCurve(ctx, element, cp, length) {
  const {
    x,
    y,
    x2,
    y2,
    options
  } = element;
  const {
    startOpts,
    endOpts,
    startAdjust,
    endAdjust
  } = getArrowHeads(element);
  const p1 = {
    x,
    y
  };
  const p2 = {
    x: x2,
    y: y2
  };
  const startAngle = angleInCurve(p1, cp, p2, 0);
  const endAngle = angleInCurve(p1, cp, p2, 1) - PI;
  const ps = pointInCurve(p1, cp, p2, startAdjust / length);
  const pe = pointInCurve(p1, cp, p2, 1 - endAdjust / length);
  const path = new Path2D();
  ctx.beginPath();
  path.moveTo(ps.x, ps.y);
  path.quadraticCurveTo(cp.x, cp.y, pe.x, pe.y);
  ctx.shadowColor = options.borderShadowColor;
  ctx.stroke(path);
  element.path = path;
  element.ctx = ctx;
  drawArrowHeadOnCurve(ctx, ps, {
    angle: startAngle,
    adjust: startAdjust
  }, startOpts);
  drawArrowHeadOnCurve(ctx, pe, {
    angle: endAngle,
    adjust: endAdjust
  }, endOpts);
}
var EllipseAnnotation = class extends Element {
  inRange(mouseX, mouseY, axis, useFinalPosition) {
    const rotation = this.options.rotation;
    const borderWidth = this.options.borderWidth;
    if (axis !== "x" && axis !== "y") {
      return pointInEllipse({
        x: mouseX,
        y: mouseY
      }, this.getProps(["width", "height", "centerX", "centerY"], useFinalPosition), rotation, borderWidth);
    }
    const {
      x,
      y,
      x2,
      y2
    } = this.getProps(["x", "y", "x2", "y2"], useFinalPosition);
    const hBorderWidth = borderWidth / 2;
    const limit = axis === "y" ? {
      start: y,
      end: y2
    } : {
      start: x,
      end: x2
    };
    const rotatedPoint = rotated({
      x: mouseX,
      y: mouseY
    }, this.getCenterPoint(useFinalPosition), toRadians(-rotation));
    return rotatedPoint[axis] >= limit.start - hBorderWidth - EPSILON && rotatedPoint[axis] <= limit.end + hBorderWidth + EPSILON;
  }
  getCenterPoint(useFinalPosition) {
    return getElementCenterPoint(this, useFinalPosition);
  }
  draw(ctx) {
    const {
      width,
      height,
      centerX,
      centerY,
      options
    } = this;
    ctx.save();
    translate(ctx, this.getCenterPoint(), options.rotation);
    setShadowStyle(ctx, this.options);
    ctx.beginPath();
    ctx.fillStyle = options.backgroundColor;
    const stroke = setBorderStyle(ctx, options);
    ctx.ellipse(centerX, centerY, height / 2, width / 2, PI / 2, 0, 2 * PI);
    ctx.fill();
    if (stroke) {
      ctx.shadowColor = options.borderShadowColor;
      ctx.stroke();
    }
    ctx.restore();
  }
  get label() {
    return this.elements && this.elements[0];
  }
  resolveElementProperties(chart, options) {
    return resolveBoxAndLabelProperties(chart, options);
  }
};
EllipseAnnotation.id = "ellipseAnnotation";
EllipseAnnotation.defaults = {
  adjustScaleRange: true,
  backgroundShadowColor: "transparent",
  borderDash: [],
  borderDashOffset: 0,
  borderShadowColor: "transparent",
  borderWidth: 1,
  display: true,
  init: void 0,
  label: Object.assign({}, BoxAnnotation.defaults.label),
  rotation: 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  z: 0
};
EllipseAnnotation.defaultRoutes = {
  borderColor: "color",
  backgroundColor: "color"
};
EllipseAnnotation.descriptors = {
  label: {
    _fallback: true
  }
};
function pointInEllipse(p, ellipse, rotation, borderWidth) {
  const {
    width,
    height,
    centerX,
    centerY
  } = ellipse;
  const xRadius = width / 2;
  const yRadius = height / 2;
  if (xRadius <= 0 || yRadius <= 0) {
    return false;
  }
  const angle = toRadians(rotation || 0);
  const hBorderWidth = borderWidth / 2 || 0;
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  const a = Math.pow(cosAngle * (p.x - centerX) + sinAngle * (p.y - centerY), 2);
  const b = Math.pow(sinAngle * (p.x - centerX) - cosAngle * (p.y - centerY), 2);
  return a / Math.pow(xRadius + hBorderWidth, 2) + b / Math.pow(yRadius + hBorderWidth, 2) <= 1.0001;
}
var PointAnnotation = class extends Element {
  inRange(mouseX, mouseY, axis, useFinalPosition) {
    const {
      x,
      y,
      x2,
      y2,
      width
    } = this.getProps(["x", "y", "x2", "y2", "width"], useFinalPosition);
    const borderWidth = this.options.borderWidth;
    if (axis !== "x" && axis !== "y") {
      return inPointRange({
        x: mouseX,
        y: mouseY
      }, this.getCenterPoint(useFinalPosition), width / 2, borderWidth);
    }
    const hBorderWidth = borderWidth / 2;
    const limit = axis === "y" ? {
      start: y,
      end: y2,
      value: mouseY
    } : {
      start: x,
      end: x2,
      value: mouseX
    };
    return limit.value >= limit.start - hBorderWidth && limit.value <= limit.end + hBorderWidth;
  }
  getCenterPoint(useFinalPosition) {
    return getElementCenterPoint(this, useFinalPosition);
  }
  draw(ctx) {
    const options = this.options;
    const borderWidth = options.borderWidth;
    if (options.radius < 0.1) {
      return;
    }
    ctx.save();
    ctx.fillStyle = options.backgroundColor;
    setShadowStyle(ctx, options);
    const stroke = setBorderStyle(ctx, options);
    drawPoint2(ctx, this, this.centerX, this.centerY);
    if (stroke && !isImageOrCanvas(options.pointStyle)) {
      ctx.shadowColor = options.borderShadowColor;
      ctx.stroke();
    }
    ctx.restore();
    options.borderWidth = borderWidth;
  }
  resolveElementProperties(chart, options) {
    const properties = resolvePointProperties(chart, options);
    properties.initProperties = initAnimationProperties(chart, properties, options);
    return properties;
  }
};
PointAnnotation.id = "pointAnnotation";
PointAnnotation.defaults = {
  adjustScaleRange: true,
  backgroundShadowColor: "transparent",
  borderDash: [],
  borderDashOffset: 0,
  borderShadowColor: "transparent",
  borderWidth: 1,
  display: true,
  init: void 0,
  pointStyle: "circle",
  radius: 10,
  rotation: 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  xAdjust: 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  xValue: void 0,
  yAdjust: 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  yValue: void 0,
  z: 0
};
PointAnnotation.defaultRoutes = {
  borderColor: "color",
  backgroundColor: "color"
};
var PolygonAnnotation = class extends Element {
  inRange(mouseX, mouseY, axis, useFinalPosition) {
    if (axis !== "x" && axis !== "y") {
      return this.options.radius >= 0.1 && this.elements.length > 1 && pointIsInPolygon(this.elements, mouseX, mouseY, useFinalPosition);
    }
    const rotatedPoint = rotated({
      x: mouseX,
      y: mouseY
    }, this.getCenterPoint(useFinalPosition), toRadians(-this.options.rotation));
    const axisPoints = this.elements.map((point) => axis === "y" ? point.bY : point.bX);
    const start = Math.min(...axisPoints);
    const end = Math.max(...axisPoints);
    return rotatedPoint[axis] >= start && rotatedPoint[axis] <= end;
  }
  getCenterPoint(useFinalPosition) {
    return getElementCenterPoint(this, useFinalPosition);
  }
  draw(ctx) {
    const {
      elements,
      options
    } = this;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = options.backgroundColor;
    setShadowStyle(ctx, options);
    const stroke = setBorderStyle(ctx, options);
    let first = true;
    for (const el of elements) {
      if (first) {
        ctx.moveTo(el.x, el.y);
        first = false;
      } else {
        ctx.lineTo(el.x, el.y);
      }
    }
    ctx.closePath();
    ctx.fill();
    if (stroke) {
      ctx.shadowColor = options.borderShadowColor;
      ctx.stroke();
    }
    ctx.restore();
  }
  resolveElementProperties(chart, options) {
    const properties = resolvePointProperties(chart, options);
    const {
      sides,
      rotation
    } = options;
    const elements = [];
    const angle = 2 * PI / sides;
    let rad = rotation * RAD_PER_DEG;
    for (let i = 0; i < sides; i++, rad += angle) {
      const elProps = buildPointElement(properties, options, rad);
      elProps.initProperties = initAnimationProperties(chart, properties, options);
      elements.push(elProps);
    }
    properties.elements = elements;
    return properties;
  }
};
PolygonAnnotation.id = "polygonAnnotation";
PolygonAnnotation.defaults = {
  adjustScaleRange: true,
  backgroundShadowColor: "transparent",
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: "miter",
  borderShadowColor: "transparent",
  borderWidth: 1,
  display: true,
  init: void 0,
  point: {
    radius: 0
  },
  radius: 10,
  rotation: 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  sides: 3,
  xAdjust: 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  xValue: void 0,
  yAdjust: 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  yValue: void 0,
  z: 0
};
PolygonAnnotation.defaultRoutes = {
  borderColor: "color",
  backgroundColor: "color"
};
function buildPointElement({
  centerX,
  centerY
}, {
  radius,
  borderWidth
}, rad) {
  const halfBorder = borderWidth / 2;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const point = {
    x: centerX + sin * radius,
    y: centerY - cos * radius
  };
  return {
    type: "point",
    optionScope: "point",
    properties: {
      x: point.x,
      y: point.y,
      centerX: point.x,
      centerY: point.y,
      bX: centerX + sin * (radius + halfBorder),
      bY: centerY - cos * (radius + halfBorder)
    }
  };
}
function pointIsInPolygon(points, x, y, useFinalPosition) {
  let isInside = false;
  let A = points[points.length - 1].getProps(["bX", "bY"], useFinalPosition);
  for (const point of points) {
    const B = point.getProps(["bX", "bY"], useFinalPosition);
    if (B.bY > y !== A.bY > y && x < (A.bX - B.bX) * (y - B.bY) / (A.bY - B.bY) + B.bX) {
      isInside = !isInside;
    }
    A = B;
  }
  return isInside;
}
var annotationTypes = {
  box: BoxAnnotation,
  ellipse: EllipseAnnotation,
  label: LabelAnnotation,
  line: LineAnnotation,
  point: PointAnnotation,
  polygon: PolygonAnnotation
};
Object.keys(annotationTypes).forEach((key) => {
  defaults.describe(`elements.${annotationTypes[key].id}`, {
    _fallback: "plugins.annotation.common"
  });
});
var directUpdater = {
  update: Object.assign
};
var hooks$1 = eventHooks.concat(elementHooks);
var resolve2 = (value, optDefs) => isObject(optDefs) ? resolveObj(value, optDefs) : value;
var isIndexable = (prop) => prop === "color" || prop === "font";
function resolveType(type = "line") {
  if (annotationTypes[type]) {
    return type;
  }
  console.warn(`Unknown annotation type: '${type}', defaulting to 'line'`);
  return "line";
}
function updateElements(chart, state, options, mode) {
  const animations = resolveAnimations(chart, options.animations, mode);
  const annotations = state.annotations;
  const elements = resyncElements(state.elements, annotations);
  for (let i = 0; i < annotations.length; i++) {
    const annotationOptions = annotations[i];
    const element = getOrCreateElement(elements, i, annotationOptions.type);
    const resolver = annotationOptions.setContext(getContext(chart, element, annotationOptions));
    const properties = element.resolveElementProperties(chart, resolver);
    properties.skip = toSkip(properties);
    if ("elements" in properties) {
      updateSubElements(element, properties.elements, resolver, animations);
      delete properties.elements;
    }
    if (!defined(element.x)) {
      Object.assign(element, properties);
    }
    Object.assign(element, properties.initProperties);
    properties.options = resolveAnnotationOptions(resolver);
    animations.update(element, properties);
  }
}
function toSkip(properties) {
  return isNaN(properties.x) || isNaN(properties.y);
}
function resolveAnimations(chart, animOpts, mode) {
  if (mode === "reset" || mode === "none" || mode === "resize") {
    return directUpdater;
  }
  return new Animations(chart, animOpts);
}
function updateSubElements(mainElement, elements, resolver, animations) {
  const subElements = mainElement.elements || (mainElement.elements = []);
  subElements.length = elements.length;
  for (let i = 0; i < elements.length; i++) {
    const definition = elements[i];
    const properties = definition.properties;
    const subElement = getOrCreateElement(subElements, i, definition.type, definition.initProperties);
    const subResolver = resolver[definition.optionScope].override(definition);
    properties.options = resolveAnnotationOptions(subResolver);
    animations.update(subElement, properties);
  }
}
function getOrCreateElement(elements, index, type, initProperties) {
  const elementClass = annotationTypes[resolveType(type)];
  let element = elements[index];
  if (!element || !(element instanceof elementClass)) {
    element = elements[index] = new elementClass();
    Object.assign(element, initProperties);
  }
  return element;
}
function resolveAnnotationOptions(resolver) {
  const elementClass = annotationTypes[resolveType(resolver.type)];
  const result = {};
  result.id = resolver.id;
  result.type = resolver.type;
  result.drawTime = resolver.drawTime;
  Object.assign(result, resolveObj(resolver, elementClass.defaults), resolveObj(resolver, elementClass.defaultRoutes));
  for (const hook of hooks$1) {
    result[hook] = resolver[hook];
  }
  return result;
}
function resolveObj(resolver, defs) {
  const result = {};
  for (const prop of Object.keys(defs)) {
    const optDefs = defs[prop];
    const value = resolver[prop];
    if (isIndexable(prop) && isArray(value)) {
      result[prop] = value.map((item) => resolve2(item, optDefs));
    } else {
      result[prop] = resolve2(value, optDefs);
    }
  }
  return result;
}
function getContext(chart, element, annotation2) {
  return element.$context || (element.$context = Object.assign(Object.create(chart.getContext()), {
    element,
    id: annotation2.id,
    type: "annotation"
  }));
}
function resyncElements(elements, annotations) {
  const count = annotations.length;
  const start = elements.length;
  if (start < count) {
    const add = count - start;
    elements.splice(start, 0, ...new Array(add));
  } else if (start > count) {
    elements.splice(count, start - count);
  }
  return elements;
}
var version = "3.0.1";
var chartStates = /* @__PURE__ */ new Map();
var hooks = eventHooks.concat(elementHooks);
var annotation = {
  id: "annotation",
  version,
  beforeRegister() {
    requireVersion("chart.js", "4.0", Chart.version);
  },
  afterRegister() {
    Chart.register(annotationTypes);
  },
  afterUnregister() {
    Chart.unregister(annotationTypes);
  },
  beforeInit(chart) {
    chartStates.set(chart, {
      annotations: [],
      elements: [],
      visibleElements: [],
      listeners: {},
      listened: false,
      moveListened: false,
      hooks: {},
      hooked: false,
      hovered: []
    });
  },
  beforeUpdate(chart, args, options) {
    const state = chartStates.get(chart);
    const annotations = state.annotations = [];
    let annotationOptions = options.annotations;
    if (isObject(annotationOptions)) {
      Object.keys(annotationOptions).forEach((key) => {
        const value = annotationOptions[key];
        if (isObject(value)) {
          value.id = key;
          annotations.push(value);
        }
      });
    } else if (isArray(annotationOptions)) {
      annotations.push(...annotationOptions);
    }
    verifyScaleOptions(annotations, chart.scales);
  },
  afterDataLimits(chart, args) {
    const state = chartStates.get(chart);
    adjustScaleRange(chart, args.scale, state.annotations.filter((a) => a.display && a.adjustScaleRange));
  },
  afterUpdate(chart, args, options) {
    const state = chartStates.get(chart);
    updateListeners(chart, state, options);
    updateElements(chart, state, options, args.mode);
    state.visibleElements = state.elements.filter((el) => !el.skip && el.options.display);
    updateHooks(chart, state, options);
  },
  beforeDatasetsDraw(chart, _args, options) {
    draw(chart, "beforeDatasetsDraw", options.clip);
  },
  afterDatasetsDraw(chart, _args, options) {
    draw(chart, "afterDatasetsDraw", options.clip);
  },
  beforeDraw(chart, _args, options) {
    draw(chart, "beforeDraw", options.clip);
  },
  afterDraw(chart, _args, options) {
    draw(chart, "afterDraw", options.clip);
  },
  beforeEvent(chart, args, options) {
    const state = chartStates.get(chart);
    if (handleEvent(state, args.event, options)) {
      args.changed = true;
    }
  },
  afterDestroy(chart) {
    chartStates.delete(chart);
  },
  _getState(chart) {
    return chartStates.get(chart);
  },
  defaults: {
    animations: {
      numbers: {
        properties: ["x", "y", "x2", "y2", "width", "height", "centerX", "centerY", "pointX", "pointY", "radius"],
        type: "number"
      }
    },
    clip: true,
    interaction: {
      mode: void 0,
      axis: void 0,
      intersect: void 0
    },
    common: {
      drawTime: "afterDatasetsDraw",
      init: false,
      label: {}
    }
  },
  descriptors: {
    _indexable: false,
    _scriptable: (prop) => !hooks.includes(prop) && prop !== "init",
    annotations: {
      _allKeys: false,
      _fallback: (prop, opts) => `elements.${annotationTypes[resolveType(opts.type)].id}`
    },
    interaction: {
      _fallback: true
    },
    common: {
      label: {
        _indexable: isIndexable,
        _fallback: true
      },
      _indexable: isIndexable
    }
  },
  additionalOptionScopes: [""]
};
function draw(chart, caller, clip) {
  const {
    ctx,
    chartArea
  } = chart;
  const state = chartStates.get(chart);
  if (clip) {
    clipArea(ctx, chartArea);
  }
  const drawableElements = getDrawableElements(state.visibleElements, caller).sort((a, b) => a.element.options.z - b.element.options.z);
  for (const item of drawableElements) {
    drawElement(ctx, chartArea, state, item);
  }
  if (clip) {
    unclipArea(ctx);
  }
}
function getDrawableElements(elements, caller) {
  const drawableElements = [];
  for (const el of elements) {
    if (el.options.drawTime === caller) {
      drawableElements.push({
        element: el,
        main: true
      });
    }
    if (el.elements && el.elements.length) {
      for (const sub of el.elements) {
        if (sub.options.display && sub.options.drawTime === caller) {
          drawableElements.push({
            element: sub
          });
        }
      }
    }
  }
  return drawableElements;
}
function drawElement(ctx, chartArea, state, item) {
  const el = item.element;
  if (item.main) {
    invokeHook(state, el, "beforeDraw");
    el.draw(ctx, chartArea);
    invokeHook(state, el, "afterDraw");
  } else {
    el.draw(ctx, chartArea);
  }
}
export {
  annotation as default
};
/*! Bundled license information:

chart.js/dist/helpers.js:
  (*!
   * Chart.js v4.4.3
   * https://www.chartjs.org
   * (c) 2024 Chart.js Contributors
   * Released under the MIT License
   *)

chartjs-plugin-annotation/dist/chartjs-plugin-annotation.esm.js:
  (*!
  * chartjs-plugin-annotation v3.0.1
  * https://www.chartjs.org/chartjs-plugin-annotation/index
   * (c) 2023 chartjs-plugin-annotation Contributors
   * Released under the MIT License
   *)
*/
//# sourceMappingURL=chartjs-plugin-annotation.js.map
