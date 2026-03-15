export interface Wine {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface Review {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  rating: number;
  text: string;
}

export interface CarouselSlide {
  id: number;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface Feature {
  id: number;
  image: string;
  imageAlt: string;
  line1: string;
  line2: string;
}

export interface HeroSlide {
  src: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
  category: 'food' | 'drink';
  stock?: number | null;
}
