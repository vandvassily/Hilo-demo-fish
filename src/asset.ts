// @ts-nocheck
import Hilo from "hilojs";

const Asset = Hilo.Class.create({
  Mixes: Hilo.EventMixin,
  queue: null,
  bg: null,
  fish: null,

  load: function () {
    const resources = [
      {
        id: "bg",
        src: "https://hiloteam.github.io/Hilo/examples/images/map.jpg"
      },
      {
        id: "fish",
        src: "https://hiloteam.github.io/Hilo/examples/images/fish.png"
      }
    ];

    this.queue = new Hilo.LoadQueue();
    this.queue.add(resources);
    this.queue.on("complete", this.onComplete.bind(this));
    this.queue.start();
  },

  onComplete: function (e) {
    this.bg = this.queue.get("bg").content;
    this.fish = this.queue.get("fish").content;
    this.queue.off("complete");
    this.fire("complete");
  }
});

export default Asset;
