# homebridge-mitv

**homebridge-mitv** is a plugin for [Homebridge](https://github.com/nfarina/homebridge) which allows you to control your Mi TV. Tested working for Mi TV 4A (小米电视4A)

## Features

- Turn on and off the TV
- Remote control

## Installation

Install homebridge:

```bash
npm install -g homebridge
```

Install homebridge-mitv:

```bash
npm install -g homebridge-mitv
```

## Configuration

Add `MiTVPlatform` to your `config.json` in your home directory inside `.homebridge`.

Single TV Example:

```json
{
    "platforms": [{
        "platform": "MiTVPlatform",
        "tv": {
            "ip": "192.168.1.2",
            "name": "Mi TV"
        }
    }]
}
```

Multiple TVs Example:

```json
{
    "platforms": [{
        "platform": "MiTVPlatform",
        "tvs": [{
            "ip": "192.168.1.2",
            "name": "Bedroom TV"
        }, {
            "ip": "192.168.1.3",
            "name": "Living Room TV"
        }]
    }]
}
```

## Known Issues

1. This plugin cannot detect whether the TV is sleep or not, so the status cannot be synchronized between HomeKit and TV.
2. When the remote key is pressed, HomeKit sends a "activate" command which makes homebridge-mitv send a power keystroke request. I haven't found a workaround yet. Any help would be greatly appreciated.
