
"use client";

import { useState, useEffect } from 'react';
import { useCV } from '@/context/cv-context';
import { getJobsForUser, createNewJob, deleteJob, updateJob } from '@/services/job-application-service';
import type { JobApplication } from '@/types';
import SiteLayout from '@/components/site-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Edit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ApplicationsPage() {
  const { user, isLoaded } = useCV();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<JobApplication> | null>(null);

  useEffect(() => {
    if (user && isLoaded) {
      fetchJobs();
    } else if (!user && isLoaded) {
      setIsLoading(false);
    }
  }, [user, isLoaded]);

  const fetchJobs = async () => {
    if (!user) return;
    setIsLoading(true);
    const userJobs = await getJobsForUser(user.id);
    setJobs(userJobs);
    setIsLoading(false);
  };

  const handleOpenModal = (job: JobApplication | null = null) => {
    setEditingJob(job ? { ...job } : { jobTitle: '', company: '', description: '', status: 'saved' });
    setIsModalOpen(true);
  };

  const handleDelete = async (jobId: string) => {
    if (!user) return;
    try {
      await deleteJob(user.id, jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      toast({ title: "Job Deleted", description: "The job application has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete job.", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingJob) return;
    setIsSubmitting(true);

    try {
      if ('id' in editingJob && editingJob.id) {
        // Update existing job
        await updateJob(editingJob as JobApplication);
        toast({ title: "Job Updated", description: "The job application has been saved." });
      } else {
        // Create new job
        await createNewJob(user.id, {
          jobTitle: editingJob.jobTitle || '',
          company: editingJob.company || '',
          description: editingJob.description || '',
          status: editingJob.status || 'saved',
        });
        toast({ title: "Job Created", description: "The new job has been saved and analyzed for keywords." });
      }
      await fetchJobs();
      setIsModalOpen(false);
      setEditingJob(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save job.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleStatusChange = async (job: JobApplication, newStatus: JobApplication['status']) => {
      const updatedJob = { ...job, status: newStatus };
      await updateJob(updatedJob);
      setJobs(jobs.map(j => j.id === job.id ? updatedJob : j));
  };

  return (
    <SiteLayout activeLink="applications">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Job Application Tracker</h2>
            <p className="text-lg text-muted-foreground mt-2">Keep track of all your job applications in one place.</p>
          </div>
          {user && <Button onClick={() => handleOpenModal()}><PlusCircle className="mr-2" /> Add Job</Button>}
        </div>

        {!isLoaded || isLoading ? (
          <div className="text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
        ) : !user ? (
          <Card className="text-center p-8">
            <CardTitle>Please log in</CardTitle>
            <CardDescription>You need to be logged in to track your job applications.</CardDescription>
          </Card>
        ) : jobs.length === 0 ? (
          <Card className="text-center p-8">
            <CardTitle>No jobs yet</CardTitle>
            <CardDescription>Click "Add Job" to start tracking your applications.</CardDescription>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <Card key={job.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{job.jobTitle}</CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-4">{job.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                   <Select value={job.status} onValueChange={(value) => handleStatusChange(job, value as JobApplication['status'])}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="saved">Saved</SelectItem>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="interviewing">Interviewing</SelectItem>
                            <SelectItem value="offer">Offer</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(job)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingJob?.id ? "Edit Job Application" : "Add New Job Application"}</DialogTitle>
              <DialogDescription>Fill in the details below. The description will be analyzed for keywords.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" value={editingJob?.jobTitle || ''} onChange={(e) => setEditingJob({...editingJob, jobTitle: e.target.value})} required />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={editingJob?.company || ''} onChange={(e) => setEditingJob({...editingJob, company: e.target.value})} required />
              </div>
               <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea id="description" rows={8} value={editingJob?.description || ''} onChange={(e) => setEditingJob({...editingJob, description: e.target.value})} required />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Job"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </SiteLayout>
  );
}
