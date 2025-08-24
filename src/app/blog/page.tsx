
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTranslation } from '@/context/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import SiteLayout from '@/components/site-layout';

export default function BlogPage() {
  const { t } = useTranslation();

  const blogPosts = [
    {
      slug: 'how-to-write-a-killer-cv',
      title: 'blog.posts.one.title',
      excerpt: 'blog.posts.one.excerpt',
      image: 'https://placehold.co/600x400.png',
      hint: 'writing desk'
    },
    {
      slug: '5-common-cv-mistakes-to-avoid',
      title: 'blog.posts.two.title',
      excerpt: 'blog.posts.two.excerpt',
      image: 'https://placehold.co/600x400.png',
      hint: 'red pen'
    },
    {
      slug: 'tailoring-your-cv-for-each-application',
      title: 'blog.posts.three.title',
      excerpt: 'blog.posts.three.excerpt',
      image: 'https://placehold.co/600x400.png',
      hint: 'sewing tailor'
    },
    {
        slug: 'the-importance-of-keywords-in-your-cv',
        title: 'blog.posts.four.title',
        excerpt: 'blog.posts.four.excerpt',
        image: 'https://placehold.co/600x400.png',
        hint: 'magnifying glass'
    },
    {
        slug: 'creative-vs-professional-cv-templates',
        title: 'blog.posts.five.title',
        excerpt: 'blog.posts.five.excerpt',
        image: 'https://placehold.co/600x400.png',
        hint: 'design art'
    },
    {
        slug: 'how-to-quantify-your-achievements',
        title: 'blog.posts.six.title',
        excerpt: 'blog.posts.six.excerpt',
        image: 'https://placehold.co/600x400.png',
        hint: 'graph chart'
    }
  ];

  return (
    <SiteLayout activeLink="blog">
      <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('blog.title')}</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('blog.subtitle')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogPosts.map(post => (
                      <Card key={post.slug} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                         <Link href={`/blog/${post.slug}`}>
                              <Image 
                                  src={post.image}
                                  alt={t(post.title as any)}
                                  width={600}
                                  height={400}
                                  className="w-full object-cover"
                                  data-ai-hint={post.hint}
                              />
                          </Link>
                          <CardContent className="p-6">
                              <h3 className="text-xl font-semibold mb-2 h-14">
                                 <Link href={`/blog/${post.slug}`}>{t(post.title as any)}</Link>
                              </h3>
                              <p className="text-muted-foreground text-sm mb-4 h-20">{t(post.excerpt as any)}</p>
                              <Link href={`/blog/${post.slug}`}>
                                  <Button variant="link" className="p-0">
                                      {t('blog.read_more')} <ArrowRight className="ml-2" />
                                  </Button>
                              </Link>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </div>
      </section>
    </SiteLayout>
  );
}
