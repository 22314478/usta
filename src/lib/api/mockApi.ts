import { Wine, Review, CarouselSlide, Feature, HeroSlide } from './types';

// Mock database - در پروژه واقعی این از دیتابیس یا API خارجی می‌آید
const MOCK_DATABASE = {
  wines: {
    en: [
      {
        id: "barolo",
        name: "Barolo",
        price: "$85",
        description: "Full-bodied red from Piedmont with notes of cherry, rose, and truffle."
      },
      {
        id: "barbaresco",
        name: "Barbaresco",
        price: "$78",
        description: "Elegant Nebbiolo with refined tannins and floral aromatics."
      },
      {
        id: "chianti",
        name: "Chianti Classico",
        price: "$62",
        description: "Classic Tuscan red with bright cherry and earthy undertones."
      },
      {
        id: "prosecco",
        name: "Prosecco",
        price: "$48",
        description: "Sparkling white with crisp apple and pear notes."
      },
      {
        id: "soave",
        name: "Soave",
        price: "$52",
        description: "Refreshing white wine with citrus and almond flavors."
      }
    ],
    fa: [
      {
        id: "barolo",
        name: "بارولو",
        price: "۸۵ دلار",
        description: "شراب قرمز پرطعم از پیمونت با نت‌های گیلاس، گل رز و قارچ دنبلان."
      },
      {
        id: "barbaresco",
        name: "باربارسکو",
        price: "۷۸ دلار",
        description: "نبیولو ظریف با تانن‌های نرم و عطر گلی."
      },
      {
        id: "chianti",
        name: "کیانتی کلاسیکو",
        price: "۶۲ دلار",
        description: "شراب قرمز کلاسیک توسکانی با گیلاس روشن و زیرلایه‌های خاکی."
      },
      {
        id: "prosecco",
        name: "پروسکو",
        price: "۴۸ دلار",
        description: "شراب سفید گازدار با نت‌های سیب و گلابی تند."
      },
      {
        id: "soave",
        name: "سواوه",
        price: "۵۲ دلار",
        description: "شراب سفید طراوت‌بخش با طعم مرکبات و بادام."
      }
    ],
    it: [
      {
        id: "barolo",
        name: "Barolo",
        price: "€85",
        description: "Rosso corposo del Piemonte con note di ciliegia, rosa e tartufo."
      },
      {
        id: "barbaresco",
        name: "Barbaresco",
        price: "€78",
        description: "Elegante Nebbiolo con tannini raffinati e aromi floreali."
      },
      {
        id: "chianti",
        name: "Chianti Classico",
        price: "€62",
        description: "Classico rosso toscano con ciliegia brillante e note terrose."
      },
      {
        id: "prosecco",
        name: "Prosecco",
        price: "€48",
        description: "Bianco frizzante con note croccanti di mela e pera."
      },
      {
        id: "soave",
        name: "Soave",
        price: "€52",
        description: "Vino bianco rinfrescante con sapori di agrumi e mandorla."
      }
    ],
    el: [
      {
        id: "barolo",
        name: "Barolo",
        price: "€85",
        description: "Πλούσιο κόκκινο από το Piedmont με νότες κερασιού, τριαντάφυλλου και τρούφας."
      },
      {
        id: "barbaresco",
        name: "Barbaresco",
        price: "€78",
        description: "Κομψό Nebbiolo με εκλεπτυσμένες τανίνες και φλοράλ αρώματα."
      },
      {
        id: "chianti",
        name: "Chianti Classico",
        price: "€62",
        description: "Κλασικό τοσκανικό κόκκινο με φωτεινό κεράσι και γήινες υποτονίες."
      },
      {
        id: "prosecco",
        name: "Prosecco",
        price: "€48",
        description: "Αφρώδες λευκό με τραγανές νότες μήλου και αχλαδιού."
      },
      {
        id: "soave",
        name: "Soave",
        price: "€52",
        description: "Αναζωογονητικό λευκό κρασί με γεύσεις εσπεριδοειδών και αμυγδάλου."
      }
    ],
    tr: [
      {
        id: "barolo",
        name: "Barolo",
        price: "₺85",
        description: "Piedmont'tan kiraz, gül ve trüf notaları olan tam gövdeli kırmızı."
      },
      {
        id: "barbaresco",
        name: "Barbaresco",
        price: "₺78",
        description: "Rafine tanenler ve çiçeksi aromalar içeren zarif Nebbiolo."
      },
      {
        id: "chianti",
        name: "Chianti Classico",
        price: "₺62",
        description: "Parlak kiraz ve toprak tonları olan klasik Toskana kırmızısı."
      },
      {
        id: "prosecco",
        name: "Prosecco",
        price: "₺48",
        description: "Çıtır elma ve armut notaları olan köpüklü beyaz."
      },
      {
        id: "soave",
        name: "Soave",
        price: "₺52",
        description: "Narenciye ve badem aromaları olan ferahlatıcı beyaz şarap."
      }
    ],
    ru: [
      {
        id: "barolo",
        name: "Бароло",
        price: "₽85",
        description: "Полнотелое красное из Пьемонта с нотами вишни, розы и трюфеля."
      },
      {
        id: "barbaresco",
        name: "Барбареско",
        price: "₽78",
        description: "Элегантное Неббиоло с утонченными танинами и цветочными ароматами."
      },
      {
        id: "chianti",
        name: "Кьянти Классико",
        price: "₽62",
        description: "Классическое тосканское красное с яркой вишней и землистыми оттенками."
      },
      {
        id: "prosecco",
        name: "Просекко",
        price: "₽48",
        description: "Игристое белое с хрустящими нотами яблока и груши."
      },
      {
        id: "soave",
        name: "Соаве",
        price: "₽52",
        description: "Освежающее белое вино с цитрусовыми и миндальными вкусами."
      }
    ]
  },
  reviews: {
    en: [
      {
        id: "christian",
        name: "Christian Cooper",
        image: "/images/reviews-man-2.jpg",
        imageAlt: "Christian Cooper",
        rating: 5,
        text: "Italiano exceeded my expectations! The staff was incredibly attentive and friendly, ensuring we had everything we needed. The Bistecca was cooked just the way I like it, and the tiramisu was the best I've ever had. The service, combined with the delicious food, made for an unforgettable evening."
      },
      {
        id: "emily",
        name: "Emily Hughes",
        image: "/images/young-woman.jpg",
        imageAlt: "Emily Hughes",
        rating: 5,
        text: "A truly magical dining experience. From the moment we walked in, we felt like family. The pasta was fresh and perfectly seasoned, and the wine pairing recommendations were spot-on. We'll definitely be back."
      },
      {
        id: "alexander",
        name: "Alexander Hayes",
        image: "/images/reviews-man-3.jpg",
        imageAlt: "Alexander Hayes",
        rating: 5,
        text: "Exceptional Italian cuisine in an elegant setting. The Osso Buco was tender and flavorful, and the dessert selection was impressive. The attention to detail in both food and service made our anniversary dinner unforgettable."
      }
    ],
    fa: [
      {
        id: "christian",
        name: "کریستین کوپر",
        image: "/images/reviews-man-2.jpg",
        imageAlt: "Christian Cooper",
        rating: 5,
        text: "ایتالیانو از انتظارات من فراتر رفت! کارکنان فوق‌العاده دقیق و دوستانه بودند و اطمینان حاصل کردند که همه چیز مورد نیاز ما را داریم. بیستکا دقیقاً همان‌طور که دوست دارم پخته شده بود و تیرامیسو بهترینی بود که تا به حال خورده‌ام."
      },
      {
        id: "emily",
        name: "امیلی هیوز",
        image: "/images/young-woman.jpg",
        imageAlt: "Emily Hughes",
        rating: 5,
        text: "یک تجربه غذایی واقعاً جادویی. از لحظه‌ای که وارد شدیم، احساس خانواده کردیم. پاستا تازه و کاملاً چاشنی‌دار بود و توصیه‌های جفت شراب عالی بود."
      },
      {
        id: "alexander",
        name: "الکساندر هیز",
        image: "/images/reviews-man-3.jpg",
        imageAlt: "Alexander Hayes",
        rating: 5,
        text: "غذای ایتالیایی استثنایی در محیطی شیک. اوسوبوکو نرم و خوش‌طعم بود و انتخاب دسرها چشمگیر بود."
      }
    ],
    it: [
      {
        id: "christian",
        name: "Christian Cooper",
        image: "/images/reviews-man-2.jpg",
        imageAlt: "Christian Cooper",
        rating: 5,
        text: "Italiano ha superato le mie aspettative! Il personale era incredibilmente attento e cordiale, assicurandosi che avessimo tutto ciò di cui avevamo bisogno."
      },
      {
        id: "emily",
        name: "Emily Hughes",
        image: "/images/young-woman.jpg",
        imageAlt: "Emily Hughes",
        rating: 5,
        text: "Un'esperienza culinaria davvero magica. Dal momento in cui siamo entrati, ci siamo sentiti come in famiglia."
      },
      {
        id: "alexander",
        name: "Alexander Hayes",
        image: "/images/reviews-man-3.jpg",
        imageAlt: "Alexander Hayes",
        rating: 5,
        text: "Cucina italiana eccezionale in un ambiente elegante. L'Osso Buco era tenero e saporito."
      }
    ],
    el: [
      {
        id: "christian",
        name: "Christian Cooper",
        image: "/images/reviews-man-2.jpg",
        imageAlt: "Christian Cooper",
        rating: 5,
        text: "Το Italiano ξεπέρασε τις προσδοκίες μου! Το προσωπικό ήταν απίστευτα προσεκτικό και φιλικό."
      },
      {
        id: "emily",
        name: "Emily Hughes",
        image: "/images/young-woman.jpg",
        imageAlt: "Emily Hughes",
        rating: 5,
        text: "Μια πραγματικά μαγική γαστρονομική εμπειρία. Από τη στιγμή που μπήκαμε, νιώσαμε σαν οικογένεια."
      },
      {
        id: "alexander",
        name: "Alexander Hayes",
        image: "/images/reviews-man-3.jpg",
        imageAlt: "Alexander Hayes",
        rating: 5,
        text: "Εξαιρετική ιταλική κουζίνα σε κομψό περιβάλλον."
      }
    ],
    tr: [
      {
        id: "christian",
        name: "Christian Cooper",
        image: "/images/reviews-man-2.jpg",
        imageAlt: "Christian Cooper",
        rating: 5,
        text: "Italiano beklentilerimi aştı! Personel inanılmaz derecede özenli ve dostaneydi."
      },
      {
        id: "emily",
        name: "Emily Hughes",
        image: "/images/young-woman.jpg",
        imageAlt: "Emily Hughes",
        rating: 5,
        text: "Gerçekten büyülü bir yemek deneyimi. İçeri girdiğimiz andan itibaren kendimizi aile gibi hissettik."
      },
      {
        id: "alexander",
        name: "Alexander Hayes",
        image: "/images/reviews-man-3.jpg",
        imageAlt: "Alexander Hayes",
        rating: 5,
        text: "Zarif bir ortamda olağanüstü İtalyan mutfağı."
      }
    ],
    ru: [
      {
        id: "christian",
        name: "Кристиан Купер",
        image: "/images/reviews-man-2.jpg",
        imageAlt: "Christian Cooper",
        rating: 5,
        text: "Italiano превзошел мои ожидания! Персонал был невероятно внимательным и дружелюбным."
      },
      {
        id: "emily",
        name: "Эмили Хьюз",
        image: "/images/young-woman.jpg",
        imageAlt: "Emily Hughes",
        rating: 5,
        text: "Поистине волшебный гастрономический опыт. С момента, как мы вошли, мы почувствовали себя как в семье."
      },
      {
        id: "alexander",
        name: "Александр Хейс",
        image: "/images/reviews-man-3.jpg",
        imageAlt: "Alexander Hayes",
        rating: 5,
        text: "Исключительная итальянская кухня в элегантной обстановке."
      }
    ]
  },
  carouselSlides: {
    en: [
      {
        id: 1,
        image: "/images/image-1.webp",
        imageAlt: "Italian dining experience",
        title: "Authentic Flavors",
        description: "Every dish tells a story of tradition and passion. From our kitchen to your table, experience the true taste of Italy."
      },
      {
        id: 2,
        image: "/images/image-2.webp",
        imageAlt: "Curated wine selection",
        title: "Wine & Dine",
        description: "Our sommeliers have selected wines that perfectly complement each course. Raise a glass to la dolce vita."
      },
      {
        id: 3,
        image: "/images/image-3.webp",
        imageAlt: "Fresh ingredients",
        title: "Seasonal Ingredients",
        description: "We source the finest seasonal produce and ingredients to bring you dishes that celebrate the best of each moment."
      },
      {
        id: 4,
        image: "/images/image-4.webp",
        imageAlt: "Elegant atmosphere",
        title: "An Unforgettable Evening",
        description: "Whether a romantic dinner or a celebration with loved ones, our restaurant sets the stage for memorable moments."
      },
      {
        id: 5,
        image: "/images/image-5.webp",
        imageAlt: "Chef's signature",
        title: "Crafted with Care",
        description: "Our chefs pour heart and soul into every plate. Discover why guests return again and again."
      }
    ],
    fa: [
      {
        id: 1,
        image: "/images/image-1.webp",
        imageAlt: "Italian dining experience",
        title: "طعم‌های اصیل",
        description: "هر غذا داستانی از سنت و اشتیاق را روایت می‌کند. از آشپزخانه ما تا میز شما، طعم واقعی ایتالیا را تجربه کنید."
      },
      {
        id: 2,
        image: "/images/image-2.webp",
        imageAlt: "Curated wine selection",
        title: "شراب و غذا",
        description: "سومیلیه‌های ما شراب‌هایی را انتخاب کرده‌اند که کاملاً با هر دوره مکمل هستند."
      },
      {
        id: 3,
        image: "/images/image-3.webp",
        imageAlt: "Fresh ingredients",
        title: "مواد فصلی",
        description: "ما بهترین محصولات و مواد فصلی را تهیه می‌کنیم."
      },
      {
        id: 4,
        image: "/images/image-4.webp",
        imageAlt: "Elegant atmosphere",
        title: "شبی فراموش‌نشدنی",
        description: "چه شام رمانتیک یا جشن با عزیزان، رستوران ما صحنه لحظات به‌یادماندنی را فراهم می‌کند."
      },
      {
        id: 5,
        image: "/images/image-5.webp",
        imageAlt: "Chef's signature",
        title: "با دقت ساخته شده",
        description: "سرآشپزهای ما قلب و روح خود را در هر بشقاب می‌ریزند."
      }
    ],
    it: [
      {
        id: 1,
        image: "/images/image-1.webp",
        imageAlt: "Italian dining experience",
        title: "Sapori Autentici",
        description: "Ogni piatto racconta una storia di tradizione e passione. Dalla nostra cucina alla vostra tavola, vivete il vero gusto dell'Italia."
      },
      {
        id: 2,
        image: "/images/image-2.webp",
        imageAlt: "Curated wine selection",
        title: "Vino e Cena",
        description: "I nostri sommelier hanno selezionato vini che completano perfettamente ogni portata. Brindiamo alla dolce vita."
      },
      {
        id: 3,
        image: "/images/image-3.webp",
        imageAlt: "Fresh ingredients",
        title: "Ingredienti di Stagione",
        description: "Selezioniamo i migliori prodotti e ingredienti di stagione per portarvi piatti che celebrano il meglio di ogni momento."
      },
      {
        id: 4,
        image: "/images/image-4.webp",
        imageAlt: "Elegant atmosphere",
        title: "Una Serata Indimenticabile",
        description: "Che si tratti di una cena romantica o di una celebrazione con i propri cari, il nostro ristorante crea momenti memorabili."
      },
      {
        id: 5,
        image: "/images/image-5.webp",
        imageAlt: "Chef's signature",
        title: "Creato con Cura",
        description: "I nostri chef mettono cuore e anima in ogni piatto. Scoprite perché gli ospiti tornano sempre."
      }
    ],
    el: [
      {
        id: 1,
        image: "/images/image-1.webp",
        imageAlt: "Italian dining experience",
        title: "Αυθεντικές Γεύσεις",
        description: "Κάθε πιάτο αφηγείται μια ιστορία παράδοσης και πάθους. Από την κουζίνα μας στο τραπέζι σας, ζήστε την αληθινή γεύση της Ιταλίας."
      },
      {
        id: 2,
        image: "/images/image-2.webp",
        imageAlt: "Curated wine selection",
        title: "Κρασί και Φαγητό",
        description: "Οι σομελιέ μας έχουν επιλέξει κρασιά που συμπληρώνουν τέλεια κάθε πιάτο. Σηκώστε ένα ποτήρι στη dolce vita."
      },
      {
        id: 3,
        image: "/images/image-3.webp",
        imageAlt: "Fresh ingredients",
        title: "Εποχιακά Υλικά",
        description: "Προμηθευόμαστε τα καλύτερα εποχιακά προϊόντα για να σας φέρουμε πιάτα που γιορτάζουν το καλύτερο κάθε στιγμής."
      },
      {
        id: 4,
        image: "/images/image-4.webp",
        imageAlt: "Elegant atmosphere",
        title: "Μια Αξέχαστη Βραδιά",
        description: "Είτε ρομαντικό δείπνο είτε γιορτή με αγαπημένους, το εστιατόριό μας δημιουργεί αξέχαστες στιγμές."
      },
      {
        id: 5,
        image: "/images/image-5.webp",
        imageAlt: "Chef's signature",
        title: "Φτιαγμένο με Φροντίδα",
        description: "Οι σεφ μας βάζουν καρδιά και ψυχή σε κάθε πιάτο. Ανακαλύψτε γιατί οι επισκέπτες επιστρέφουν ξανά και ξανά."
      }
    ],
    tr: [
      {
        id: 1,
        image: "/images/image-1.webp",
        imageAlt: "Italian dining experience",
        title: "Otantik Lezzetler",
        description: "Her yemek bir gelenek ve tutku hikayesi anlatır. Mutfağımızdan masanıza, İtalya'nın gerçek tadını deneyimleyin."
      },
      {
        id: 2,
        image: "/images/image-2.webp",
        imageAlt: "Curated wine selection",
        title: "Şarap ve Yemek",
        description: "Somelierlerimiz her yemeği mükemmel şekilde tamamlayan şaraplar seçti. La dolce vita için kadeh kaldırın."
      },
      {
        id: 3,
        image: "/images/image-3.webp",
        imageAlt: "Fresh ingredients",
        title: "Mevsimlik Malzemeler",
        description: "Her anın en iyisini kutlayan yemekler sunmak için en iyi mevsimlik ürünleri tedarik ediyoruz."
      },
      {
        id: 4,
        image: "/images/image-4.webp",
        imageAlt: "Elegant atmosphere",
        title: "Unutulmaz Bir Akşam",
        description: "Romantik bir akşam yemeği veya sevdiklerinizle bir kutlama olsun, restoranımız unutulmaz anlar yaratır."
      },
      {
        id: 5,
        image: "/images/image-5.webp",
        imageAlt: "Chef's signature",
        title: "Özenle Hazırlanmış",
        description: "Şeflerimiz her tabağa kalp ve ruh koyar. Misafirlerin neden tekrar tekrar geldiğini keşfedin."
      }
    ],
    ru: [
      {
        id: 1,
        image: "/images/image-1.webp",
        imageAlt: "Italian dining experience",
        title: "Аутентичные Вкусы",
        description: "Каждое блюдо рассказывает историю традиций и страсти. От нашей кухни до вашего стола - почувствуйте настоящий вкус Италии."
      },
      {
        id: 2,
        image: "/images/image-2.webp",
        imageAlt: "Curated wine selection",
        title: "Вино и Ужин",
        description: "Наши сомелье подобрали вина, которые идеально дополняют каждое блюдо. Поднимем бокал за la dolce vita."
      },
      {
        id: 3,
        image: "/images/image-3.webp",
        imageAlt: "Fresh ingredients",
        title: "Сезонные Ингредиенты",
        description: "Мы используем лучшие сезонные продукты, чтобы создавать блюда, которые празднуют лучшее каждого момента."
      },
      {
        id: 4,
        image: "/images/image-4.webp",
        imageAlt: "Elegant atmosphere",
        title: "Незабываемый Вечер",
        description: "Будь то романтический ужин или празднование с близкими, наш ресторан создает незабываемые моменты."
      },
      {
        id: 5,
        image: "/images/image-5.webp",
        imageAlt: "Chef's signature",
        title: "Создано с Заботой",
        description: "Наши повара вкладывают душу в каждое блюдо. Узнайте, почему гости возвращаются снова и снова."
      }
    ]
  },
  features: {
    en: [
      {
        id: 1,
        image: "/images/Bistecca.webp",
        imageAlt: "Authentic Italian cuisine",
        line1: "AUTHENTIC",
        line2: "CUISINE"
      },
      {
        id: 2,
        image: "/images/Calamari.webp",
        imageAlt: "Fresh local ingredients",
        line1: "FRESH & LOCAL",
        line2: "INGREDIENTS"
      },
      {
        id: 3,
        image: "/images/square_table.webp",
        imageAlt: "Inviting atmosphere",
        line1: "INVITING",
        line2: "ATMOSPHERE"
      },
      {
        id: 4,
        image: "/images/couple_dining-p-800.jpg",
        imageAlt: "Welcoming service",
        line1: "WELCOMING",
        line2: "SERVICE"
      }
    ],
    fa: [
      {
        id: 1,
        image: "/images/Bistecca.webp",
        imageAlt: "Authentic Italian cuisine",
        line1: "غذای",
        line2: "اصیل"
      },
      {
        id: 2,
        image: "/images/Calamari.webp",
        imageAlt: "Fresh local ingredients",
        line1: "مواد تازه",
        line2: "و محلی"
      },
      {
        id: 3,
        image: "/images/square_table.webp",
        imageAlt: "Inviting atmosphere",
        line1: "فضای",
        line2: "دلنشین"
      },
      {
        id: 4,
        image: "/images/couple_dining-p-800.jpg",
        imageAlt: "Welcoming service",
        line1: "خدمات",
        line2: "گرم"
      }
    ],
    it: [
      {
        id: 1,
        image: "/images/Bistecca.webp",
        imageAlt: "Authentic Italian cuisine",
        line1: "CUCINA",
        line2: "AUTENTICA"
      },
      {
        id: 2,
        image: "/images/Calamari.webp",
        imageAlt: "Fresh local ingredients",
        line1: "INGREDIENTI",
        line2: "FRESCHI E LOCALI"
      },
      {
        id: 3,
        image: "/images/square_table.webp",
        imageAlt: "Inviting atmosphere",
        line1: "ATMOSFERA",
        line2: "ACCOGLIENTE"
      },
      {
        id: 4,
        image: "/images/couple_dining-p-800.jpg",
        imageAlt: "Welcoming service",
        line1: "SERVIZIO",
        line2: "CALOROSO"
      }
    ],
    el: [
      {
        id: 1,
        image: "/images/Bistecca.webp",
        imageAlt: "Authentic Italian cuisine",
        line1: "ΑΥΘΕΝΤΙΚΗ",
        line2: "ΚΟΥΖΙΝΑ"
      },
      {
        id: 2,
        image: "/images/Calamari.webp",
        imageAlt: "Fresh local ingredients",
        line1: "ΦΡΕΣΚΑ ΤΟΠΙΚΑ",
        line2: "ΥΛΙΚΑ"
      },
      {
        id: 3,
        image: "/images/square_table.webp",
        imageAlt: "Inviting atmosphere",
        line1: "ΦΙΛΟΞΕΝΗ",
        line2: "ΑΤΜΟΣΦΑΙΡΑ"
      },
      {
        id: 4,
        image: "/images/couple_dining-p-800.jpg",
        imageAlt: "Welcoming service",
        line1: "ΘΕΡΜΗ",
        line2: "ΕΞΥΠΗΡΕΤΗΣΗ"
      }
    ],
    tr: [
      {
        id: 1,
        image: "/images/Bistecca.webp",
        imageAlt: "Authentic Italian cuisine",
        line1: "OTANTİK",
        line2: "MUTFAK"
      },
      {
        id: 2,
        image: "/images/Calamari.webp",
        imageAlt: "Fresh local ingredients",
        line1: "TAZE VE YEREL",
        line2: "MALZEMELER"
      },
      {
        id: 3,
        image: "/images/square_table.webp",
        imageAlt: "Inviting atmosphere",
        line1: "DAVETKAR",
        line2: "ATMOSFER"
      },
      {
        id: 4,
        image: "/images/couple_dining-p-800.jpg",
        imageAlt: "Welcoming service",
        line1: "SICAK",
        line2: "HİZMET"
      }
    ],
    ru: [
      {
        id: 1,
        image: "/images/Bistecca.webp",
        imageAlt: "Authentic Italian cuisine",
        line1: "АУТЕНТИЧНАЯ",
        line2: "КУХНЯ"
      },
      {
        id: 2,
        image: "/images/Calamari.webp",
        imageAlt: "Fresh local ingredients",
        line1: "СВЕЖИЕ МЕСТНЫЕ",
        line2: "ПРОДУКТЫ"
      },
      {
        id: 3,
        image: "/images/square_table.webp",
        imageAlt: "Inviting atmosphere",
        line1: "УЮТНАЯ",
        line2: "АТМОСФЕРА"
      },
      {
        id: 4,
        image: "/images/couple_dining-p-800.jpg",
        imageAlt: "Welcoming service",
        line1: "ТЕПЛОЕ",
        line2: "ОБСЛУЖИВАНИЕ"
      }
    ]
  },
  heroSlides: [
    { src: "/images/slide-1.webp" },
    { src: "/images/slide-2.webp" },
    { src: "/images/slide-3.webp" }
  ]
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions
export async function getWines(locale: string = 'en'): Promise<Wine[]> {
  await delay(100); // Simulate network delay
  return MOCK_DATABASE.wines[locale as keyof typeof MOCK_DATABASE.wines] || MOCK_DATABASE.wines.en;
}

export async function getReviews(locale: string = 'en'): Promise<Review[]> {
  await delay(100);
  return MOCK_DATABASE.reviews[locale as keyof typeof MOCK_DATABASE.reviews] || MOCK_DATABASE.reviews.en;
}

export async function getCarouselSlides(locale: string = 'en'): Promise<CarouselSlide[]> {
  await delay(100);
  return MOCK_DATABASE.carouselSlides[locale as keyof typeof MOCK_DATABASE.carouselSlides] || MOCK_DATABASE.carouselSlides.en;
}

export async function getFeatures(locale: string = 'en'): Promise<Feature[]> {
  await delay(100);
  return MOCK_DATABASE.features[locale as keyof typeof MOCK_DATABASE.features] || MOCK_DATABASE.features.en;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  await delay(100);
  return MOCK_DATABASE.heroSlides;
}
