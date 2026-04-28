# État actuel du projet

**Dernière mise à jour** : 2026-04-28

## En cours
- (rien)

## Fait récemment (7 derniers jours)
- [x] Setup Next.js 14 + R3F + GSAP + Tailwind
- [x] Page 1 (/) : cône 3D floating + 5 sections scroll story
- [x] Page 2 (/produit) : scroll storytelling produit
- [x] Page 3 (/abonnement) : comparatif Freemium/Premium/Pro
- [x] Page 4 (/contact) : formulaire mailto
- [x] Header responsive + Footer
- [x] Pages légales (mentions, confidentialité, RGPD)
- [x] Correction rendu WebGL (reactStrictMode: false)
- [x] Activation animations GSAP (suppression scroll-behavior: smooth)

## À faire (prochaines priorités)
- [ ] Test responsive mobile complet
- [ ] Déploiement Vercel
- [ ] Optimisation LCP (logo header avec loading="eager")

## Bugs connus
- Warning THREE.Clock deprecated (Three.js r183+) — interne à R3F, non bloquant
- BAILOUT_TO_CLIENT_SIDE_RENDERING dans le HTML SSR — comportement NORMAL pour ssr:false

## Dette technique
- Passer à THREE.Timer quand R3F sera mis à jour
