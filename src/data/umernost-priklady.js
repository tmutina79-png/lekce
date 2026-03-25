export const umernostPriklady = [
  {
    id: 'soubor-9',
    title: 'Přímá úměrnost y = 60x (tabulka + graf)',
    assignment:
      'Je dána přímá úměrnost y = 60x, kde x ∈ {2, 4, 6, 8}. Sestavte její tabulku a sestrojte její graf.',
    hint:
      'Nejprve dopočítej y pro každé x. Do grafu stačí zakreslit 2–3 body a spojit přímkou.',
    steps: [
      'Vypiš hodnoty x: 2, 4, 6, 8.',
      'Pro každé x spočítej y = 60 · x.',
      'Zapiš tabulku dvojic (x; y).',
      'Do soustavy souřadnic zakresli body a přímku spoj (graf je přímka přes (0;0)).',
      'Zkontroluj: když x zdvojnásobím, y se také zdvojnásobí.'
    ],
  },
  {
    id: 'soubor-10',
    title: 'Graf přímé úměrnosti y = 12x',
    assignment:
      'Nakreslete graf přímé úměrnosti y = 12x, kde proměnná x nabývá hodnot z intervalu ⟨0, 10⟩.',
    hint:
      'Zvol třeba x = 0, 1, 2, 5, 10. Přímka vždy prochází počátkem.',
    steps: [
      'Zvol několik hodnot x (např. 0, 1, 2, 5, 10).',
      'Dopočítej y = 12 · x pro zvolené hodnoty.',
      'Zakresli vypočítané body do grafu.',
      'Body spoj přímkou a popiš osu x a y.',
      'Ověř, že přímka prochází (0;0).'
    ],
  },
  {
    id: 'soubor-11',
    title: 'Koeficient přímé úměrnosti y = x (x > 0)',
    assignment:
      'Určete koeficient přímé úměrnosti y = x, kde x > 0, a sestrojte její graf v kartézské soustavě souřadnic. Jaký úhel svírá tento graf s každou z os soustavy souřadnic?',
    hint:
      'Porovnej y = x s obecným tvarem y = kx. Pro úhel platí tan(α) = k.',
    steps: [
      'Zapiš obecný tvar přímé úměrnosti: y = kx.',
      'Porovnej y = kx a y = x ⇒ k = 1.',
      'Sestroj graf: stačí dva body, např. (0;0) a (1;1), a spojit přímkou.',
      'Úhel s osou x: tan(α) = k = 1 ⇒ α = 45°.',
      'Úhel s osou y je 90° − 45° = 45°.'
    ],
  },
  {
    id: 'soubor-12',
    title: 'Nepřímá úměrnost y = k/x (tabulky + graf)',
    assignment:
      `Sestavte tabulku a sestrojte graf nepřímé úměrnosti y = k/x, je-li dán její koeficient k a množina D všech hodnot proměnné x:
a) k = 10,  D = {1; 2; 2,5; 4; 5}
b) k = 1,  D = {0,2; 0,5; 1; 2; 4}`,
    hint:
      'Počítej y = k ÷ x. U nepřímé úměrnosti je součin x · y stále stejný (= k).',
    steps: [
      'Pro (a) postupně dosaď x do y = 10/x a vypočítej y.',
      'Pro (b) postupně dosaď x do y = 1/x a vypočítej y.',
      'Do grafu zakresli vypočtené body (pro kladná x jsou v I. kvadrantu).',
      'Body spoj hladce – graf je hyperbola (nikdy neprochází osou y ani osou x).',
      'Zkontroluj: pro každou dvojici platí x · y = k.'
    ],
  },
  {
    id: 'soubor-13',
    title: 'Z grafu zapište vzorec (přímá / nepřímá úměrnost)',
    assignment: 'Přímou nebo nepřímou úměrnost z grafu zapište vzorcem:',
    images: [
      { label: 'a)', src: '/img/umernost-priklad-13-a.svg', alt: 'Graf a)' },
      { label: 'b)', src: '/img/umernost-priklad-13-b.svg', alt: 'Graf b)' },
      { label: 'c)', src: '/img/umernost-priklad-13-c.svg', alt: 'Graf c)' },
      { label: 'd)', src: '/img/umernost-priklad-13-d.svg', alt: 'Graf d)' },
    ],
    hint:
      'Přímá: y = kx, kde k = y/x. Nepřímá: y = k/x, kde k = x·y.',
    steps: [
      '(a) Spočítej k = y/x = 1/5, tedy y = (1/5)x.',
      '(b) Spočítej k = 45/9 = 5, tedy y = 5x.',
      '(c) Spočítej k = x·y = 5·2 = 10, tedy y = 10/x.',
      '(d) Spočítej k = 3·12 = 36 (ověř i další body), tedy y = 36/x.',
      'Zkontroluj dosazením bodů do výsledných vzorců.'
    ],
  },
];
