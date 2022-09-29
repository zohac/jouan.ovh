import { BrowserNameInterface } from '../interface'

export class UserInfos {
  timeOpened: Date
  timezone: number
  browserName: string = 'Other'

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

  constructor() {
    this.timeOpened = new Date()
    this.timezone = new Date().getTimezoneOffset() / 60

    this.init()
  }

  init() {
    const userAgent = window.navigator.userAgent.toLowerCase()

    this.getBrowserName(userAgent)
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
}
