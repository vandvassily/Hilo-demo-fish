import Hilo from "hilojs";
import Asset from "./asset";
import { getRotateAngle } from "./utils";

interface GameType {
  init: () => void;
  asset?: any;
  initStage: () => void;
  width: number;
  height: number;
  stage: Hilo.Stage | null;
  ticker: Hilo.Ticker | null;
  speed: number;

  bg?: Hilo.View;
  fish?: Hilo.View;

  onUserInput: (e: MouseEvent) => void;
  initFish: () => void;
  initBackground: () => void;
}

const game: GameType = {
  width: 1280,
  height: 720,

  stage: null,
  fish: undefined,
  ticker: null,

  speed: 400,

  init: function () {
    // @ts-ignore
    this.asset = new Asset();
    this.asset.on("complete", () => {
      this.asset.off("complete");
      this.initStage();
    });

    this.asset.load();
  },

  initStage: function () {
    // 创建舞台
    this.stage = new Hilo.Stage({
      // @ts-ignore
      id: "mainStage",
      renderType: "canvas",
      width: this.width,
      height: this.height,
      container: document.getElementById("stageContainer") as HTMLElement
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
      document.addEventListener("click", (e: MouseEvent) => {
        this.onUserInput(e);
      });
    }

    // 绑定舞台更新
    this.stage.onUpdate = function () {};

    // 初始化其他组件
    this.initBackground();
    this.initFish();
  },

  initBackground: function () {
    this.bg = new Hilo.Bitmap({
      // @ts-ignore
      id: "bg",
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
      id: "fish",
      x: 80,
      y: 50,
      width: 174,
      height: 126,
      pivotX: 83,
      pivotY: 48,
      children: [
        new Hilo.Sprite({
          frames: atlas.getSprite("fish"),
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

      Hilo.Tween.to(
        this.fish,
        {
          x: targetX,
          y: targetY
        },
        {
          duration: duration,
          onComplete: function () {
            console.log("移动完成");
          }
        }
      );
    }
  }
};

game.init();
