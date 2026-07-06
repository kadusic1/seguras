REMOVE biome-ignore!

Review code from services section

Events:
paaspop
psv utakmice
libema open tenis
de amsterdamese zomer
rotterdam rave
solar
pinkpop
7th sunday
harmony of hardcore
wish outdoor
het amsterdamese winter paradijs
concert at sea

## Official Logo URLs

| Event | Logo URL | Type | Source | Better Alternative |
|-------|----------|------|--------|-------------------|
| Paaspop | https://www.paaspop.nl/assets/website/images/logo/paaspop.c140ef82.png | PNG | paaspop.nl | SVG via brandfetch.com/paaspop.nl (manual browser) |
| PSV Eindhoven | https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/psv-eindhoven/psv-eindhoven-logo-footylogos.svg | SVG | footylogos.com | Already SVG — this is better than Wikipedia version |
| Libéma Open | https://www.libema-open.nl/wp-content/themes/ricohopen/images/libemaopen-logo.png | PNG | libema-open.nl | SVG via brandfetch.com/libema-open (manual browser) |
| De Amsterdamse Zomer | https://www.deamsterdamsezomer.nl/wp-content/uploads/2025/02/logo-new.svg | SVG | deamsterdamsezomer.nl | Already good — best available |
| Rotterdam Rave | https://rotterdamrave.com/ | JPG (on site) | rotterdamrave.com | SVG via brandfetch.com/rotterdamrave (manual browser) |
| Solar Weekend | (inline SVG in page) | SVG | solarweekend.com | Inline SVG is best available — no standalone file found |
| Pinkpop | https://worldvectorlogo.com/nl/logo/pinkpop-1 | SVG | worldvectorlogo.com | Already SVG — cleaner than site version |
| 7th Sunday | https://7thsunday.nl/wp-content/uploads/sites/2/2024/05/7TH24_NEWLOGO_fff9da-.png | PNG | 7thsunday.nl | SVG via brandfetch.com/7thsunday.nl or site press page (manual browser) |
| Harmony of Hardcore | https://harmonyofhardcore.nl/wp-content/uploads/sites/4/2022/06/HOH_.png | PNG | harmonyofhardcore.nl | **Press kit with logos:** https://drive.google.com/drive/folders/0BwvFairdZYKvfmQtLV9QNG5DcHc0ZjNHRk5INVE5WFB1aTlkQml5dE1jeHhhc05nS1ZVSlk |
| WiSH Outdoor | (inline SVG in page) | SVG | wishoutdoor.com | Inline SVG is best available — no standalone file found |
| Het Amsterdamse Winterparadijs | https://www.hetamsterdamsewinterparadijs.nl/img/logo_blue.svg | SVG | hetamsterdamsewinterparadijs.nl | Already SVG — best available |
| Concert at SEA | https://www.concertatsea.nl/wp/wp-content/themes/cas-v2/images/logo-2026-.webp | WebP | concertatsea.nl | SVG via brandfetch.com/concertatsea.nl (manual browser) |

## Grayscale with CSS/Tailwind

All logos can be turned grayscale at the browser level — no preprocessing needed.

```css
/* Pure grayscale — use on white backgrounds */
.grayscale {
  filter: grayscale(1);
}

/* Warm-gray tinted — use on red/dark backgrounds (better contrast) */
.grayscale-warm {
  filter: sepia(30%) saturate(50%) grayscale(1);
}
```

Tailwind equivalents:
```html
<img src="logo.svg" class="grayscale" />       <!-- pure gray -->
<img src="logo.svg" class="grayscale sepia-[30%] saturate-[50%]" />  <!-- warm gray -->
```

The `sepia + saturate` variant prevents logos from looking faded/pale on red surfaces. No SVG rasterization loss since the browser applies the filter at render time. SVG `<image>` tags with embedded bitmaps are the only edge case (CSS filter won't affect them).

