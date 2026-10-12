<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Protege Kids app
- O app migrado vive em `src/protegekids/` (App.tsx + components/ + data/) e é montado na rota `/` dentro de `<ClientOnly>`, pois usa localStorage e Leaflet (browser-only). Por isso o SSR não renderiza o app.
- `SecurityMapView` é carregado via `React.lazy` porque importa Leaflet, que quebra no SSR.
- Tiles do mapa usam OpenStreetMap padrão (CARTO passou a exigir API key).
