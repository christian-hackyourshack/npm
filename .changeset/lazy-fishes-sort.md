---
'astro-m2dx-image': patch
---

Resorted to patched Picture component to eliminate CLS

Due to Github PR https://github.com/withastro/astro/pull/4797, the Picture component removes width and height from the embedded img. That causes massive layout shifts.

The patched component reverts that change until it is reverted in the Astro repo.
