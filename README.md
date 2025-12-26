# AMG Immobilier — Site Hugo

Magazine immobilier premium pour la région Haute-Savoie et le Pays Rochois.

## 🏔️ Aperçu

Site de contenu éditorial sur l'immobilier alpin, ciblant les acheteurs potentiels et investisseurs de la région frontalière franco-suisse.

**URL de production:** https://www.amgimmo.com

## 📁 Structure du projet

```
amgimmo-site/
├── config.toml           # Configuration Hugo
├── netlify.toml          # Configuration déploiement Netlify
├── content/              # Contenu Markdown
│   ├── immobilier/       # Articles marché immobilier
│   ├── region/           # Articles région Haute-Savoie
│   ├── conseils/         # Guides pratiques
│   ├── amenagement/      # Articles habitat & rénovation
│   ├── mentions-legales.md
│   ├── confidentialite.md
│   ├── contact.md
│   └── a-propos.md
├── data/
│   └── spin.yaml         # Configuration composants
├── themes/flavor/        # Thème personnalisé
│   ├── layouts/
│   │   ├── _default/     # Templates de base
│   │   ├── partials/     # Composants réutilisables
│   │   │   ├── headers/  # Variantes header
│   │   │   ├── heroes/   # Variantes hero
│   │   │   ├── sections/ # Sections homepage
│   │   │   ├── grids/    # Systèmes de grille
│   │   │   ├── cards/    # Styles de cartes
│   │   │   └── footers/  # Variantes footer
│   │   └── index.html    # Homepage
│   └── static/
│       ├── css/
│       │   ├── base/     # Reset, variables, utilities
│       │   └── components/
│       ├── js/
│       └── images/
└── public/               # Build généré (ignoré par Git)
```

## 🚀 Démarrage rapide

### Prérequis

- [Hugo Extended](https://gohugo.io/installation/) >= 0.139.0
- Git (optionnel, pour versionning)

### Installation locale

```bash
# Cloner ou extraire le projet
cd amgimmo-site

# Lancer le serveur de développement
hugo server -D

# Accéder à http://localhost:1313
```

### Build production

```bash
hugo --gc --minify
```

Le site est généré dans le dossier `public/`.

## 🎨 Design System

### Palette Alpine

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--color-primary` | `#1e3a5f` | Bleu glacier |
| `--color-primary-light` | `#2d5a8a` | Hover states |
| `--color-accent` | `#d97706` | Actions, CTAs |
| `--color-secondary` | `#334155` | Texte secondaire |
| `--color-background` | `#fafbfc` | Fond de page |

### Typographie

- **Titres:** Lora (serif)
- **Corps:** Merriweather Sans (sans-serif)

### Composants

Le thème utilise un système de spin modulaire :

| Type | Variante utilisée | Description |
|------|-------------------|-------------|
| Header | `header-1` | Modern transparent, glassmorphism |
| Hero | `hero-2` | Minimal typographique |
| Sections | `0, 1, 7` | Articles, Catégories, Newsletter |
| Grid | `grid-0` | 3 colonnes responsive |
| Card | `card-3` | Overlay image |
| Footer | `footer-0` | 4 colonnes |

## 📝 Gestion du contenu

### Créer un article

```markdown
---
title: "Titre de l'article"
description: "Description SEO (155 caractères max)"
date: 2025-01-15
lastmod: 2025-01-15
draft: false
categories: ["Marché"]
tags: ["prix", "investissement", "Haute-Savoie"]
image: "/images/nom-image.jpg"
---

Contenu de l'article en Markdown...
```

### Sections disponibles

- `immobilier/` — Analyses de marché, prix, tendances
- `region/` — Vie locale, communes, frontaliers
- `conseils/` — Guides achat, financement
- `amenagement/` — Rénovation, décoration

## 🌐 Déploiement Netlify

### Configuration automatique

Le fichier `netlify.toml` contient toute la configuration :

- Build command: `hugo --gc --minify`
- Publish directory: `public`
- Hugo version: 0.139.0

### Déployer

1. **Drag & Drop:** Glisser le dossier sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. **Git:** Connecter le repo GitHub/GitLab

### Variables d'environnement

| Variable | Valeur |
|----------|--------|
| `HUGO_VERSION` | `0.139.0` |
| `HUGO_ENV` | `production` |

## 🔒 Sécurité

Headers configurés dans `netlify.toml` :

- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📊 SEO

### Fonctionnalités incluses

- ✅ Meta tags optimisés
- ✅ Open Graph & Twitter Cards
- ✅ Schema.org JSON-LD (WebSite, Article)
- ✅ Sitemap XML automatique
- ✅ RSS feeds par section
- ✅ Canonical URLs
- ✅ Redirections anciennes URLs

### Performance

- Images lazy loading
- CSS/JS minifiés
- Cache agressif (1 an pour assets statiques)

## ♿ Accessibilité

- Skip link vers contenu principal
- Navigation ARIA complète
- Focus visible
- Contrastes conformes WCAG 2.1 AA

## 📄 Licence

Tous droits réservés © AMG Immobilier

---

Généré avec ❤️ par Hugo + Theme Flavor
