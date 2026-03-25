export const umernostPriklady = [
  {
    id: 'soubor-9',
    title: 'Přímá úměrnost y = 60x (tabulka + graf)',
    assignment:
      'Doplň tabulku hodnot pro y = 60x pro x ∈ {2, 4, 6, 8}. Poté načrtni graf (přímka prochází počátkem).',
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
      'Načrtni graf y = 12x pro x v intervalu ⟨0; 10⟩. Vyber si vhodné body tak, aby se dobře kreslily.',
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
    title: 'Koeficient přímé úměrnosti pro y = x a úhel přímky',
    assignment:
      'Urči koeficient přímé úměrnosti k ve vztahu y = kx, pokud platí y = x (pro x > 0). Načrtni graf a určete úhel přímky s kladným směrem osy x.',
    hint:
      'Porovnej y = x s y = kx. Úhel přímky souvisí se směrnicí k.',
    steps: [
      'Porovnej tvar y = x s obecným tvarem y = kx.',
      'Z toho urči k.',
      'Načrtni graf: přímka přes (0;0) a (1;1).',
      'Směrnice k = tan(α).',
      'Vyvoď α (pro k = 1 je α = 45°).'
    ],
  },
  {
    id: 'soubor-12',
    title: 'Nepřímá úměrnost y = k/x (tabulky + graf)',
    assignment:
      `Sestav tabulku a načrtni graf nepřímé úměrnosti y = k/x pro:
(a) k = 10, x ∈ {1, 2, 2.5, 4, 5}
(b) k = 1,  x ∈ {0.2, 0.5, 1, 2, 4}`,
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
    title: 'Z grafu určete předpis (přímá / nepřímá úměrnost)',
    assignment:
      `Urči předpis přímé nebo nepřímé úměrnosti podle popisu grafu:
(a) Přímka prochází (0;0) a bodem (5;1)
(b) Přímka prochází (0;0) a bodem (9;45)
(c) Hyperbola prochází body (5;2) a (10;1)
(d) Hyperbola prochází body (3;12), (6;6), (9;4)`,
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
