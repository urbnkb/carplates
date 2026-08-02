import type { Dzielnica } from "@/types/dzielnica";

/**
 * Kod tablicy przypisany każdej dzielnicy pochodzi z tagu `vehicle_plate_code`
 * na relacjach administracyjnych Warszawy w OpenStreetMap (potwierdzone
 * krzyżowo z niezależnymi źródłami motoryzacyjnymi — patrz README.md).
 *
 * Ciekawostki: zebrane z serwisów dzielnicowych m.st. Warszawy, polskiej
 * Wikipedii i portali historycznych, z krzyżową weryfikacją dat i liczb —
 * patrz README.md, sekcja „Źródła danych i atrybucja".
 */
export const dzielnice: Dzielnica[] = [
  {
    geoId: 1,
    nazwa: "Białołęka",
    kod: "WA",
    ciekawostki: [
      "Białołęka jest wzmiankowana jako wieś już w 1425 r., ale do Warszawy przyłączono ją dopiero w 1951 r.",
      "Z powierzchnią około 73 km² jest drugą co do wielkości dzielnicą Warszawy — większy jest tylko Wawer.",
      "Podczas trzydniowej bitwy o Warszawę ze Szwedami w 1656 r. wieś została spalona.",
    ],
    factsVerified: true,
  },
  {
    geoId: 2,
    nazwa: "Bemowo",
    kod: "WB",
    ciekawostki: [
      "Nazwa dzielnicy upamiętnia generała Józefa Bema i nawiązuje do XIX-wiecznego Fortu Bema.",
      "Przed wojną osiedle nosiło nazwę Boernerowo — od Ignacego Boernera, ministra poczt i telegrafów. Władze PRL nazwę usunęły, a w 1987 r. przywrócono ją dla starej części dzielnicy.",
      "Lotnisko Warszawa-Babice powstało po wojnie poza ówczesnymi granicami miasta, w gminie Blizne z siedzibą w Starych Babicach — stąd jego nazwa.",
    ],
    factsVerified: true,
  },
  {
    geoId: 3,
    nazwa: "Bielany",
    kod: "WD",
    ciekawostki: [
      "W 1639 r. król Władysław IV sprowadził tu kamedułów z krakowskich Bielan i ufundował im klasztor jako wotum za zwycięstwo pod Smoleńskiem.",
      "Klasztorny kościół wznoszono w latach 1669–1710 na planie wydłużonego ośmioboku; zachowały się przy nim refektarz, infirmeria, dom gościnny i 13 pustelni.",
      "Nazwa Bielany wywodzi się najpewniej od białych habitów kamedułów.",
    ],
    factsVerified: true,
  },
  {
    geoId: 4,
    nazwa: "Mokotów",
    kod: "WE",
    ciekawostki: [
      "Mokotów jest najludniejszą dzielnicą Warszawy — mieszka w nim około 12% mieszkańców stolicy, choć zajmuje niecałe 7% jej powierzchni.",
      "Jako podwarszawska wieś służył rodzinom magnackim za teren wypoczynkowy; częścią Warszawy stał się dopiero w 1916 r.",
      "Wyścigi konne przeniesiono z Pola Mokotowskiego w 1939 r. na tor na Służewcu, gdzie odbywają się do dziś.",
    ],
    factsVerified: true,
  },
  {
    geoId: 5,
    nazwa: "Praga-Południe",
    kod: "WF",
    ciekawostki: [
      "Osadnictwo na terenie dzielnicy sięga XI w. — najstarsze osady to Kamion, Grochów, Gocław i Kawęczyn.",
      "W międzywojniu Saska Kępa przekształciła się w reprezentacyjną dzielnicę willową stolicy.",
      "Budowę Stadionu Dziesięciolecia rozpoczęto w sierpniu 1954 r.; dziś w jego miejscu stoi Stadion Narodowy.",
    ],
    factsVerified: true,
  },
  {
    geoId: 6,
    nazwa: "Praga-Północ",
    kod: "WH",
    ciekawostki: [
      "Nazwa Praga pojawia się w źródłach po raz pierwszy w 1432 r., a samodzielne miasteczko włączono do Warszawy w 1791 r.",
      "W czasie II wojny światowej Praga ucierpiała nieporównanie mniej niż lewobrzeżna Warszawa, dzięki czemu zachowała przedwojenną zabudowę.",
      "Ulica Ząbkowska, jedna z najstarszych na Starej Pradze, wzięła nazwę od miejscowości Ząbki, do której prowadziła.",
    ],
    factsVerified: true,
  },
  {
    geoId: 7,
    nazwa: "Śródmieście",
    kod: "WI",
    ciekawostki: [
      "Pałac Kultury i Nauki budowano od 1 maja 1952 r. do 21 lipca 1955 r.; jego łączna powierzchnia to około 123 tys. m².",
      "Warszawskie Stare Miasto wpisano na listę światowego dziedzictwa UNESCO 2 września 1980 r. — jako przykład niemal całkowitej rekonstrukcji.",
      "Zabudowa Starego Miasta pochodzi głównie z XVII i XVIII w., a otaczające je mury obronne z XIV–XVI w.",
    ],
    factsVerified: true,
  },
  {
    geoId: 8,
    nazwa: "Targówek",
    kod: "WJ",
    ciekawostki: [
      "Grodzisko w Bródnie Starym pochodzi z IX–XI w.; wzniesiono je na wydmie otoczonej z trzech stron bagnami i obwarowano wałem drewniano-ziemnym.",
      "Gród spłonął na początku XI w. i nigdy nie został odbudowany.",
      "Nazwa Elsnerów pochodzi od folwarku Józefa Elsnera, kompozytora i nauczyciela Fryderyka Chopina.",
    ],
    factsVerified: true,
  },
  {
    geoId: 9,
    nazwa: "Ursus",
    kod: "WK",
    ciekawostki: [
      "Nazwa dzielnicy pochodzi od zakładów Ursus, założonych w 1893 r., które w 1924 r. przeniosły produkcję na grunty wsi Szamoty.",
      "W 1952 r. okoliczne wsie połączono w miasto Czechowice, a w 1954 r. przemianowano je na Ursus — od nazwy fabryki.",
      "Ursus przyłączono do Warszawy dopiero 1 sierpnia 1977 r., początkowo jako część dzielnicy Ochota.",
    ],
    factsVerified: true,
  },
  {
    geoId: 10,
    nazwa: "Ursynów",
    kod: "WN",
    ciekawostki: [
      "Nazwę nadał Julian Ursyn Niemcewicz, który w 1822 r. kupił folwark Rozkosz i przemianował go od swojego rodowego przydomka.",
      "Niemcewicz rozważał wcześniej nazwy Ameryka i Waszyngton, ale odwiedli go od nich przyjaciele.",
      "Pierwszy odcinek warszawskiego metra, otwarty 7 kwietnia 1995 r., prowadził z ursynowskich Kabat do Politechniki i liczył 11 stacji.",
    ],
    factsVerified: true,
  },
  {
    geoId: 11,
    nazwa: "Wawer",
    kod: "WT",
    ciekawostki: [
      "Wawer jest największą powierzchniowo dzielnicą Warszawy — zajmuje 79,7 km².",
      "W nocy z 26 na 27 grudnia 1939 r. Niemcy rozstrzelali tu 107 mieszkańców w odwecie za śmierć dwóch podoficerów.",
      "W 1924 r. prawa miejskie otrzymała Falenica, siedziba gminy obejmującej m.in. Anin, Międzylesie i Radość.",
    ],
    factsVerified: true,
  },
  {
    geoId: 12,
    nazwa: "Ochota",
    kod: "WU",
    ciekawostki: [
      "Nazwa dzielnicy pochodzi od karczmy Ochota, zbudowanej w 1835 r. przy Szosie Krakowskiej, u zbiegu dzisiejszych ulic Grójeckiej i Kaliskiej.",
      "Pierwsze wzmianki o tych terenach pochodzą z 1238 r.; przez wieki należały do królewskiej wsi Wielka Wola.",
      "Jako samodzielną dzielnicę Warszawy Ochotę wydzielono w 1951 r.",
    ],
    factsVerified: true,
  },
  {
    geoId: 13,
    nazwa: "Rembertów",
    kod: "WW",
    ciekawostki: [
      "W 1888 r. władze carskie wykupiły tutejsze podmokłe lasy i urządziły na nich poligon artyleryjski.",
      "Nazwa poligonu, a z czasem całej osady, pochodzi od jednego z imion generała-gubernatora Fiodora (Remberta) Berga.",
      "W 1954 r. przeniesiono tu Akademię Sztabu Generalnego, przemianowaną w 1990 r. na Akademię Obrony Narodowej.",
    ],
    factsVerified: true,
  },
  {
    geoId: 14,
    nazwa: "Wilanów",
    kod: "WW",
    ciekawostki: [
      "Pałac wzniesiono w latach 1681–1696 dla Jana III Sobieskiego i Marii Kazimiery, według projektu Augustyna Wincentego Locciego.",
      "Król kupił tę posiadłość w 1677 r.; wcześniej nosiła nazwę Milanów.",
      "W 1994 r. zespół pałacowy wraz z Morysinem uznano za pomnik historii.",
    ],
    factsVerified: true,
  },
  {
    geoId: 15,
    nazwa: "Włochy",
    kod: "WW",
    ciekawostki: [
      "Włochy przyłączono do Warszawy 5 maja 1951 r., początkowo jako osiedle dzielnicy Ochota.",
      "Ta sama decyzja powiększyła Warszawę ze 144 do 362 km² — niemal trzykrotnie.",
      "Przed II wojną światową na terenie Starych i Nowych Włoch częściowo zrealizowano założenie miasta-ogrodu.",
    ],
    factsVerified: true,
  },
  {
    geoId: 16,
    nazwa: "Wesoła",
    kod: "WX",
    ciekawostki: [
      "Wesoła jest najmłodszą dzielnicą Warszawy — przyłączono ją 27 października 2002 r., decyzją mieszkańców.",
      "Wcześniej była samodzielnym miastem; prawa miejskie otrzymała w 1968 r.",
      "Pierwsza wzmianka o Miłośnie, dzisiejszej Starej Miłosnej, pochodzi z 1416 r.",
    ],
    factsVerified: true,
  },
  {
    geoId: 17,
    nazwa: "Żoliborz",
    kod: "WX",
    ciekawostki: [
      "Nazwa pochodzi od francuskiego joli bord, czyli piękny brzeg — tak w XVIII w. określono tutejszy fragment skarpy wiślanej.",
      "W 1831 r. teren dzisiejszej dzielnicy zajęto pod budowę Cytadeli Warszawskiej, ukończonej w 1834 r.",
      "Z powierzchnią około 8,3 km² Żoliborz jest jedną z najmniejszych dzielnic Warszawy.",
    ],
    factsVerified: true,
  },
  {
    geoId: 18,
    nazwa: "Wola",
    kod: "WY",
    ciekawostki: [
      "Wielką Wolę, wieś książąt mazowieckich, wzmiankowano po raz pierwszy w 1367 r.",
      "Od 1575 r. pola Woli były stałym miejscem elekcji królów Polski — odbyło się tu 11 z 13 wolnych elekcji.",
      "W dniach 5–12 sierpnia 1944 r. niemieckie oddziały wymordowały na Woli około 40 tysięcy cywilów.",
    ],
    factsVerified: true,
  },
];
