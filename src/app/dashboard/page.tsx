import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Filter, Search } from "lucide-react"
import TrialList from "@/components/trial-list"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

// Mock trial data
const trials = [
  {
    id: 1,
    title: "Phase 2 Study of XYZ-123 for Rare Neurological Disorder",
    condition: "Rare Neurological Disorder",
    phase: "Phase 2",
    location: "Boston, MA",
    distance: "5 miles",
    startDate: "June 2023",
    status: "Recruiting",
    participants: "15/30",
    matchScore: 92,
  },
  {
    id: 2,
    title: "Safety and Efficacy Study of ABC-456 in Patients with Rare Metabolic Disease",
    condition: "Rare Metabolic Disease",
    phase: "Phase 3",
    location: "San Francisco, CA",
    distance: "12 miles",
    startDate: "July 2023",
    status: "Recruiting",
    participants: "24/50",
    matchScore: 87,
  },
  {
    id: 3,
    title: "Observational Study of DEF-789 for Rare Autoimmune Condition",
    condition: "Rare Autoimmune Condition",
    phase: "Phase 1",
    location: "Chicago, IL",
    distance: "8 miles",
    startDate: "August 2023",
    status: "Not yet recruiting",
    participants: "0/20",
    matchScore: 78,
  },
  {
    id: 4,
    title: "Long-term Follow-up Study for Patients with Rare Genetic Disorder",
    condition: "Rare Genetic Disorder",
    phase: "Phase 4",
    location: "New York, NY",
    distance: "3 miles",
    startDate: "May 2023",
    status: "Active, not recruiting",
    participants: "40/40",
    matchScore: 65,
  },
]

export default async function Dashboard() {
  // Initialize Supabase client
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to sign-in page if not authenticated
  if (!user) {
    return redirect("/sign-in");
  }

  return ( 
    <section className="flex flex-col items-center justify-center py-12 max-w-4xl mx-auto">
      <h1 className="text-6xl font-bold text-center">
        Find Clinical Trials
      </h1>
      <p className="text-lg font-medium text-center mt-4 text-balance text-gray-500">
        Discover clinical trials for rare diseases that match <br /> your profile and location.
      </p>
      <div className="mx-auto py-12">
        <div className="flex flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4" />
            <Input type="search" placeholder="Search by condition, treatment, or keyword" className="w-[30rem] pl-8 shadow-sm bg-white" />
          </div>
          <div className="flex justify-end items-center gap-4">
            <Button variant="outline" className="hover:bg-blue-300 cursor-pointer transition-all duration-300">
              <MapPin className="h-4 w-4" />
              Location
            </Button>
            <Button variant="outline" className="hover:bg-blue-300 cursor-pointer transition-all duration-300">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        <TrialList trials={ trials } />
      </div>
    </section>
  )
}