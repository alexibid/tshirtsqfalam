import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <title>T'Shirts Q'Falam - Crie a sua T-shirt Personalizada com AI</title>
        
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
