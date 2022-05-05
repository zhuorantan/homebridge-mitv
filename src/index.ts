import { API } from 'homebridge';
import { MiTVPlatform } from './platform';

export default function (api: API): void {
  api.registerPlatform('MiTVPlatform', MiTVPlatform);
}
