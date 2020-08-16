# NSW Koala Inquiry Interactive

## Data sources
- NSW Suburbs Base Map - https://data.gov.au/dataset/ds-dga-91e70237-d9d1-4719-a82f-e71b811154c6/details

- SEPP (Koala Habitat Protection) Geo Data - https://www.planningportal.nsw.gov.au/opendata/dataset/state-environmental-planning-policy-koala-habitat-protection-2019

- NSW Koala Habitat Information Base - https://datasets.seed.nsw.gov.au/dataset/koala-habitat-information-base

- NSW Koala Prioritisation Project - Areas of Regional Koala Significance (ARKS) - https://datasets.seed.nsw.gov.au/dataset/areas-of-regional-koala-significance-arks

## Running locally

```bash

# install the project dependencies
npm install

# run the build and server locally
npm start

View the site at http://localhost:3000/
```

## Previewing the production build

When building for production, an extra build step will strip out all CSS classes not used in the site. This step is not performed during the automatic rebuilds which take place during dev.

```bash

# run the production build
npm run build
npm run serve
```

## Other Scripts

```bash

# check to see latest packages
npm run update-check

# update all to latest
npm run update

# run npm audit and add risky dependencies in resolutions
npm run preinstall
```
