import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/iniciar-sesion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/panel')

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-5 sm:p-8">{children}</main>
    </div>
  )
}
