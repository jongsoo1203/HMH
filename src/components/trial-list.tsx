import { Badge } from "@/components/ui/badge"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar, Users, ArrowRight } from "lucide-react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card"

export default function TrialList({ trials } : { trials: object[] }) {
    return (
        <article>
            { trials.map((trial) => (
                <Card
                key={ trial.id }
                className="overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300"
                >
                <CardHeader className="pb-2">
                    <div className="flex justify-between">
                    <Badge
                        variant={ trial.status === "Recruiting" ? "default" : "secondary" }
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