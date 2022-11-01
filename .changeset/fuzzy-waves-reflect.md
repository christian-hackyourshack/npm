---
'astro-m2dx': patch
---

Fixed a Windows path conflict with Vite

Vite seems to do manual path manipulation in some places, expecting those paths to be Linux, e.g. I found this issue: https://github.com/vitejs/vite/issues/2422. That specific one does not matter to us, but I suspect more of those places.

This fix un-normalizes Windows paths to Linux paths, before feeding them to Vite.
