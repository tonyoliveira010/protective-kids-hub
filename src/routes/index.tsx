import { ClientOnly, createFileRoute } from "@tanstack/react-router";

import App from "@/protegekids/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Protege Kids — Guia de Cuidado" },
      {
        name: "description",
        content:
          "Guia educativo e prático para famílias sobre pequenos animais, insetos, prevenção de acidentes e primeiros socorros infantis com tranquilidade.",
      },
      { property: "og:title", content: "Protege Kids — Guia de Cuidado" },
      {
        property: "og:description",
        content:
          "Guia educativo e prático para famílias sobre pequenos animais, insetos, prevenção de acidentes e primeiros socorros infantis com tranquilidade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  // O app usa localStorage e Leaflet (browser-only): renderiza só no cliente.
  return (
    <ClientOnly fallback={null}>
      <App />
    </ClientOnly>
  );
}
