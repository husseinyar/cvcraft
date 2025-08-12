
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTranslation } from '@/context/language-context';
import LanguageSwitcher from '@/components/language-switcher';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">CV Craft</Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/editor" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.create_cv')}</Link>
          <Link href="/templates" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.templates')}</Link>
          <Link href="/blog" className="text-sm font-medium text-primary hover:text-primary">{t('nav.blog')}</Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.pricing')}</Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.contact')}</Link>
          <Button variant="outline">{t('nav.login')}</Button>
          <LanguageSwitcher />
        </nav>
        <div className="md:hidden flex items-center gap-2">
           <LanguageSwitcher />
           <Button variant="outline">{t('nav.menu')}</Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">{t('blog.title')}</h2>
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
      </main>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                <div>
                    <h4 className="font-bold mb-4">{t('footer.product')}</h4>
                    <ul>
                        <li><Link href="/templates" className="hover:underline">{t('nav.templates')}</Link></li>
                        <li><Link href="#" className="hover:underline">{t('nav.pricing')}</Link></li>
                        <li><Link href="#" className="hover:underline">{t('footer.features')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">{t('footer.company')}</h4>
                    <ul>
                        <li><Link href="#" className="hover:underline">{t('footer.about')}</Link></li>
                        <li><Link href="/blog" className="hover:underline">{t('nav.blog')}</Link></li>
                        <li><Link href="/contact" className="hover:underline">{t('nav.contact')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">{t('footer.legal')}</h4>
                    <ul>
                        <li><Link href="#" className="hover:underline">{t('footer.privacy')}</Link></li>
                        <li><Link href="#" className="hover:underline">{t('footer.terms')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">{t('footer.follow_us')}</h4>
                     <ul>
                        <li><Link href="#" className="hover:underline">LinkedIn</Link></li>
                        <li><Link href="#" className="hover:underline">Twitter</Link></li>
                        <li><Link href="#" className="hover:underline">Facebook</Link></li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-xs mt-12 pt-8 border-t border-primary-foreground/20">
             <p>&copy; {new Date().getFullYear()} CV Craft. {t('footer.rights')}</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
