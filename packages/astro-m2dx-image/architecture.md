# @astrojs/image

## Goals

- Generate the best possible responsive images from the input provided
- Derive missing input from provided input wherever possible; do not apply ~magic~
- Only if no image could be generated otherwise, apply some fallback and give a verbose warning
- In case of errors, create results that do not break page generation and give a verbose error message
- All messages should allow to locate the source of the problem
- Document the behavior, so that it is easy to understand

## Required Enhancements

@astrojs/image does already do a very good job in providing the best possible responsive images...  
...if the user provides all information.

With the current status of @astrojs/image, it is fairly straightforward to implement the above goals by implementing the following:

- Treat `src` string values as local source, if it exists
- TBD: treat remote sources as local ones by downloading the source during page generation (make this configurable)
- Derive missing input parameters from intrinsic values

## Further Improvements

- Improve the typing, publish all API types
- Allow pass-through parameters for image loaders
- Make fallback values configurable
- Handle SVG images
