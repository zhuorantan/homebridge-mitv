import MiTVAccessory from './accessory'

function registerPlatform(homebridge) {
    MiTVPlatform.homebridge = homebridge

    homebridge.registerPlatform('homebridge-mitv', 'MiTVPlatform', MiTVPlatform)
}

class MiTVPlatform {

    constructor(log, config, api) {
        this.log = log
        this.api = api
        this.tvs = config.tvs || config.tv && [config.tv] || []
    }

    accessories(callback) {
        const accessories = this.tvs.map(config => new MiTVAccessory(MiTVPlatform.homebridge, this, config))
        callback(accessories)
    }

}

export default registerPlatform
