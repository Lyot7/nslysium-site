# Changelog

## [2026-04-28] Correction rendu WebGL + activation animations GSAP

**Type** : Bugfix
**Fichiers modifiés** : `next.config.ts`, `app/globals.css`, `app/_components/AetherScene.tsx`, `app/_components/ScrollStory.tsx`, `app/_components/HeroWrapper.tsx`

**Description** : Correction d'une suite de bugs liés à React StrictMode empêchant le cône 3D et les animations GSAP de s'afficher correctement.

**Problèmes rencontrés** :
1. `THREE.WebGLRenderer: Context Lost` — React StrictMode double-monte les composants en dev, ce qui appelle `forceContextLoss()` sur le canvas WebGL. Le contexte est détruit au second mount.
2. GSAP `fromTo` laissait tous les `.ss-content` à `opacity: 0` — le double-mount annule les animations ScrollTrigger avant qu'elles ne puissent compléter leur entrée.
3. `BAILOUT_TO_CLIENT_SIDE_RENDERING` dans le HTML SSR — comportement normal pour un composant `ssr: false`, pas une erreur.
4. Turbopack générait des chunks avec `..` dans le nom (ex: `0h_..y1.js`) que Next.js refusait pour raisons de sécurité (path traversal) → résolu par `trash .next && bun run build`.

**Solutions** :
- `next.config.ts` : `reactStrictMode: false` — standard pour projets Three.js + GSAP
- `globals.css` : suppression de `scroll-behavior: smooth` — conflit documenté GSAP ScrollTrigger
- `AetherScene.tsx` : suppression de `memo(() => true)` sur `AetherCanvasInner` (causait TypeError dans `useFrame`)
- `HeroWrapper.tsx` : `dynamic(() => import('./ScrollStory'), { ssr: false })` pour isoler tout le code Three.js/GSAP du SSR
- `AetherScene.tsx` : garde `mounted` state pour éviter le rendu SSR du canvas

**Résultat** : 5 sections scroll story fonctionnelles, cône 3D animé qui se déplace entre sections, animations GSAP fluides.

**Leçons apprises** : React StrictMode double-mount est incompatible avec WebGL (Three.js/R3F) et GSAP en développement. Toujours désactiver StrictMode pour les projets canvas intensifs.
