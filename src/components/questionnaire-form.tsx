"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormMessage, Message } from "@/components/form-message";

export default function PatientQuestionnaire() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<Message | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    ethnicity: '',
    location: '',
    phone: '',
    email: '',
    condition: '',
    medications: '',
    condition_description: '',
    allergies: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      sex: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormMessage(null);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setFormMessage({ error: 'You must be logged in to submit this form' });
        setLoading(false);
        return;
      }

      // Insert the form data into the clients table
      const { error: insertError } = await supabase
        .from('clients')
        .insert([
          {
            // Include the user ID to link this profile to the authenticated user
            user_id: user.id,
            name: formData.name,
            age: parseInt(formData.age) || null,
            sex: formData.sex,
            ethnicity: formData.ethnicity,
            location: formData.location,
            phone: formData.phone,
            email: formData.email || user.email,
            condition: formData.condition,
            medications: formData.medications,
            condition_description: formData.condition_description,
            allergies: formData.allergies,
            created_at: new Date().toISOString(),
          }
        ]);
      
      if (insertError) throw insertError;
      
      setFormMessage({ success: 'Your information has been submitted successfully! Redirecting...' });
      
      // Redirect to dashboard after successful submission
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting patient data:', error);
      setFormMessage({
        error: error.message || 'Failed to submit your information. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Patient Questionnaire</h1>
          <p className="mb-4">Please fill out the following information to complete your profile.</p>
          
          {formMessage && <FormMessage message={formMessage} />}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select value={formData.sex} onValueChange={handleSelectChange}>
                    <SelectTrigger id="sex">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ethnicity">Ethnicity/Race</Label>
                  <Input
                    id="ethnicity"
                    name="ethnicity"
                    value={formData.ethnicity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Medical Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="condition">Name of Disease/Condition</Label>
                <Input
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition_description">
                  Disease Description (type, symptoms, details)
                </Label>
                <Textarea
                  id="condition_description"
                  name="condition_description"
                  value={formData.condition_description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Submitting...' : 'Submit Information'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}