/**
 * 计算旋转的角度
 * @param {number} x1 起点坐标x
 * @param {number} y1 起点坐标y
 * @param {number} x2 终点坐标x
 * @param {number} y2 终点坐标y
 * @return {number} 返回旋转角度
 * 
 * @description 坐标系
图片的方向默认为沿着X轴的方向
--------------------> X
\ (0, 0)
\
\
\
\
\/
Y
*/
export function getRotateAngle(x1: number, y1: number, x2: number, y2: number) {
  var x = x2 - x1;
  var y = y2 - y1;
  var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  var sin = Math.abs(y) / z;
  var rad = Math.asin(sin); //用反三角函数求弧度
  var angle = Math.floor(180 / (Math.PI / rad)); //将弧度转换成角度

  // TODO: 优化角度计算和象限判断
  // 象限判断
  if (x < 0 && y > 0) {
    angle = 180 - angle;
  } else if (x < 0 && y < 0) {
    angle = 180 + angle;
  } else if (x > 0 && y < 0) {
    angle = 360 - angle;
  } else if (x === 0) {
    angle = y >= 0 ? 90 : 270;
  } else if (y === 0) {
    angle = x >= 0 ? 0 : 180;
  }

  return angle;
}
