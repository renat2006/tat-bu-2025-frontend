export const colors = {
  brandGreen: '#BCFB6C',
  surface: '#F6F4F4',
  ink: '#111217',
} as const

export type ColorToken = keyof typeof colors
