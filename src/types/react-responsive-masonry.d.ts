declare module 'react-responsive-masonry' {
  import { ComponentType, ReactNode } from 'react'

  interface MasonryProps {
    children: ReactNode
    columnsCount?: number
    gutter?: string | number
    defaultColumns?: number
    breakpoint?: { [key: number]: number }
  }

  const Masonry: ComponentType<MasonryProps>
  export default Masonry
}
