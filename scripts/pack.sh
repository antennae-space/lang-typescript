#!/bin/sh
# Builds the release archives of the pack, one per architecture (the same data in each: a pack
# runs no code of its own, the IDE runs its language servers): dist/lang-typescript-linux-<arch>.tar.gz holds
# plugin.json and grammars/. The version of the tag (v1.2.3) must be the one of plugin.json.
set -eu
cd "$(dirname "$0")/.."
version=$(sed -n 's/^  "version": "\(.*\)",$/\1/p' plugin.json)
if [ -n "${TAG:-}" ] && [ "$TAG" != "v$version" ]; then
  echo "the tag $TAG is not the version $version of plugin.json" >&2
  exit 1
fi
rm -rf dist
for arch in amd64 arm64; do
  dir=dist/linux-$arch
  mkdir -p "$dir"
  cp -r plugin.json grammars "$dir/"
  tar -czf "dist/lang-typescript-linux-$arch.tar.gz" -C "$dir" .
done
ls -l dist/*.tar.gz
