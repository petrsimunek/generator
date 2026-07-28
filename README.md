# Generator

Jednoduchá webová stránka pro generování náhodných řetězců v prohlížeči. Hostovatelná na [Cloudflare Pages](https://pages.cloudflare.com/).

## Co umí

Skupina **Náhodná hesla**:

- **16 znaků (komplexní)** — písmena, číslice a speciální znaky
- **32 znaků (alfanumerické)** — pouze písmena a číslice

Skupina **WireGuard**:

- **Private Key** — Curve25519, Base64 (jako `wg genkey`)
- **Public Key** — odvozený z privátního (jako `wg pubkey`); regenerace jedné poloviny obnoví celý pár
- **Preshared Key** — 32 bajtů přes `crypto.getRandomValues`, Base64 (jako `wg genpsk`)

Další skupiny a typy se přidávají jako samostatné moduly.

## Lokální spuštění

Stačí libovolný statický server (moduly ES vyžadují HTTP, ne `file://`):

```bash
python3 -m http.server 8000
```

Pak otevři http://localhost:8000.

## Nasazení na Cloudflare Pages

1. Připoj repo v Cloudflare Pages.
2. Build command nech prázdný (nebo `exit 0`).
3. Output directory: `/` (kořen projektu).

## Přidání nového generátoru

1. Vytvoř soubor v `js/generators/` exportující objekt s `id`, `title`, `description` a `generate()`.
2. Volitelně `linkedIds` + `getCached()` — regenerace aktualizuje i propojené výstupy (jako WG Private/Public).
3. Zařaď ho do skupiny v `js/generators/index.js` (nebo přidej novou skupinu).
