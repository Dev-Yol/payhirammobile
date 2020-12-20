let primary = '#3F0050'
let secondary = '#22B173'
let tertiary = '#FFFACA'
export default {
  primaryDark: '#3F0050',
  primary: primary,
  danger: '#ff0000',
  warning: '#ffc107',
  warning: '#F2994A',
  secondary: secondary,
  tertiary: tertiary,
  white: '#ffffff',
  gray: '#cccccc',
  lightGray: '#eeeeee',
  darkGray: '#555555',
  normalGray: '#999',
  black: '#000',
  success: '#22B173',
  info: '#0066FF',
  setPrimary(color) {
    this.primary = color
  },
  setSecondary(color) {
    this.secondary = color
  },
  setTertiary(color) {
    this.tertiary = color
  }
}