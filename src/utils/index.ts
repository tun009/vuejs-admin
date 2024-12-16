import dayjs from 'dayjs'
import { removeConfigLayout } from '@/utils/cache/local-storage'
import { formatYYYYMMDDHHmmss } from '../constants/date'
import { regexAccents1, regexAccents2, regexAccents3 } from '../constants/regex'

/** Format time */
export const formatDateTime = (time: string | number | Date) => {
  return time ? dayjs(new Date(time)).format(formatYYYYMMDDHHmmss) : 'N/A'
}

/** Get global css variables with JS */
export const getCssVariableValue = (cssVariableName: string) => {
  let cssVariableValue = ''
  try {
    // When no value is obtained, an empty string will be returned
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
  } catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

/** Set global CSS variables with JS */ export const setCssVariableValue = (
  cssVariableName: string,
  cssVariableValue: string
) => {
  try {
    document.documentElement.style.setProperty(cssVariableName, cssVariableValue)
  } catch (error) {
    console.error(error)
  }
}

/** Reset project configuration */
export const resetConfigLayout = () => {
  removeConfigLayout()
  location.reload()
}

export const removeAccents = (str: string) => {
  const res = str.normalize('NFD').replace(regexAccents1, '').replace(regexAccents2, 'd').replace(regexAccents3, 'D')
  return res
}

export const removeAccentsAndReplaceSpaces = (word: string): string => {
  const lowerCaseWord = word.toLowerCase()
  const wordWithoutAccents = lowerCaseWord.normalize('NFD').replace(regexAccents1, '')
  const wordWithUnderscores = wordWithoutAccents.replace(/ /g, '_')

  return wordWithUnderscores
}
