import request from 'request-promise';

export const KEYS = {
  sleep: ['power', 'right', 'right', 'enter'],
  power: 'power',
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
  home: 'home',
  enter: 'enter',
  back: 'back',
  menu: 'menu',
  volumeUp: 'volumeup',
  volumeDown: 'volumedown',
};

export class MiTV {
  constructor(readonly name: string, private readonly ip: string) {}

  async wake() {
    return this.pressKey(KEYS.power);
  }

  async sleep() {
    return this.pressKey(KEYS.sleep);
  }

  async pressKey(key: string | string[]) {
    if (Array.isArray(key)) {
      await this.pressKey(key[0]);
      for (const subKey of key.slice(1)) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.pressKey(subKey);
      }

      return
    }

    const url = `http://${this.ip}:6095/controller?action=keyevent&keycode=${key}`;

    const result = await request(url);
    if (JSON.parse(result).msg !== 'success') {
      throw new Error("Key request failed!");
    }
  }
}
