import React from 'react';
import Link from 'next/link';
interface BlogPostProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  link: string;
  slug: string;
}
import Image from 'next/image';

interface BlogListProps {
  posts: BlogPostProps[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <div className="bg-dark-blue py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Latest from Our Blog
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Insights, updates, and industry trends
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col items-start">
              <div className="relative w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-white/10 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  width={500}
                  height={300}
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
              </div>
              <div className="max-w-xl">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={post.date} className="text-white/60">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="text-white/60">•</span>
                  <span className="text-white/60">{post.author}</span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    <Link href={post.link}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-white/80">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList; 