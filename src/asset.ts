// @ts-nocheck
import Hilo from 'hilojs';
import fireImg from './images/fire.png';
import numberImg from './images/number.png';

const Asset = Hilo.Class.create({
  Mixes: Hilo.EventMixin,
  queue: null,
  bg: null,
  fish: null,
  fireImg: null,

  load: function () {
    const resources = [
      {
        id: 'bg',
        src: 'https://hiloteam.github.io/Hilo/examples/images/map.jpg'
      },
      {
        id: 'fish',
        src: 'https://hiloteam.github.io/Hilo/examples/images/fish.png'
      },
      {
        id: 'fireImg',
        src: fireImg
      },
      {
        id: 'numberImg',
        src: numberImg
      }
    ];

    this.queue = new Hilo.LoadQueue();
    this.queue.add(resources);
    this.queue.on('complete', this.onComplete.bind(this));
    this.queue.start();
  },

  onComplete: function (e) {
    this.bg = this.queue.get('bg').content;
    this.fish = this.queue.get('fish').content;
    this.fireImg = this.queue.get('fireImg').content;
    this.numberImg = this.queue.get('numberImg').content;

    this.numberGlyphs = {
      0: { image: numberImg, rect: [0, 0, 60, 91] },
      1: { image: numberImg, rect: [61, 0, 60, 91] },
      2: { image: numberImg, rect: [121, 0, 60, 91] },
      3: { image: numberImg, rect: [191, 0, 60, 91] },
      4: { image: numberImg, rect: [261, 0, 60, 91] },
      5: { image: numberImg, rect: [331, 0, 60, 91] },
      6: { image: numberImg, rect: [401, 0, 60, 91] },
      7: { image: numberImg, rect: [471, 0, 60, 91] },
      8: { image: numberImg, rect: [541, 0, 60, 91] },
      9: { image: numberImg, rect: [611, 0, 60, 91] }
    };
    this.queue.off('complete');
    this.fire('complete');
  }
});

export default Asset;
