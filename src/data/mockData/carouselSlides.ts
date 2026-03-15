export interface CarouselSlideData {
  id: number;
  image: string;
  imageAlt: string;
}

export const CAROUSEL_SLIDES_DATA: CarouselSlideData[] = [
  {
    id: 1,
    image: "/images/image-1.webp",
    imageAlt: "Italian dining experience",
  },
  {
    id: 2,
    image: "/images/image-2.webp",
    imageAlt: "Curated wine selection",
  },
  {
    id: 3,
    image: "/images/image-3.webp",
    imageAlt: "Fresh ingredients",
  },
  {
    id: 4,
    image: "/images/image-4.webp",
    imageAlt: "Elegant atmosphere",
  },
  {
    id: 5,
    image: "/images/image-5.webp",
    imageAlt: "Chef's signature",
  },
];
