import Hilo from 'hilojs';
import _ from 'lodash';
import Asset from './asset';
import { getRotateAngle } from './utils';

// 移除相同目标ID的动画
const removeTweenMove = (id: string) => {
  if (Hilo && Hilo.Tween) {
    // @ts-ignore
    const tweens = Hilo.Tween._tweens.filter((item) => {
      return item.target.id === id;
    });

    Hilo.Tween.remove(tweens);
  }
};

// 等级映射
const levelMap = {
  '1': 5,
  '2': 10,
  '3': 15,
  '4': 20,
  '5': 25
};

interface GameType {
  width: number;
  height: number;
  speed: number;
  count: number;
  level: 1 | 2 | 3 | 4 | 5 | 6;

  asset?: any;
  stage: Hilo.Stage | null;
  ticker: Hilo.Ticker | null;
  bg?: Hilo.View;
  fish?: Hilo.View;
  particle?: Hilo.ParticleSystem;
  levelPanel?: Hilo.BitmapText;

  initStage: () => void;
  initBackground: () => void;
  initFish: () => void;
  initParticle: () => void;
  initLevelPanel: () => void;
  onUserInput: (e: MouseEvent) => void;
  onFishMoveCompletion: () => void;
  init: () => void;

  levelUp: () => void;
  stageOnUpdate: () => void;
}

const game: GameType = {
  width: 1280,
  height: 720,
  speed: 400,
  count: 0,
  level: 1,

  stage: null,
  fish: undefined,
  particle: undefined,
  ticker: null,

  init: function () {
    // @ts-ignore
    this.asset = new Asset();
    this.asset.on('complete', () => {
      this.asset.off('complete');
      this.initStage();
    });

    this.asset.load();
  },

  initStage: function () {
    // 创建舞台
    this.stage = new Hilo.Stage({
      // @ts-ignore
      id: 'mainStage',
      renderType: 'canvas',
      width: this.width,
      height: this.height,
      container: document.getElementById('stageContainer') as HTMLElement
    });

    // 启动定时器，60帧
    this.ticker = new Hilo.Ticker(60);
    this.ticker.addTick(Hilo.Tween);
    this.ticker.addTick(this.stage);
    this.ticker.start(true);

    // 绑定交互事件
    // @ts-ignore
    this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);

    // 监听点击事件
    if (document.addEventListener) {
      document.addEventListener('click', (e: MouseEvent) => {
        this.onUserInput(e);
      });
    }

    // 绑定舞台更新
    this.stage.onUpdate = this.stageOnUpdate.bind(this);

    // 初始化其他组件
    this.initBackground();
    this.initFish();
    this.initParticle();
    this.initLevelPanel();
  },

  initBackground: function () {
    this.bg = new Hilo.Bitmap({
      // @ts-ignore
      id: 'bg',
      width: 1280,
      height: 720,
      image: this.asset.bg
    });

    this.stage?.addChild(this.bg);
  },

  initFish: function () {
    // 动画纹理帧
    const atlas = new Hilo.TextureAtlas({
      image: this.asset.fish,
      width: 174,
      height: 1512,
      frames: {
        frameWidth: 174,
        frameHeight: 126,
        numFrames: 12
      },
      sprites: {
        fish: { from: 0, to: 7 }
      }
    });

    // 创建精灵图容器
    this.fish = new Hilo.Container({
      id: 'fish',
      x: 80,
      y: 50,
      width: 174,
      height: 126,
      pivotX: 83,
      pivotY: 48,
      children: [
        new Hilo.Sprite({
          frames: atlas.getSprite('fish'),
          x: 0,
          y: 0,
          alpha: 0.8,
          interval: 6,
          timeBased: false,
          loop: true,
          onUpdate: function () {}
        })
      ]
    });

    this.stage?.addChild(this.fish);
  },

  // 创建粒子效果
  initParticle() {
    const { fireImg } = this.asset;
    this.particle = new Hilo.ParticleSystem({
      x: 0,
      y: 0,
      emitNum: 20,
      emitTime: 1,
      particle: {
        frame: [
          [75, 236, 7, 11],
          [119, 223, 7, 17],
          [90, 223, 22, 17],
          [51, 202, 17, 46],
          [94, 59, 34, 59],
          [60, 160, 34, 42],
          [30, 99, 30, 99],
          [7, 240, 7, 11],
          [119, 206, 7, 17],
          [90, 206, 22, 17],
          [111, 160, 17, 46],
          [60, 59, 34, 59],
          [94, 118, 34, 42],
          [30, 0, 30, 99],
          [68, 236, 7, 11],
          [112, 223, 7, 17],
          [68, 219, 22, 17],
          [94, 160, 17, 46],
          [94, 0, 34, 59],
          [60, 118, 34, 42],
          [0, 99, 30, 99],
          [0, 240, 7, 11],
          [112, 206, 7, 17],
          [68, 202, 22, 17],
          [34, 198, 17, 46],
          [60, 0, 34, 59],
          [0, 198, 34, 42],
          [0, 0, 30, 99]
        ],
        image: fireImg,
        life: 22,
        alphaV: -0.01,
        vxVar: 300,
        vyVar: 300,
        axVar: 200,
        ayVar: 200,
        scale: 0.5,
        rotationVar: 360,
        rotationVVar: 4,
        pivotX: 0.5,
        pivotY: 0.5
      },
      emitterX: 300,
      emitterY: 300
    });
    this.stage?.addChild(this.particle);
  },

  // 初始化等级面板
  initLevelPanel: function () {
    this.levelPanel = new Hilo.BitmapText({
      id: 'score',
      glyphs: this.asset.numberGlyphs,
      textAlign: 'center',
      x: 400,
      y: 0,
      text: this.level
    });

    this.stage?.addChild(this.levelPanel);
  },

  levelUp: function () {
    if (this.level < 6) {
      this.level++;
      this.speed += 100;
      this.count = 0;
      this.particle?.start();
      this.levelPanel?.setText(String(this.level));
      setTimeout(() => {
        this.particle?.stop();
      }, 5000);
    }
  },

  onUserInput(e) {
    if (this.fish) {
      const currentX = this.fish.x;
      const currentY = this.fish.y;
      const targetX = e.x;
      const targetY = e.y;
      const { speed } = this;

      console.log(targetX, targetY);

      // 计算移动方向
      const rotation = getRotateAngle(currentX, currentY, targetX, targetY);
      // 更改方向
      if (this.fish) this.fish.rotation = rotation;

      // 计算移动距离和时长
      const absX = Math.abs(targetX - currentX);
      const absY = Math.abs(targetY - currentY);
      const distance = Math.sqrt(absX * absX + absY * absY);
      const duration = (distance * 1000) / speed;

      // TODO: 可以优化，不用每次都创建一个新的Tween；例如，可以使用一个全局的Tween，然后每次都更新目标值
      removeTweenMove('fish');
      Hilo.Tween.to(
        this.fish,
        {
          x: targetX,
          y: targetY
        },
        {
          duration: duration,
          onComplete: () => {
            this.onFishMoveCompletion();
          }
        }
      );
    }
  },

  stageOnUpdate() {},

  onFishMoveCompletion() {
    console.log('移动成功');
    console.log(this.level);
    if (this.level > 5) return;
    // @ts-ignore
    if (this.count < levelMap[this.level + '']) {
      this.count++;
    } else {
      this.levelUp();
    }
  }
};

game.init();
