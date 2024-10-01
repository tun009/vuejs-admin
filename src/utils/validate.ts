import {
  regexDomain,
  regexEmail,
  regexExternalLink,
  regexFormat24Hours,
  regexIPv4,
  regexIdCard,
  regexMac,
  regexPassword,
  regexPhoneNumber,
  regexUrl,
  regexUrlPort,
  regexVersion
} from './constants/regex'

import { useI18n } from 'vue-i18n'

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

/** Determine if it is an IPv4 address */
export const isIPv4 = (ip: string) => {
  const reg = regexIPv4
  return reg.test(ip)
}

export const requireRule = () => {
  const { t } = useI18n()
  return { required: true, message: t('validate.required'), trigger: 'blur' }
}

export const phoneNumberRule = () => {
  const { t } = useI18n()
  return { pattern: regexPhoneNumber, message: t('validate.phoneNumber'), trigger: 'blur' }
}

export const limitLengthRule = ({ min, max }: { min: number; max: number }) => {
  const { t } = useI18n()
  return { max, min, message: t('validate.limit', { min, max }), trigger: 'blur' }
}

export const passwordRule = () => {
  const { t } = useI18n()
  return { pattern: regexPassword, message: t('validate.password'), trigger: 'blur' }
}
