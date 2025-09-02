"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCV } from '@/context/cv-context';
import type { BlogPost } from '@/types';
import { getBlogPosts, updatePostStatus, deleteBlogPost } from '@/services/blog-service';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AdminLayout from '../admin-layout';

export default function AdminDashboardPage() {
  const { user, isLoaded } = useCV();
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);


  useEffect(() => {
    if (isLoaded) {
      if (user?.role !== 'admin') {
        router.replace('/');
      } else {
        fetchPosts();
        setAuthChecked(true);
      }
    }
  }, [user, isLoaded, router]);

  const fetchPosts = async () => {
    setIsLoading(true);
    const fetchedPosts = await getBlogPosts();
    setPosts(fetchedPosts);
    setIsLoading(false);
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await updatePostStatus(post.id, newStatus);
      setPosts(posts.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
      toast({ title: "Status Updated", description: `Post is now ${newStatus}.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update post status.", variant: "destructive" });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
        await deleteBlogPost(postId);
        setPosts(posts.filter(p => p.id !== postId));
        toast({ title: "Post Deleted", description: "The blog post has been permanently removed." });
    } catch (error) {
        toast({ title: "Error", description: "Failed to delete post.", variant: "destructive" });
    }
  };

  if (!isLoaded || !authChecked || isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold">Blog Dashboard</h1>
            <p className="text-muted-foreground">Create, edit, and manage your blog posts.</p>
        </div>
        <Button onClick={() => router.push('/admin/edit/new')}>
          <PlusCircle className="mr-2" /> New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>All Posts</CardTitle>
            <CardDescription>You have {posts.length} post(s).</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="divide-y">
                {posts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No posts created yet.</p>
                ) : (
                  posts.map(post => (
                      <div key={post.id} className="flex items-center justify-between py-4">
                          <div>
                              <h3 className="font-semibold">{post.title}</h3>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                      {post.status}
                                  </Badge>
                                  <span>- Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>
                          </div>
                          <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                  <span className="text-sm">Publish</span>
                                  <Switch
                                      checked={post.status === 'published'}
                                      onCheckedChange={() => handleTogglePublish(post)}
                                  />
                              </div>
                              <Button variant="outline" size="icon" onClick={() => router.push(`/admin/edit/${post.id}`)}>
                                  <Edit className="h-4 w-4" />
                              </Button>
                               <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                      <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete the post.
                                      </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeletePost(post.id)}>Continue</AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                              </AlertDialog>
                          </div>
                      </div>
                  ))
                )}
            </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
