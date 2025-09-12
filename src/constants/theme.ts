export const colors = {
  brandGreen: '#BCFB6C',
  surface: '#F6F4F4',
  ink: '#111217',
  glassDark: 'rgba(18,18,22,0.5)',
} as const

export type ColorToken = keyof typeof colors
