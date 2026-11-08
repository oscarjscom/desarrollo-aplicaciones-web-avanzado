import { Suspense } from 'react'
import BooksView from '@/components/BooksView'
import { Loading } from '@/components/ui'

export default function BooksPage() {
  return (
    <Suspense fallback={<Loading label="Cargando libros…" />}>
      <BooksView />
    </Suspense>
  )
}
