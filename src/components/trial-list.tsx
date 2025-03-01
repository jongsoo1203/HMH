import { Badge } from "@/components/ui/badge"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar, Users, ArrowRight } from "lucide-react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card"
import { getTrials } from "../app/api/trials"
import { type Trial } from "../app/types/trial"

export default async function TrialList() {
    const response = await getTrials();
    const data = await response.json();

    // Correctly map the data structure based on the console output
    const trials: Trial[] = data.studies.map((study: any) => {
        const protocolSection = study.protocolSection || {};

        return {
            nctId: protocolSection.identificationModule?.nctId || 'Unknown ID',
            title: protocolSection.identificationModule?.briefTitle || 'No Title',
            condition: protocolSection.conditionsModule?.conditions || [],
            conditionKeywords: protocolSection.conditionsModule?.keywords || [],
            phase: protocolSection.designModule?.phases?.[0] || 'Not Specified',
            locations: protocolSection.contactsLocationsModule?.locations || [],
            startDate: protocolSection.statusModule?.startDateStruct?.date || 'Unknown',
            status: protocolSection.statusModule?.overallStatus || 'Unknown',
            participants: protocolSection.designModule?.enrollmentInfo?.count || 'Not Specified'
        };
    });

    console.log("Processed trials:", trials);

    return (
        <article className="space-y-4">
            {trials.length > 0 ? (
                trials.map((trial) => (
                    <Card
                        key={trial.nctId}
                        className="overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300"
                    >
                        <CardHeader className="pb-2">
                            <div className="flex justify-between">
                                <Badge
                                    variant="outline"
                                    className="bg-opacity-90"
                                >
                                    {trial.status}
                                </Badge>
                                <Badge variant="outline" className="font-medium">
                                    {trial.phase}
                                </Badge>
                            </div>
                            <CardTitle className="text-xl mt-2">{trial.title}</CardTitle>
                            <CardDescription className="text-base text-primary-700">
                                {Array.isArray(trial.condition) ? trial.condition.join(', ') : trial.condition}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-secondary-600" />
                                    <div className="flex flex-row gap-1">
                                        {Array.isArray(trial.locations) && trial.locations.length > 0 ? (
                                            trial.locations.map((location, index) => (
                                                <span key={index} className="border border-primary-200 rounded-md p-1">
                                                    {location.state && location.country
                                                        ? `${location.state}, ${location.country}`
                                                        : location.state || location.country || 'Unknown Location'}
                                                </span>
                                            ))
                                        ) : (
                                            <span>No locations specified</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-secondary-600" />
                                    <span>Start: {trial.startDate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-secondary-600" />
                                    <span>Participants: {trial.participants}</span>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2"></div>
                            <div className="text-sm font-medium">Match Score:</div>
                        </CardContent>
                        <CardFooter className="pt-2">
                            <Link href={`/trials/${trial.nctId}`} className="w-full">
                                <Button variant="outline" className="w-full gap-1 hover:bg-primary-50 transition-colors">
                                    View Details
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <div className="text-center p-6">
                    <p>No trials found</p>
                </div>
            )}
        </article>
    );
}