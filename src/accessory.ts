import { AccessoryPlugin, API, HAP, Logging } from 'homebridge';
import { KEYS, MiTV } from './tv';

export class MiTVAccessory implements AccessoryPlugin {
  constructor(private readonly api: API, private readonly log: Logging, private readonly tv: MiTV) {}

  private get hap(): HAP {
    return this.api.hap;
  }

  setActive(value: boolean, callback) {
    if (value) {
      this.log.info("Waking TV...")
      this.tv.wake().then(() => {
        this.log.info("Successfully waked TV...")
        callback()
      }).catch(error => {
        callback(error)
      })
    } else {
      this.log.info("Sending TV to sleep...")
      this.tv.sleep().then(() => {
        this.log.info("Successfully sent TV to sleep...")
        callback()
      }).catch(error => {
        callback(error)
      })
    }
  }

  pressKey(value: number, callback) {
    let key: string;
    switch (value) {
      case this.hap.Characteristic.RemoteKey.ARROW_UP:
        key = KEYS.up
        break
      case this.hap.Characteristic.RemoteKey.ARROW_DOWN:
        key = KEYS.down
        break
      case this.hap.Characteristic.RemoteKey.ARROW_LEFT:
        key = KEYS.left
        break
      case this.hap.Characteristic.RemoteKey.ARROW_RIGHT:
        key = KEYS.right
        break
      case this.hap.Characteristic.RemoteKey.SELECT:
        key = KEYS.enter
        break
      case this.hap.Characteristic.RemoteKey.BACK:
        key = KEYS.back
        break
      case this.hap.Characteristic.RemoteKey.EXIT:
        key = KEYS.home
        break
      case this.hap.Characteristic.RemoteKey.PLAY_PAUSE:
        key = KEYS.enter
        break
      case this.hap.Characteristic.RemoteKey.INFORMATION:
        key = KEYS.menu
        break
      default:
        callback()
        return
    }

    this.log.info(`Pressing Key: ${key}`)

    this.tv.pressKey(key).then(() => {
      this.log.info(`Successfully pressed key: ${key}`)
      callback()
    }).catch(error => {
      callback(error)
    })
  }

  getInformationService() {
    return new this.hap.Service.AccessoryInformation()
      .setCharacteristic(this.hap.Characteristic.Name, this.tv.name)
      .setCharacteristic(this.hap.Characteristic.Manufacturer, 'Xiaomi')
  }

  getServices() {
    const tvService = new this.hap.Service.Television(this.tv.name)
    tvService.setCharacteristic(this.hap.Characteristic.ConfiguredName, this.tv.name)

    tvService
      .getCharacteristic(this.hap.Characteristic.Active)
      .on('set', this.setActive.bind(this))

    tvService
      .getCharacteristic(this.hap.Characteristic.RemoteKey)
      .on('set', this.pressKey.bind(this))

    return [tvService, this.getInformationService()]
  }
}
