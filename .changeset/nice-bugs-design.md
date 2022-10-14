---
'astro-m2dx': patch
---

Fixed: Tree manipulation skips other children

Tree manipulation skewed indices of children, hence we now recompute the index after each child
