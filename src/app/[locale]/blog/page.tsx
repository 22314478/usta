import { BlogHero } from "@/components/blog/BlogHero";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata = {
  title: "Blog | Kyma Cyprus",
  description: "Stories, recipes, and news from Kyma Cyprus.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#111]">
      <BlogHero />
      <section className="py-24 pl-[4rem] pr-[4rem]">
        <BlogPostList posts={BLOG_POSTS} />
      </section>
    </main>
  );
}
