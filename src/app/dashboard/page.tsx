import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Filter, Search } from "lucide-react"
import TrialList from "@/components/trial-list"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

// allows the authentication check to be done on the server
export default async function Dashboard() {
  // Initialize Supabase client
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to log in page if not authenticated
  if (!user) {
    return redirect("/");
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
        <TrialList />
      </div>
    </section>
  )
}