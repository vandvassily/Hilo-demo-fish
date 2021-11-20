# Hilo-demo-fish

## 游戏制作环节

1. 导入资源
2. 搭建场景
3. 配置组件
4. 定义变量
5. 编写方法
6. 串联逻辑 

## 学习任务

// TODO:

- [x] 学习游戏制作
  - [x] 游戏开发基本流程
  - [x] 资源初始化下载
  - [x] 搭建舞台
  - [x] 搭建角色
  - [x] 使用精灵图和位图
  - [x] 角色移动
- [ ] 预期功能及DEMO
  - [ ] 光标跟随
  - [ ] 文本提示
  - [ ] 声音播放
  - [ ] 项目demo

## 动手来一个吧

参考官网DEMO，以及游戏样例，在现有的素材中，制作一个 `池塘养鱼` 游戏。

<CodeSandbox sandboxUrl="https://codesandbox.io/embed/hilo-demo-fish-lyyzs?fontsize=14&hidenavigation=1&theme=dark" />

### 目标

在游戏画面中点击鼠标（模拟为投食操作），当投喂一定次数（lv1： 10，lv2：20，...），小鱼完成相应的等级提升（庆祝效果），移动速度变快；达到最高等级上限（lv5）后，提示用户已经达到最高等级，小鱼速度不再提升。

### 动手实践

1. 鼠标点击界面，小鱼移动到相应的位置。
   1. 转换移动方向
2. 等级达成，小鱼速度变快。
   1. 改变等级
   2. 粒子效果

#### 过程中遇到的问题

1. 角色旋转

如果角色（View）的中心点未设置，那么旋转就是是以角色（View）中的左上角为基准点进行矩阵转换的。

2. 旋转角度计算

重新捡起了课本。哈哈哈哈~

坐标系
```js
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
```

> 象限中还可以重新优化一下。

3. 触发角色移动的事件

在 `Hilo` 中，通过使用 `Hilo.Tween` 来完成角色的移动。但是，角色的移动是异步执行，短时间高频率触发移动，会导致角色移动错位。

方案：
考虑在触发事件后，进行判断，循环查找正在执行的动画。如果将要移动的角色有正在执行的动画，则终止，并推入新的动画。


## 参考资料

[超简短的独立游戏开发教学（持续更新）](https://learn.u3d.cn/tutorial/MiniGameDev)

[Hilo--教程文档--快速开始](https://hiloteam.github.io/tutorial/index.html)