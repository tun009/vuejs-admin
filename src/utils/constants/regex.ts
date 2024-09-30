export const regexExternalLink = /^(https?:|mailto:|tel:)/
export const regexUrl = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
export const regexUrlPort = /^((ht|f)tps?:\/\/)?[\w-]+(\.[\w-]+)+:\d{1,5}\/?$/
export const regexDomain = /^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/
export const regexVersion = /^\d+(?:\.\d+){2}$/
export const regexFormat24Hours = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/
export const regexPhoneNumber = /^(?:(?:\+|00)86)?1\d{10}$/
export const regexIdCard = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
export const regexEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
export const regexMac =
  /^(([a-f0-9][0,2,4,6,8,a,c,e]:([a-f0-9]{2}:){4})|([a-f0-9][0,2,4,6,8,a,c,e]-([a-f0-9]{2}-){4}))[a-f0-9]{2}$/i
export const regexIPv4 =
  /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/

// remove accents
export const regexAccents1 = /[\u0300-\u036f]/g
export const regexAccents2 = /đ/g
export const regexAccents3 = /Đ/g
