// app/questionnaire/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PatientQuestionnaire from '@/components/questionnaire-form'

export default async function QuestionnairePage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  // If not logged in, redirect to login page
  if (!user) {
    redirect('/')
  }
  
  // Check if user has already filled out the questionnaire
  const { data: patientData } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  
  // If they already have patient data, redirect to dashboard
  if (patientData) {
    redirect('/dashboard')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <PatientQuestionnaire />
    </div>
  )
}