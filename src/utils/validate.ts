import i18n from '@/locales'
import {
  regexDomain,
  regexEmail,
  regexExternalLink,
  regexFormat24Hours,
  regexIdCard,
  regexMac,
  regexPassword,
  regexPhoneNumber,
  regexUrl,
  regexUrlPort,
  regexVersion
} from '../constants/regex'

/** Determine whether it is an array */
export const isArray = (arg: unknown) => {
  return Array.isArray ? Array.isArray(arg) : Object.prototype.toString.call(arg) === '[object Array]'
}

/** Determine whether it is a string */
export const isString = (str: unknown) => {
  return typeof str === 'string' || str instanceof String
}

/** Determine whether it is an external link */
export const isExternal = (path: string) => {
  const reg = regexExternalLink
  return reg.test(path)
}

/** Determine whether it is a URL (with protocol) */
export const isUrl = (url: string) => {
  const reg = regexUrl
  return reg.test(url)
}

/** Determine whether it is a URL or IP (with port) */
export const isUrlPort = (url: string) => {
  const reg = regexUrlPort
  return reg.test(url)
}

/** Determine whether it is a domain name (without protocol) */
export const isDomain = (domain: string) => {
  const reg = regexDomain
  return reg.test(domain)
}

/** Determine if the version number format is X.Y.Z */
export const isVersion = (version: string) => {
  const reg = regexVersion
  return reg.test(version)
}

/** Determine if the time format is 24-hour system (HH:mm:ss) */
export const is24H = (time: string) => {
  const reg = regexFormat24Hours
  return reg.test(time)
}

/** Determine if it is a mobile phone number (starting with 1) */
export const isPhoneNumber = (str: string) => {
  const reg = regexPhoneNumber
  return reg.test(str)
}

/** Determine whether it is the second generation ID card (18 digits) */
export const isChineseIdCard = (str: string) => {
  const reg = regexIdCard
  return reg.test(str)
}

/** Determine whether it is Email (supports Chinese mailbox) */
export const isEmail = (email: string) => {
  const reg = regexEmail
  return reg.test(email)
}

/** Determine if it is a MAC address */
export const isMAC = (mac: string) => {
  const reg = regexMac
  return reg.test(mac)
}

export const requireRule = (trigger: 'change' | 'blur' = 'blur') => ({
  required: true,
  message: i18n.global.t('validate.required'),
  trigger
})

export const phoneNumberRule = () => ({
  pattern: regexPhoneNumber,
  message: i18n.global.t('validate.phoneNumber'),
  trigger: 'blur'
})

export const limitLengthRule = ({ min, max }: { min: number; max: number }) => ({
  max,
  min,
  message: i18n.global.t('validate.limit', { min, max }),
  trigger: 'blur'
})

export const passwordRule = () => ({
  pattern: regexPassword,
  message: i18n.global.t('validate.password'),
  trigger: 'blur'
})
export const maxValueRule = (value: number, trigger: 'change' | 'blur' = 'blur') => ({
  max: value,
  message: i18n.global.t('validate.maxValue'),
  trigger
})

export const patternRule = (pattern: RegExp) => ({
  pattern,
  message: i18n.global.t('validate.phoneNumber'),
  trigger: 'blur'
})

export const RULE_CONFIDENCE = (field: string, form: any, beforeField: string, afterField: string) => {
  console.log(field, form, beforeField, afterField)
  const validateConfidence = (_rule: any, value: any, cb: any) => {
    if (
      (beforeField && Number(value) <= Number(form.value[beforeField])) ||
      Number(value) >= Number(form.value[afterField])
    ) {
      cb(new Error())
    } else {
      cb()
    }
  }
  return [
    REQUIRED(field),
    {
      validator: validateConfidence,
      message: i18n.global.t('Ngưỡng tin cậy không hợp lệ', {
        _field_: i18n.global.t(field)
      }),
      trigger: 'blur'
    }
  ]
}

export const REQUIRED = (field: string) => {
  return {
    required: true,
    message: i18n.global.t('Trường này là bắt buộc', {
      _field_: i18n.global.t(field)
    }),
    trigger: 'blur'
  }
}
