export interface BlogPost {
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  image: string;
  imageAlt: string;
  href: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    tag: "ARTICLES",
    title: "Savor the Flavors: A Taste of Italy",
    excerpt:
      "The Kitchen Table at The Modern offers a truly extraordinary dining experience that combines culinary excellence with a behind-the-scenes glimpse into the world of fine dining.",
    author: "David Lee",
    image: "/images/couple_dining-p-800.jpg",
    imageAlt: "Couple dining outdoors by a lake at sunset",
    href: "/blog#savor-the-flavors",
  },
  {
    tag: "FEATURED",
    title: "Our Culinary Journey Through Italy",
    excerpt:
      "Our culinary journey through Italy was an unforgettable experience. From the hearty flavors of Tuscany to the fresh seafood of Sicily, we were amazed by the diversity and quality of Italian cuisine. We can't wait to return to Italy and explore even more of its culinary treasures.",
    author: "Maria Lopez",
    image: "/images/view_of_Tuscany-p-800.jpg",
    imageAlt: "Outdoor dining table overlooking Tuscan landscape",
    href: "/blog#culinary-journey",
  },
];

export function getLatestPosts(count: number): BlogPost[] {
  return BLOG_POSTS.slice(0, count);
}
