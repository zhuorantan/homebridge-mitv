import TV from "./tv"

class MiTVAccessory {

    constructor(homebridge, platform, config) {
        this.Service = homebridge.hap.Service
        this.Characteristic = homebridge.hap.Characteristic

        this.platform = platform
        this.tv = new TV(config.ip)
        this.name = config.name || 'Mi TV'

        this.tvService = new this.Service.Television(this.name)
        this.tvService.setCharacteristic(this.Characteristic.ConfiguredName, this.name)

        this.tvService
        .getCharacteristic(this.Characteristic.Active)
        .on('set', this.setActive.bind(this))

        this.tvService
        .getCharacteristic(this.Characteristic.RemoteKey)
        .on('set', this.pressKey.bind(this))
    }

    setActive(value, callback) {
        if (value) {
            this.platform.log("Waking TV...")
            this.tv.wake().then(() => {
                this.platform.log("Successfully waked TV...")
                callback()
            }).catch(error => {
                callback(error)
            })
        } else {
            this.platform.log("Sending TV to sleep...")
            this.tv.sleep().then(() => {
                this.platform.log("Successfully sent TV to sleep...")
                callback()
            }).catch(error => {
                callback(error)
            })
        }
    }

    pressKey(value, callback) {
        let key
        switch(value) {
            case this.Characteristic.RemoteKey.ARROW_UP:
                key = TV.keys.up
                break
            case this.Characteristic.RemoteKey.ARROW_DOWN:
                key = TV.keys.down
                break
            case this.Characteristic.RemoteKey.ARROW_LEFT:
                key = TV.keys.left
                break
            case this.Characteristic.RemoteKey.ARROW_RIGHT:
                key = TV.keys.right
                break
            case this.Characteristic.RemoteKey.SELECT:
                key = TV.keys.enter
                break
            case this.Characteristic.RemoteKey.BACK:
                key = TV.keys.back
                break
            case this.Characteristic.RemoteKey.EXIT:
                key = TV.keys.home
                break
            case this.Characteristic.RemoteKey.PLAY_PAUSE:
                key = TV.keys.enter
                break
            case this.Characteristic.RemoteKey.INFORMATION:
                key = TV.keys.menu
                break
        }

        this.platform.log(`Pressing Key: ${key}`)

        this.tv.pressKey(key).then(() => {
            this.platform.log(`Successfully pressed key: ${key}`)
            callback()
        }).catch(error => {
            callback(error)
        })
    }

    getInformationService() {
        return new this.Service.AccessoryInformation()
        .setCharacteristic(this.Characteristic.Name, this.name)
        .setCharacteristic(this.Characteristic.Manufacturer, 'Xiaomi')
    }

    getServices() {
        return [this.tvService, this.getInformationService()]
    }

}

export default MiTVAccessory
