#!/bin/sh

mkdir target
rm /target/*

# build wasm-faas
(cd wasm-faas; cargo build --release)
cp wasm-faas/target/debug/wasm-faas ./target

# build examples
(cd examples/hello-world-as; npm run build)
cp examples/hello-world-as/build/hello-world.wasm ./target

(cd examples/option-pricing-as; npm run build)
cp examples/option-pricing-as/build/option-pricing.wasm ./target

(cd examples/sudoku-rs; cargo build --release --target wasm32-wasi)
cp examples/sudoku-rs/target/wasm32-wasi/release/sudoku-rs.wasm ./target