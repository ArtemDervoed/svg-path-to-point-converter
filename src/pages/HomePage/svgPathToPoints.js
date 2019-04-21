import { toPoints } from 'svg-points';

export const svgPathToPoints = (svg) => {
  let points = null;
  svg.childNodes.forEach((node) => {
    if (node.tagName === 'path') {
      points = toPoints({
        type: 'path',
        d: node.getAttribute('d'),
      });
    }
  });
  return points;
};
