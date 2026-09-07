'use client'

import { Suspense } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PAGE_SIZE } from '@/lib/utils/search'

interface Props {
  total: number
  currentPage: number
}

function PaginationInner({ total, currentPage }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (totalPages <= 1) return null

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('pagina', String(page))
    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }

  const pages: (number | '…')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page, i) =>
        page === '…' ? (
          <span key={`ellipsis-${i}`} className="px-3 py-2 text-slate-400 text-sm">…</span>
        ) : (
          <button
            key={page}
            onClick={() => goTo(page)}
            className={`min-w-[36px] h-9 rounded-xl border text-sm font-medium transition-colors ${
              page === currentPage
                ? 'border-accent bg-accent text-white'
                : 'border-slate-200 text-slate-600 hover:border-accent hover:text-accent'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function Pagination(props: Props) {
  return (
    <Suspense fallback={null}>
      <PaginationInner {...props} />
    </Suspense>
  )
}
