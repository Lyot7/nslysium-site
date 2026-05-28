# NSLysium — Design System

## Principes (non négociables)

1. **Calm Tech** — la technologie s'efface. Si une interaction génère du stress visuel, elle est mauvaise.
2. **Anti-gadget** — pas d'emoji décoratif, pas de couleur fluo, pas de micro-interaction "fun".
3. **Sanctuaire** — chaque écran doit ressembler à une pièce calme, pas à un dashboard.
4. **Souffle** — préférer toujours plus d'espace blanc / sombre que moins. Densité = échec.
5. **Premium par la discrétion** — luxe = retenue, pas ostentation.

## Palette

Khaki Beige, alignée sur l'image salon de référence (bois clair, cuir camel, lin écru). Remplace la terracotta de la v1.

```
--color-primary        #B59E7D   (khaki beige, action principale)
--color-primary-light  #C9B395   (hover, highlights hero)
--color-primary-dark   #8B7659   (pressed, ombres chaudes)
--color-ocre-brand     #F1983A   (ocre officiel logo NSLysium, conservé pour le logotype uniquement)

--color-cream          #FAF7F2   (texte clair, fond clair chaud)
--color-cream-warm     #E8DDC8   (fond chaud sur sections light)
--color-cream-dark     #D6C8AE   (variant intermédiaire)

--color-dark           #1F1A14   (fond principal, mode sombre par défaut)
--color-dark-card      #2A241D   (cartes)
--color-dark-border    #3A332C   (séparateurs)

--color-warm-gray       #7A6A58   (réservé fond clair — sur fond sombre il chute sous 4.5:1)
--color-warm-gray-light #A09484   (texte secondaire sur fond sombre, contraste AA)
--color-text-muted      #A09484   (alias body muted sur fond sombre)
```

**Règle de contraste** : sur fond sombre `#1F1A14`, ne jamais utiliser `--color-warm-gray` pour du texte body (ratio ≈3.7:1, sous WCAG AA). Utiliser `--color-warm-gray-light` (#A09484, ratio ≈5.4:1).

Couleurs cône Aether (sub-brand packaging, à utiliser uniquement sur page produit section coloris) :
Blanc Egg Shell · Orange Carrot · Noir Rich Mahogany · Bordeaux Deep · Beige Khaki (défaut) · Anthracite · Aubergine · Ivoire · Vert.

## Typographie

```
--font-display    Fraunces         (serif chaleureux, titres, accent)
--font-body       DM Sans          (sans-serif, lecture)
```

**Échelle** :
- Display XL : clamp(3rem, 7vw, 6.5rem) — hero
- Display L : clamp(2.2rem, 4vw, 4rem) — section
- Display M : clamp(1.7rem, 3vw, 2.5rem) — sous-section
- Body L : 1.05rem, line-height 1.78
- Body : 0.95rem, line-height 1.6
- Caption : 0.7rem, letter-spacing 0.22em, uppercase (tags)

**Règles** :
- Weight 300 (light) pour Fraunces sur les hero (élégance)
- Weight 400-500 pour DM Sans body
- Pas de bold sur les titres serif (sauf accentuation rare)

## Espacements

```
section-padding-y     clamp(4rem, 8vh, 8rem)
section-padding-x     clamp(1.5rem, 6vw, 5rem)
card-padding          1.5rem
gap-tight             0.5rem
gap-normal            1rem
gap-loose             2rem
```

**Règle de respiration** : entre 2 sections distinctes, minimum 8vh.

## Animations

**Easing** :
- `power3.out` pour les entrées (texte, cartes, scroll-triggered)
- `power2.inOut` pour transitions d'état
- `back.out(1.4)` pour CTAs uniquement
- `sine.inOut` pour respirations infinies (cône qui flotte, IA qui pulse)

**Durées** :
- Micro (hover) : 200ms
- Standard (entrée) : 600-700ms
- Cinematic (scroll story) : 900-1200ms

**Interdit** :
- Bounce excessif
- Effets de glitch / cyberpunk
- Confettis, particules, neon
- Animations qui distraient pendant la lecture

## Composants clés

### Boutons

```
Primary       fond #B59E7D, texte #1F1A14, rounded-full, padding 0.75rem 1.5rem
Ghost         border 1.5px #B59E7D 40%, texte cream, hover bg rgba(181,158,125,0.06)
Link          text avec underline sur hover, color #C9B395
```

Tous les boutons : transition 200ms, hover translateY(-1px). Focus visible : ring 2px #C9B395 + halo rgba(181,158,125,0.35) (cf. globals.css `:focus-visible`).

### Cards

```
default       background #2A241D, border 1px rgba(181,158,125,0.1), rounded 12px
glass         rgba(34,30,24,0.6), backdrop-blur 20px — réservé header + overlays sur image
glow          box-shadow 0 0 40px rgba(181,158,125,0.3)
```

**Règle glass** : utiliser uniquement quand le fond derrière contient une image ou un dégradé complexe (header pill sur image salon, drawer mobile, overlay sur hero). Sur fond uni `#1F1A14`, préférer la card opaque — sinon le blur devient une signature visuelle générique sans utilité.

### Tags (étiquettes section)

uppercase · letter-spacing 0.22em · font-size 10px · color #B59E7D · weight 600

## Iconographie

**Règles** :
- Pas d'emoji décoratif dans les sections marketing ou techniques
- Emoji acceptable uniquement dans contexte de démonstration de fonctionnalité utilisateur (ex: dans la simulation vocale comme représentation de catégorie utilisée par l'app)
- Préférer : SVG outline (Lucide style), monochrome, stroke 1.5px

## Logo

**Header** : `NSLysium_Logotype_Principal_1_blanc.svg`, hauteur 32px desktop / 28px mobile
**Footer** : `NSLysium_Logotype_Principal_1_blanc.svg`, hauteur 30px
**Favicon** : `NSLysium_Icon_Principal_ocre.svg`
**Loading / hero accent** : `NSLysium_L_ocre.svg`

Couleurs autorisées : ocre, blanc, beige, marron, noir, contour. Toujours selon le contraste du fond.

## Responsive

**Breakpoints** :
- Mobile : < 768px
- Tablet : 768-1024px
- Desktop : > 1024px

**Règle mobile fallback** (brief §8) : moins d'effets lourds sur mobile, parallax désactivable, animations simplifiées.

## A11y

- Contrastes WCAG AA minimum sur tous les textes
- Focus visible (ring 2px ocre) sur tous les éléments interactifs
- Aria-labels sur les boutons sans texte
- Réduction des animations si `prefers-reduced-motion`

## Anti-patterns à bannir

- Centrer tout le contenu verticalement par défaut (utiliser grilles asymétriques)
- 5+ cartes feature sur une seule ligne (réduire à 2-3 max, sinon scroll horizontal)
- Tooltips au survol sur mobile
- Modals qui prennent 100% de la hauteur sans raison
- `h-screen` sur mobile (utiliser `min-h-dvh`)
- Gradients fluo
- Texte centré sur des paragraphes longs (>40ch)
- **Gradient-on-text** (`background-clip: text` + linear-gradient) : interdit partout. Emphasis via couleur solide (#C9B395) + weight/italic.
- **Side-stripe borders** : `border-left/right` 2px+ comme accent de card ou callout. Utiliser un border complet 1px ou un fond tinté plein.
- **Hero metric template** : « gros chiffre + petit label + stat secondaire » (cliché SaaS). Le brand bannit aussi le vocabulaire « stats / performance / tracking / boost ».
- **Glassmorphism par défaut** : voir règle Cards ci-dessus.
