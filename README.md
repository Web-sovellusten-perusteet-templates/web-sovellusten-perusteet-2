# W1L2 — CSS-profiilisivu

**Kurssi:** Web-sovellusten perusteet
**Viikko:** 1, Oppitunti 2
**Aihe:** CSS-perusteet

---

## Tehtävänanto

Tyylitä edellisen oppitunnin (L1) semanttinen HTML-sivu ulkoisella CSS-tiedostolla.

Kaikki tyylisäännöt kirjoitetaan **`style.css`**-tiedostoon.
**Nolla** `style="..."`-attribuutteja HTML:ssä.

---

## Vaatimukset

### 1. Linkitys
`index.html` sisältää `<link rel="stylesheet" href="style.css">` `<head>`-elementin sisällä.

### 2. CSS custom properties
`:root`-lohkossa on vähintään **3 custom propertyä** (esim. `--color-primary`, `--font-size-base`, `--spacing-md`) ja niitä käytetään `var()`-funktiolla vähintään kahdessa paikassa.

### 3. Navigaatio vaakasuoraksi
`nav li` tai `nav ul` saa `display: inline-block` tai `display: flex` -arvon. Navigaatiolinkeillä on **hover-efekti** pseudo-luokalla `nav a:hover`.

### 4. Lomake
- `input`, `select` ja `textarea` ovat **täysleveitä** (`width: 100%`)
- `input:focus` ja `textarea:focus` -säännöissä on **näkyvä focus-outline** (älä käytä `outline: none`)

### 5. Taulukko — vuorottelevat riviväriot
`tbody tr:nth-child(even)` tai `nth-child(odd)` -valitsin asettaa taulukon riveille vuorottelevat taustavärit.

### 6. Nolla inline-tyylejä
`index.html`-tiedostossa ei ole yhtään `style="..."`-attribuuttia.

---

## Testien ajaminen paikallisesti

Testit eivät tarvitse ulkoisia kirjastoja — Node.js riittää.

```bash
node tests/test_css.js
```

---

## Arviointikriteerit

| Testi | Pisteet |
|-------|---------|
| Linkitys oikein | ✓ |
| :root + 3 custom propertyä | ✓ |
| var() käytössä | ✓ |
| nav a:hover | ✓ |
| Navigaatio vaakasuora | ✓ |
| focus-outline näkyvä | ✓ |
| :nth-child taulukossa | ✓ |
| Ei inline-tyylejä | ✓ |
| Kentät täysleveitä | ✓ |

Kaikki testit vihreinä = täydet pisteet.

---

## Hyödyllisiä linkkejä

- [MDN: CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [MDN: CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)
- [MDN: :nth-child](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child)
- [CSS-Tricks: Box model](https://css-tricks.com/the-css-box-model/)

---

## Palautus

1. Kirjoita tyylisäännöt `style.css`-tiedostoon, tee tarvittavat muutokset `index.html`-tiedostoon ja testaa paikallisesti. 
2. Kun testit paikallisesti läpi, pushaa muutokset GitHubiin ja merkitse issue valmiiksi
3. Tarkista että GitHub Actions näyttää vihreää
