# NSLysium — Site Marketing

Site web marketing immersif pour **NSLysium**, assistant de vie intelligent combinant hardware (cône IA vocale *Aether*), application mobile (*BetaLysium*) et IA vocale.

> Slogan : **"Reach Your Elysium"**

## Stack

- **Next.js 15** (App Router, Turbopack)
- **React Three Fiber + Three.js** — cône 3D LatheGeometry animé, scroll-driven
- **GSAP + ScrollTrigger** — scroll storytelling, parallaxe, animations par section
- **Tailwind CSS v4**
- **Fraunces** (serif) + **DM Sans** (sans-serif)

## Démarrage

```bash
bun install
bun run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
├── _components/
│   ├── AetherScene.tsx    # Cône 3D R3F + animation scroll
│   ├── ScrollStory.tsx    # 5 sections scroll storytelling
│   ├── GridBackground.tsx # Grille terracotta + spotlight souris
│   ├── Header.tsx
│   └── Footer.tsx
├── abonnement/            # Page tarifs Freemium / Premium / Pro
├── produit/               # Page produit détaillée
├── contact/               # Formulaire contact
├── globals.css
└── layout.tsx
```

## Pages

| Route | Description |
|---|---|
| `/` | Landing immersive — scroll storytelling 5 sections |
| `/produit` | Présentation détaillée Aether + BetaLysium |
| `/abonnement` | Comparatif Freemium / Premium / Pro |
| `/contact` | Formulaire contact (mailto) |

## Projet

Projet étudiant — Master Win Sport School.
Équipe : Grégoire Delarue, Guéwenn Gobé, Léo Auger, Manon Godier.
