import { BrowserNameInterface } from '../interface'

export class UserInfos {
  timeOpened: Date
  timezone: number
  browserName: string = 'Other'

  os: string = 'undefined'

  private browsersRegex: BrowserNameInterface[] = [
    {
      match: 'firefox',
      notMatch: 'seamonkey',
      browserName: 'Firefox',
    },
    {
      match: 'seamonkey',
      browserName: 'Seamonkey',
    },
    {
      match: 'chrome',
      notMatch: 'chromium',
      browserName: 'Chrome',
    },
    {
      match: 'chromium',
      browserName: 'Chromium',
    },
    {
      match: 'safari',
      notMatch: 'chrome|chromium',
      browserName: 'Safari',
    },
    {
      match: 'opr|opera',
      browserName: 'Opera',
    },
    {
      match: 'msie',
      browserName: 'Internet Explorer',
    },
  ]

  private osRegex: BrowserNameInterface[] = [
    {
      match: 'macintosh',
      browserName: 'Mac OS',
    },
    {
      match: 'macintel',
      browserName: 'Mac OS',
    },
    {
      match: 'macppc',
      browserName: 'Mac OS',
    },
    {
      match: 'mac68k',
      browserName: 'Mac OS',
    },
    {
      match: 'win32',
      browserName: 'Windows',
    },
    {
      match: 'Win64',
      browserName: 'Windows',
    },
    {
      match: 'windows',
      browserName: 'Windows',
    },
    {
      match: 'wince',
      browserName: 'Windows',
    },
    {
      match: 'iphone',
      browserName: 'iOS',
    },
    {
      match: 'ipad',
      browserName: 'iOS',
    },
    {
      match: 'ipod',
      browserName: 'iOS',
    },
    {
      match: 'android',
      browserName: 'Android',
    },
    {
      match: 'linux',
      browserName: 'Linux',
    },
  ]

  constructor() {
    this.timeOpened = new Date()
    this.timezone = new Date().getTimezoneOffset() / 60

    this.init()
  }

  init() {
    const userAgent = window.navigator.userAgent.toLowerCase()
    console.log(userAgent)
    this.getBrowserName(userAgent)
    this.getOS(userAgent)
  }

  pathname() {
    return window.location.pathname
  }

  referrer() {
    return document.referrer
  }

  previousSites() {
    return history.length
  }

  private getBrowserName(userAgent: string) {
    this.browsersRegex.forEach((browserRegex) => {
      const match = userAgent.match(browserRegex.match)
      const notMatch = browserRegex.notMatch ? !userAgent.match(browserRegex.notMatch) : true

      if (match && notMatch) {
        this.browserName = browserRegex.browserName
      }
    })
  }

  browserEngine() {
    return navigator.product
  }

  browserVersion1a() {
    return navigator.appVersion
  }

  browserVersion1b() {
    return navigator.userAgent
  }

  browserLanguage() {
    return navigator.language
  }

  browserOnline() {
    return navigator.onLine
  }

  browserPlatform() {
    return navigator.platform
  }

  javaEnabled() {
    return navigator.javaEnabled()
  }

  dataCookiesEnabled() {
    return navigator.cookieEnabled
  }

  dataCookies1() {
    return document.cookie
  }

  dataStorage() {
    return localStorage
  }

  sizeScreenW() {
    return screen.width
  }

  sizeScreenH() {
    return screen.height
  }

  sizeInW() {
    return innerWidth
  }

  sizeInH() {
    return innerHeight
  }

  sizeAvailW() {
    return screen.availWidth
  }

  sizeAvailH() {
    return screen.availHeight
  }

  scrColorDepth() {
    return screen.colorDepth
  }

  scrPixelDepth() {
    return screen.pixelDepth
  }

  private getOS(userAgent: string) {
    // const userAgent = window.navigator.userAgent
    // // @ts-ignore
    // const platform = window.navigator?.userAgentData?.platform || window.navigator.platform
    // const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
    // const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
    // const iosPlatforms = ['iPhone', 'iPad', 'iPod']
    // let os = 'undefined'
    //
    // if (macosPlatforms.indexOf(platform) !== -1) {
    //   os = 'Mac OS'
    // } else if (iosPlatforms.indexOf(platform) !== -1) {
    //   os = 'iOS'
    // } else if (windowsPlatforms.indexOf(platform) !== -1) {
    //   os = 'Windows'
    // } else if (/Android/.test(userAgent)) {
    //   os = 'Android'
    // } else if (/Linux/.test(platform)) {
    //   os = 'Linux'
    // }

    this.osRegex.forEach((regex) => {
      const match = userAgent.match(regex.match)
      const notMatch = regex.notMatch ? !userAgent.match(regex.notMatch) : true

      if (match && notMatch) {
        this.os = regex.browserName
      }
    })
  }
}
