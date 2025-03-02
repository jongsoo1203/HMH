"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { toast } from "sonner"

// Define the form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  issueType: z.string({
    required_error: "Please select an issue type.",
  }),
  urgency: z.string({
    required_error: "Please select an urgency level.",
  }),
  message: z.string().min(20, { message: "Message must be at least 20 characters." }),
})

// Infer the type from the schema
type ContactFormValues = z.infer<typeof contactFormSchema>

// Default values for the form
const defaultValues: Partial<ContactFormValues> = {
  name: "",
  email: "",
  subject: "",
  issueType: "",
  urgency: "medium",
  message: "",
}

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Initialize the form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  })

  // Handle form submission
  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Send data to API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit form');
      }
      
      // Show success toast notification
      toast.success("Your message has been sent successfully", {
        description: "We'll get back to you as soon as possible."
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
      
      // Show error toast notification
      toast.error("Error submitting form", {
        description: "There was a problem sending your message. Please try again."
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset the form to allow another submission
  const handleReset = () => {
    setIsSubmitted(false)
    setSubmitError(null)
    form.reset(defaultValues)
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Contact Technical Support</h1>
        <p className="text-muted-foreground">
          Fill out the form below to get in touch with our technical support team. We'll respond as
          quickly as possible based on the urgency of your issue.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          {isSubmitted ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <CardTitle>Request Submitted</CardTitle>
                </div>
                <CardDescription>
                  Thank you for contacting our technical support team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  We've received your support request and will respond as soon as possible. 
                  You should receive a confirmation email shortly with your ticket number and details.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleReset}>Submit Another Request</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible so we can assist you better.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitError && (
                  <div className="mb-4 p-4 border rounded-md bg-red-50 text-red-800 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">Error submitting form</p>
                      <p className="text-sm">{submitError}</p>
                    </div>
                  </div>
                )}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief description of your issue" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="issueType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issue Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select issue type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="account">Account Access</SelectItem>
                                <SelectItem value="billing">Billing Issue</SelectItem>
                                <SelectItem value="technical">Technical Problem</SelectItem>
                                <SelectItem value="feature">Feature Request</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="urgency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Urgency</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select urgency level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low - General Inquiry</SelectItem>
                                <SelectItem value="medium">Medium - Needs Attention</SelectItem>
                                <SelectItem value="high">High - Affecting Work</SelectItem>
                                <SelectItem value="critical">Critical - System Down</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select the urgency level based on impact.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you've already tried."
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Submitting..." : "Submit Support Request"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Response Times</p>
                  <p className="text-sm text-muted-foreground">
                    Critical: 1-2 hours<br />
                    High: 4-8 hours<br />
                    Medium: 24 hours<br />
                    Low: 48 hours
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Business Hours</p>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday: 9am - 6pm EST<br />
                  Weekend: Emergency support only
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                  <AccordionContent>
                    Go to the login page and click on "Forgot Password". Follow the email instructions to reset your password.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I update my billing information?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to Settings Billing and you can update your payment methods and view invoices.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is there a mobile app available?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we have mobile apps for both iOS and Android. You can download them from the respective app stores.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContactPage