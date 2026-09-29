# tshirtsqfalam

A t-shirt customiser that runs in the browser and on mobile: pick a garment and colour, flip
between front and back, and place, drag and resize designs on the shirt.

## Status

Working prototype. The AI design panel and the checkout are placeholders: generation returns a
fixed image and there is no payment flow. `components/3d` holds an unfinished Three.js scene
(React Three Fiber) that is not yet wired into the page.

## Stack

- Expo 54, React Native 0.81, Expo Router (web, iOS and Android from one codebase)
- NativeWind (Tailwind) for styling
- SVG garment mockups recoloured at runtime
- React Three Fiber and Three.js for the experimental 3D scene
- TypeScript

## Architecture

- `app` holds the routes: the customiser page and a static admin dashboard.
- `components/ui` holds the controls: navigation, garment selector, colour picker, draggable and
  resizable design layers, design panel.
- `components/3d` holds the experimental scene and t-shirt model.
- `hooks/useDesignLayers.ts` keeps the design layers state out of the components.

## Run locally

```bash
npm install
npm run web
```

## Author

Alexandre Santos — [LinkedIn](https://www.linkedin.com/in/alexandre-santos-0b480b17/)
