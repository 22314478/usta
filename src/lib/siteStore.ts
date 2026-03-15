
export interface SiteSettings {
  hero: {
    slides: {
      subheading: string;
      heading1: string;
      heading2: string;
      description: string;
      image: string;
    }[];
  };
  story: {
    heading: string;
    subtitle: string;
    blocks: {
      heading: string;
      description: string;
      image: string;
    }[];
  };
  chef: {
    heading: string;
    subtitle: string;
    quote: string;
    bio1: string;
    bio2: string;
    passionTitle: string;
    passionDesc: string;
    title: string;
    name: string;
    image: string;
  };
}

const STORAGE_KEY = 'restaurant_site_settings';

const DEFAULT_SETTINGS: SiteSettings = {
  hero: {
    slides: [
      {
        subheading: "Deneyim",
        heading1: "Maza",
        heading2: "Lezzetleri",
        description: "Lefkoşa'nın kalbinde, geleneksel meze ve ızgara sanatını keşfedin.",
        image: "https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=1600"
      },
      {
        subheading: "Tat",
        heading1: "Otantik",
        heading2: "Mutfak",
        description: "En taze yerel malzemelerle hazırlanan eşsiz Maza tarifleri.",
        image: "https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=1600"
      },
      {
        subheading: "Miras",
        heading1: "Köklü",
        heading2: "Gelenek",
        description: "Mutfak sanatının samimi bir sofrada buluştuğu Maza dünyasına hoş geldiniz.",
        image: "https://images.pexels.com/photos/3120807/pexels-photo-3120807.jpeg?auto=compress&cs=tinysrgb&w=1600"
      }
    ]
  },
  story: {
    heading: "Hikayemiz",
    subtitle: "Lezzet Yolculuğu",
    blocks: [
      {
        heading: "Gelenek",
        description: "Lefkoşa'nın kalbinde, geleneksel tariflerin modern dokunuşlarla buluştuğu eşsiz bir mekan.",
        image: "/images/landscape3.webp"
      },
      {
        heading: "Mezeler",
        description: "Özenle hazırlanan mezelerimizle sofralarınıza zenginlik ve keyif katıyoruz.",
        image: "/images/wine_menu2.webp"
      },
      {
        heading: "Buluşma",
        description: "Dostların ve ailenin masada bir araya geldiği, samimiyetin ve lezzetin paylaşıldığı yer.",
        image: "/images/square_table.webp"
      }
    ]
  },
  chef: {
    heading: "Ekibimiz",
    subtitle: "DENEYİMLİ",
    quote: "Lezzet, sevgiyle harmanlanan bir sanattır.",
    bio1: "Maza Lefkoşa ekibi, yılların mutfak uzmanlığını ve yerel lezzetlere olan tutkusunu sofranıza taşıyor.",
    bio2: "Geleneksel Kıbrıs ve Akdeniz mutfağının en seçkin örneklerini sunmak için buradayız.",
    passionTitle: "TUTKU",
    passionDesc: "Yerel lezzetlere derin takdir.",
    title: "Maza Ekibi",
    name: "Maza",
    image: "https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=1000"
  }
};

export const getSiteSettings = (): SiteSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSiteSettings = (settings: SiteSettings) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};
