export interface ReviewData {
  id: string;
  image: string;
  imageAlt: string;
  rating: number;
}

export const REVIEWS_DATA: ReviewData[] = [
  {
    id: "christian",
    image: "/images/reviews-man-2.jpg",
    imageAlt: "Christian Cooper",
    rating: 5,
  },
  {
    id: "emily",
    image: "/images/young-woman.jpg",
    imageAlt: "Emily Hughes",
    rating: 5,
  },
  {
    id: "alexander",
    image: "/images/reviews-man-3.jpg",
    imageAlt: "Alexander Hayes",
    rating: 5,
  },
];
