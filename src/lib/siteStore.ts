
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
        heading1: "Hamur Evi",
        heading2: "Lezzetleri",
        description: "Lefkoşa'da el açması gözlemeler ve geleneksel mantı sanatını keşfedin.",
        image: "https://images.pexels.com/photos/13444454/pexels-photo-13444454.jpeg?auto=compress&cs=tinysrgb&w=1600"
      },
      {
        subheading: "Tat",
        heading1: "Otantik",
        heading2: "Mutfak",
        description: "En taze yerel malzemelerle hazırlanan eşsiz Hamur Evi tarifleri.",
        image: "https://images.pexels.com/photos/10360696/pexels-photo-10360696.jpeg?auto=compress&cs=tinysrgb&w=1600"
      },
      {
        subheading: "Gelenek",
        heading1: "El Emeği",
        heading2: "Hamur İşleri",
        description: "Mutfak sanatının samimi bir sofrada buluştuğu Hamur Evi dünyasına hoş geldiniz.",
        image: "https://images.pexels.com/photos/10184407/pexels-photo-10184407.jpeg?auto=compress&cs=tinysrgb&w=1600"
      }
    ]
  },
  story: {
    heading: "Hikayemiz",
    subtitle: "Lezzet Yolculuğu",
    blocks: [
      {
        heading: "Gelenek",
        description: "Lefkoşa'nın kalbinde, el açması böreklerin ve geleneksel harçların buluştuğu eşsiz bir mekan.",
        image: "https://images.pexels.com/photos/10184407/pexels-photo-10184407.jpeg?auto=compress&cs=tinysrgb&w=1000"
      },
      {
        heading: "Mantılar",
        description: "Özenle hazırlanan el mantılarımızla sofralarınıza zenginlik ve keyif katıyoruz.",
        image: "https://images.pexels.com/photos/10360696/pexels-photo-10360696.jpeg?auto=compress&cs=tinysrgb&w=1000"
      },
      {
        heading: "Buluşma",
        description: "Dostların ve ailenin masada bir araya geldiği, samimiyetin ve lezzetin paylaşıldığı yer.",
        image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1000"
      }
    ]
  },
  chef: {
    heading: "Ekibimiz",
    subtitle: "DENEYİMLİ",
    quote: "Her hamur, sevgiyle harmanlanan bir emektir.",
    bio1: "Hamur Evi Lefkoşa ekibi, yılların mutfak uzmanlığını ve yerel lezzetlere olan tutkusunu sofranıza taşıyor.",
    bio2: "Geleneksel Kıbrıs ve Anadolu mutfağının en seçkin el yapımı örneklerini sunmak için buradayız.",
    passionTitle: "EMEK",
    passionDesc: "Geleneksel hamur işlerine derin takdir.",
    title: "Hamur Evi Ekibi",
    name: "Hamur Evi",
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
