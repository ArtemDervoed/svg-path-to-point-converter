// import { toPoints } from 'svg-points';

export const svgPathToPoints = (svg) => {
  let points = null;
  svg.childNodes.forEach((node) => {
    if (node.tagName === 'path') {
      points = node.getAttribute('d');
    }
  });
  return points;
};
