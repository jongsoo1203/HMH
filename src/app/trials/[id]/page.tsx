// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { ArrowLeft, MapPin, Calendar, Clock, Users, FileText, CheckCircle, AlertCircle } from "lucide-react"
// import { type Trial } from "../../types/trial"
// import { getTrialById } from "../../api/trials"

// export default async function TrialDetailsPage({ params }: { params: { id: string } }) {
//   const response = await getTrialById(params.id)
//   const trial: Trial = await response.json()

//   return (
//     <div className="flex flex-col min-h-screen">
//       <main className="flex-1">
//         <div className="container px-4 py-8 md:px-6 md:py-12">
//           <Link
//             href="/"
//             className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Trials
//           </Link>

//           <div className="grid gap-6 lg:grid-cols-3">
//             <div className="lg:col-span-2 space-y-6">
//               <div>
//                 <div className="flex items-center gap-2 mb-2">
//                   <Badge variant={trial.status === "Recruiting" ? "default" : "secondary"}>{trial.status}</Badge>
//                   <Badge variant="outline">{trial.phase}</Badge>
//                 </div>
//                 <h1 className="text-2xl font-bold md:text-3xl">{trial.title}</h1>
//                 <p className="text-muted-foreground mt-1">{trial.conditions.join(', ')}</p>
//               </div>

//               <Tabs defaultValue="overview" className="w-full">
//                 <TabsList className="grid w-full grid-cols-4">
//                   <TabsTrigger value="overview">Overview</TabsTrigger>
//                   <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
//                   <TabsTrigger value="procedures">Procedures</TabsTrigger>
//                   <TabsTrigger value="risks">Risks & Benefits</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="overview" className="space-y-4 pt-4">
//                   <div>
//                     <h3 className="font-medium mb-2">Description</h3>
//                     <p className="text-muted-foreground">{trial.description}</p>
//                   </div>
//                   <div className="grid gap-4 md:grid-cols-2">
//                     <div className="flex items-start gap-2">
//                       <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
//                       <div>
//                         <h4 className="font-medium">Location</h4>
//                         <p className="text-sm text-muted-foreground">{trial.locations.map(location => `${location.state}, ${location.country}`).join(', ')}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
//                       <div>
//                         <h4 className="font-medium">Timeline</h4>
//                         <p className="text-sm text-muted-foreground">Start: {trial.startDate}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
//                       <div>
//                         <h4 className="font-medium">Enrollment</h4>
//                         <p className="text-sm text-muted-foreground">Participants: {trial.participants}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
//                       <div>
//                         <h4 className="font-medium">Principal Investigator</h4>
//                         <p className="text-sm text-muted-foreground">{trial.principalInvestigator}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="eligibility" className="space-y-4 pt-4">
//                   <h3 className="font-medium mb-2">Eligibility Criteria</h3>
//                   <ul className="space-y-2">
//                     {trial.eligibilityCriteria.split('\n').map((criterion, index) => (
//                       <li key={index} className="flex items-start gap-2">
//                         <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
//                         <span className="text-muted-foreground">{criterion}</span>
//                       </li>
//                     ))}
//                   </ul>
//                   <div className="bg-muted p-4 rounded-lg mt-4">
//                     <p className="text-sm text-muted-foreground">
//                       Note: Additional eligibility criteria may apply. The study team will determine if you are eligible
//                       during the screening process.
//                     </p>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="procedures" className="space-y-4 pt-4">
//                   <h3 className="font-medium mb-2">Study Procedures</h3>
//                   <ul className="space-y-2">
//                     {trial.procedures.map((procedure, index) => (
//                       <li key={index} className="flex items-start gap-2">
//                         <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
//                         <span className="text-muted-foreground">{procedure}</span>
//                       </li>
//                     ))}
//                   </ul>
//                   <div className="bg-muted p-4 rounded-lg mt-4">
//                     <p className="text-sm text-muted-foreground">
//                       The study team will provide detailed information about all procedures during the informed consent
//                       process.
//                     </p>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="risks" className="space-y-4 pt-4">
//                   <div>
//                     <h3 className="font-medium mb-2">Potential Risks</h3>
//                     <ul className="space-y-2">
//                       {trial.risks.map((risk, index) => (
//                         <li key={index} className="flex items-start gap-2">
//                           <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
//                           <span className="text-muted-foreground">{risk}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div className="mt-6">
//                     <h3 className="font-medium mb-2">Potential Benefits</h3>
//                     <ul className="space-y-2">
//                       {trial.benefits.map((benefit, index) => (
//                         <li key={index} className="flex items-start gap-2">
//                           <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
//                           <span className="text-muted-foreground">{benefit}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>

//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Interested in This Trial?</CardTitle>
//                   <CardDescription>Check your eligibility and apply to participate</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <h4 className="font-medium text-sm">Match Score</h4>
//                     <div className="flex items-center gap-2">
//                       <Progress value={85} className="h-2" />
//                       <span className="text-sm font-medium">85%</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground">Based on your profile information</p>
//                   </div>
//                   <Button className="w-full">Check Eligibility</Button>
//                   <Button variant="outline" className="w-full">
//                     Save Trial
//                   </Button>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Contact Information</CardTitle>
//                   <CardDescription>Reach out to the study team</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-1">
//                     <p className="text-sm font-medium">{trial.contactName}</p>
//                     <p className="text-sm text-muted-foreground">{trial.contactEmail}</p>
//                     <p className="text-sm text-muted-foreground">{trial.contactPhone}</p>
//                   </div>
//                   <Button variant="outline" className="w-full">
//                     Contact Study Team
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
