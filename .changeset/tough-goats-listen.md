---
'astro-m2dx': minor
'm2dx-utils': minor
'mintest-green': minor
'remark-sectionize-headings': minor
---

Removed CJS modules from build

Astro (or probably the underlying Vite) would hick-up on the CJS files in the packages and prefer them over the ESM, resulting in not being able to load Remark (which is ESM only).
