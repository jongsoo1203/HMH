"use client"

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, MapPin, Phone, Mail, Pill, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Client } from '@/app/types/client';

export default function PatientProfile() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        
        // Get the current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!user) {
          setError('You must be logged in to view this page');
          return;
        }
        
        // Fetch the client data for this user
        const { data, error: fetchError } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (fetchError) throw fetchError;
        
        if (!data) {
          setError('Profile not found. Please complete your questionnaire first.');
          return;
        }
        
        setProfileData(data);
      } catch (err: any) {
        console.error('Error fetching profile data:', err);
        setError(err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfileData();
  }, []);

  // Function to get initials from name
  const getInitials = (name: string | undefined): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-32 bg-gray-300 rounded"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="border-red-200">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Unable to Load Profile</h2>
            <p className="mb-6">{error}</p>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/questionnaire">Complete Questionnaire</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="bg-gradient-to-b from-background to-muted/20">
        <CardContent className="p-0">
          {/* Header with background gradient */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 h-48 rounded-t-lg">
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                  {getInitials(profileData?.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute top-4 right-4">
              <Button asChild variant="outline" className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30">
                <Link href="/questionnaire">Edit Profile</Link>
              </Button>
            </div>
          </div>
          
          {/* Profile Information */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">{profileData?.name || 'Anonymous User'}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData?.location || 'No location provided'}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Badge variant="outline" className="font-normal text-sm py-1 px-3">
                  {profileData?.condition || 'No condition specified'}
                </Badge>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medical">Medical Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        <UserCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-center">Personal</h3>
                      <Separator className="my-3" />
                      <div className="w-full space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age:</span>
                          <span className="font-medium">{profileData?.age || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sex:</span>
                          <span className="font-medium">{profileData?.sex || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ethnicity:</span>
                          <span className="font-medium">{profileData?.ethnicity || 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                        <Pill className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-medium text-center">Medical</h3>
                      <Separator className="my-3" />
                      <div className="w-full space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Condition:</span>
                          <span className="font-medium">{profileData?.condition || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Allergies:</span>
                          <span className="font-medium">{profileData?.allergies ? 'Yes' : 'None reported'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Medications:</span>
                          <span className="font-medium">{profileData?.medications ? 'Yes' : 'None'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                        <Phone className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="font-medium text-center">Contact</h3>
                      <Separator className="my-3" />
                      <div className="w-full space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">{profileData?.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium truncate max-w-[140px]">{profileData?.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{profileData?.location || 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="medical" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        Condition Details
                      </h3>
                      <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
                        {profileData?.condition_description || 'No condition description provided.'}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Pill className="h-5 w-5 mr-2 text-green-600" />
                        Current Medications
                      </h3>
                      <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
                        {profileData?.medications || 'No medications listed.'}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                        Allergies
                      </h3>
                      <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
                        {profileData?.allergies || 'No allergies reported.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contact" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-4 bg-muted/30 p-4 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Email Address</h4>
                          <p className="text-muted-foreground">{profileData?.email || 'No email provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 bg-muted/30 p-4 rounded-lg">
                        <Phone className="h-5 w-5 text-amber-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Phone Number</h4>
                          <p className="text-muted-foreground">{profileData?.phone || 'No phone provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 bg-muted/30 p-4 rounded-lg md:col-span-2">
                        <MapPin className="h-5 w-5 text-indigo-600 mt-1" />
                        <div>
                          <h4 className="font-medium">Location</h4>
                          <p className="text-muted-foreground">{profileData?.location || 'No location provided'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                      <Button className="mr-2" asChild>
                        <Link href={`mailto:${profileData?.email}`}>
                          Send Email
                        </Link>
                      </Button>
                      {profileData?.phone && (
                        <Button variant="outline" asChild>
                          <Link href={`tel:${profileData?.phone}`}>
                            Call
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}