# Codecrad

> Coding game RTA — 好きなエディタでコードを直す、ターミナルのスピードランゲーム。

Codecrad は課題ファイルを `world/game.js` に展開し、正解との差分と進捗、経過時間を
Rust 製 TUI でリアルタイム表示します。Node.js は不要です。

## Install

Rust 1.88 以降が必要です。

```sh
cargo install --path .
```

## Play

ターミナルを 2 つ使います。

```sh
# Terminal 1: TUI を開始（省略時は fizzbuzz）
codecrad

# Terminal 2: 好きなエディタで課題を開く
$EDITOR world/game.js
```

ステージを指定することもできます。

```sh
codecrad --list
codecrad surrounds
```

編集内容が正解と一致するとタイマーが止まり、結果画面へ切り替わります。終了は `q` / `esc`、
クリア後は `enter` でも閉じられます。

## Development

```sh
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all
cargo run -- fizzbuzz
```

ステージは `src/stages/<name>/{game.js,ok.js}` に置き、`src/stage.rs` へ登録します。

## License

MIT © [anozon](https://anozon.me)
