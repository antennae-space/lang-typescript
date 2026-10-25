# JavaScript and TypeScript for Web IDE

The JavaScript and TypeScript language pack of [Web IDE](https://github.com/antennae-space/web-ide): the highlighting of both, typescript-language-server (diagnostics, completion, navigation, rename, formatting, the structure of a file) and the test pattern `{name}.spec.ts` (`.tsx`, `.js`, `.jsx`). An official plugin: the IDE installs it by default.

## What it needs

- **typescript-language-server** and **typescript** 5 or 6 (`npm install -g typescript-language-server typescript@5`; TypeScript 7, the native one, has no `tsserver` yet), on your PATH. A project's own `typescript` (its `node_modules`) wins.
- The IDE runs it **confined**: it reads your project (not write), the node on your PATH (`NODE`) and your global `node_modules` (`NODE_MODULES`: the server and its `typescript`), keeps its caches in its own folder, and has no network.
- JavaScript and TypeScript are two languages of the pack: in a project with both, a server runs for each.
- On a project over SSH, the server runs on its host, as you installed it there.

## Permissions

| | |
|---|---|
| `program:typescript-language-server` | run the server, confined |
| `path:NODE` | read the node that runs it |
| `path:NODE_MODULES` | read the global `node_modules`: the server and `typescript` |

## Develop

A pack is data: `plugin.json` (checked by `node scripts/check.mjs` against the [plugin SDK](https://github.com/antennae-space/plugin-sdk)'s schema) and `grammars/*.json` (grammars of the IDE's editor). `./scripts/pack.sh` builds the archives; a tag `v*` publishes a release.

## License

MIT.
