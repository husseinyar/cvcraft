"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCV } from '@/context/cv-context';
import type { BlogPost } from '@/types';
import { getBlogPostById, createBlogPost, updateBlogPost } from '@/services/blog-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import AdminLayout from '../../admin-layout';
import RichTextEditor from '@/components/rich-text-editor';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';


export default function EditPostPage() {
  const { user, isLoaded } = useCV();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    tags: [],
    status: 'draft'
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const isNewPost = postId === 'new';

  useEffect(() => {
    if (isLoaded && user?.role !== 'admin') {
      router.replace('/');
      return;
    }
    
    if (!isNewPost) {
      getBlogPostById(postId).then(data => {
        if (data) {
          setPost(data);
        } else {
          toast({ title: "Error", description: "Post not found.", variant: "destructive" });
          router.push('/admin/dashboard');
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [isLoaded, user, postId, isNewPost, router, toast]);
  
  const handleContentChange = useCallback((value: string) => {
    setPost(p => ({ ...p, content: value }));
  }, []);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!post.tags?.includes(newTag)) {
        setPost(p => ({ ...p, tags: [...(p.tags || []), newTag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(p => ({ ...p, tags: p.tags?.filter(tag => tag !== tagToRemove) }));
  };

  const handleSave = async () => {
    if (!post.title) {
        toast({ title: "Title is required", variant: "destructive" });
        return;
    }
    setIsSaving(true);
    try {
        if (isNewPost) {
            const newPostId = await createBlogPost(post as Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>);
            toast({ title: "Post Created", description: "Your new blog post has been saved." });
            router.replace(`/admin/edit/${newPostId}`); // Go to edit page for the new post
        } else {
            await updateBlogPost(postId, post);
            toast({ title: "Post Updated", description: "Your changes have been saved." });
        }
    } catch (error) {
        toast({ title: "Error", description: "Failed to save post.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
            <ArrowLeft className="mr-2" /> Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isNewPost ? "Create New Post" : "Edit Post"}</CardTitle>
          <CardDescription>Fill in the details for your blog post below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={post.title} 
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              placeholder="Your post title"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor
              value={post.content || ''}
              onChange={handleContentChange}
            />
          </div>

           <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input 
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag and press Enter"
            />
             <div className="flex flex-wrap gap-2 mt-2">
              {post.tags?.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
            {isNewPost ? 'Create Post' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
