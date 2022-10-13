---
'astro-m2dx': patch
---

Fixed: Tree manipulation of removing current node skips next child

Using splice to remove the current node during visit would skip the next child. Now the child array is copied before moving it.
