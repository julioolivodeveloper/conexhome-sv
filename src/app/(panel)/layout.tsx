import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PanelSidebar from '@/components/panel/PanelSidebar'

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/iniciar-sesion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col lg:flex-row">
      <PanelSidebar
        userName={profile?.full_name ?? user.email?.split('@')[0] ?? 'Usuario'}
        userEmail={user.email ?? ''}
        avatarUrl={profile?.avatar_url}
      />
      <main className="flex-1 min-w-0 p-5 sm:p-8">{children}</main>
    </div>
  )
}
