import { toPoints } from 'svg-points';

export const svgPathToPoints = (path) => {
  const points = toPoints({
    type: 'path',
    d: path.getAttribute('d'),
  });
  return points;
};
