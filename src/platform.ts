import { AccessoryPlugin, API, Logging, PlatformConfig, StaticPlatformPlugin } from 'homebridge';
import { MiTV } from './tv';
import { MiTVAccessory } from './accessory';

interface TVConfig {
  ip: string;
  name: string;
}

export class MiTVPlatform implements StaticPlatformPlugin {
  private readonly tvs: MiTV[];

  constructor(private readonly log: Logging, config: PlatformConfig, private readonly api: API) {
    const tvConfigs: TVConfig[] = config.tvs || config.tv && [config.tv] || [];
    this.tvs = tvConfigs.map((tvConfig) => new MiTV(tvConfig.ip, tvConfig.name));
  }

  accessories(callback: (foundAccessories: AccessoryPlugin[]) => void) {
    const accessories = this.tvs.map((tv) => new MiTVAccessory(this.api, this.log, tv));
    callback(accessories);
  }
}
