/**
 * Restart the editor after modifying the configuration
 * Configuration item document: https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

export default {
  /** The width of each line */
  printWidth: 120,
  /** Whether to use spaces between brackets in the object */
  bracketSpacing: true,
  /** No matter how many parameters the arrow function has, they must be wrapped in brackets */
  arrowParens: 'always',
  /** Use of line breaks */
  endOfLine: 'auto',
  /** Whether to use single quotes */
  singleQuote: true,
  /** Do not add a comma after the last element of an object or array */
  trailingComma: 'none',
  /** Whether to add a semicolon */
  semi: false
}
