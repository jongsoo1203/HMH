import { Badge } from "@/components/ui/badge"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar, Users, ArrowRight } from "lucide-react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card"

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

export default function TrialList() {
    return (
        <article className="space-y-12 mt-6">
            { trials.map((trial) => (
                <Card
                    key={ trial.id }
                    className="overflow-hidden shadow transition-all duration-300"
                >
                <CardHeader className="pb-2">
                    <div className="flex justify-between">
                    <Badge
                        variant="outline"
                        className="bg-opacity-90"
                    >
                        { trial.status }
                    </Badge>
                    <Badge variant="outline" className="font-medium">
                        { trial.phase }
                    </Badge>
                    </div>
                    <CardTitle className="text-xl mt-2">{ trial.title }</CardTitle>
                    <CardDescription className="text-base text-primary-700">{ trial.condition }</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-secondary-600" />
                        <span>{ trial.location }</span>
                        <span className="text-muted-foreground">{ trial.distance }</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-secondary-600" />
                        <span>Start: { trial.startDate }</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-secondary-600" />
                        <span>Participants: { trial.participants }</span>
                    </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                    <div className="text-sm font-medium">Match Score:</div>
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${trial.matchScore}%` }}
                        ></div>
                    </div>
                    <span className="text-sm font-medium">{ trial.matchScore }%</span>
                    </div>
                </CardContent>
                <CardFooter className="pt-2">
                    <Link href={ `/trials/${ trial.id }` } className="w-full">
                    <Button variant="outline" className="w-full gap-1 hover:bg-primary-50 transition-colors">
                        View Details
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                    </Link>
                </CardFooter>
                </Card>
            ))}
        </article>
    );
}