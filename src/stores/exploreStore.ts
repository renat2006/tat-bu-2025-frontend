import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SentenceItem = {
  id: string
  sentence_ru: string
  sentence_tt: string
  target_word_ru?: string
  target_word_tt?: string
  created_at: number
}

type ExploreState = {
  selected: string[]
  history: SentenceItem[]
  addWord: (word: string) => void
  removeWord: (word: string) => void
  clearSelected: () => void
  addSentence: (item: Omit<SentenceItem, 'id' | 'created_at'>) => void
}

export const useExploreStore = create<ExploreState>()(
  persist(
    (set, get) => ({
      selected: [],
      history: [],
      addWord: (word) =>
        set((s) => ({
          selected: s.selected.includes(word)
            ? s.selected
            : [...s.selected, word],
        })),
      removeWord: (word) =>
        set((s) => ({ selected: s.selected.filter((w) => w !== word) })),
      clearSelected: () => set({ selected: [] }),
      addSentence: (item) =>
        set((s) => ({
          history: [
            {
              id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
              created_at: Date.now(),
              ...item,
            },
            ...s.history,
          ].slice(0, 50),
        })),
    }),
    { name: 'explore-store' },
  ),
)
