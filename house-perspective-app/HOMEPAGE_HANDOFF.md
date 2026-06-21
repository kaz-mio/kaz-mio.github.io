# 住宅計画シミュレーター 実装引き継ぎメモ

## 目的

既存ホームページに、敷地寸法・地域条件・建坪・間取り・外構・3Dパースを確認できる住宅計画シミュレーターを実装する。

現在のツールは静的ファイルだけで動作します。バックエンドやビルド環境は不要です。

## 実装済みファイル

このフォルダをホームページ側へ配置してください。

```text
house-perspective-app/
  index.html
  styles.css
  app.js
  homepage-embed-example.html
  HOMEPAGE_HANDOFF.md
```

## 推奨実装方法

ホームページ内に iframe として埋め込むのが最も安全です。

```html
<iframe
  src="/house-perspective-app/index.html#embed"
  width="100%"
  height="860"
  loading="lazy"
  title="住宅計画シミュレーター"
  style="border:0;border-radius:14px;max-width:1440px;box-shadow:0 20px 60px rgba(34,48,42,.18);"
></iframe>
```

`#embed` を付けると公開表示モードになり、保存・JSON・埋込などの管理系ボタンが非表示になります。

## 配置例

静的サイトの場合:

```text
public/
  house-perspective-app/
    index.html
    styles.css
    app.js
```

Next.js / React 系の場合:

```text
public/house-perspective-app/index.html
public/house-perspective-app/styles.css
public/house-perspective-app/app.js
```

埋め込み:

```jsx
<iframe
  src="/house-perspective-app/index.html#embed"
  title="住宅計画シミュレーター"
  loading="lazy"
  style={{
    width: "100%",
    height: "860px",
    border: 0,
    borderRadius: 14,
    boxShadow: "0 20px 60px rgba(34,48,42,.18)"
  }}
/>
```

## 主な機能

- 敷地幅・奥行き・方位・地域条件の入力
- 北海道 / 多雪地域 / 標準地域 / 都市部に応じた推奨建坪
- 北海道向けの雪置き場、落雪余白、駐車、玄関アプローチの予測
- 土地坪、建坪、建築面積、延床面積、坪数、畳数の表示
- 部屋・家具・窓・ドア・外構の配置
- 「推奨間取りにする」ボタンによる自動レイアウト
- 2D平面図と3Dパースの自動反映
- 高精細PNG出力
- 公開表示モード

## 3Dパースについて

Canvas 2D で動く高精細な疑似3Dレンダリングです。

含まれる表現:

- 太陽光のグラデーション
- 影
- 屋根材ライン
- ガラス反射
- 車の立体表現
- 地面・雪面の素材粒度
- 外構演出

実BIMのような構造計算、法規判定、日影計算、積雪荷重計算までは含みません。ホームページ上の住宅計画・問い合わせ導線用シミュレーターとして使う想定です。

## カスタマイズ箇所

ブランド名:

```html
<h1>House Perspective Studio</h1>
```

ページ説明:

```html
<p id="projectSubtitle">実寸平面図と外構パース</p>
```

配色:

```css
:root {
  --accent: #256f68;
  --accent-strong: #164f4a;
}
```

初期敷地:

```js
land: { width: 16, depth: 12, orientation: "north", region: "hokkaido" }
```

## 注意点

- `index.html`、`styles.css`、`app.js` は同じフォルダに置いてください。
- iframe の `src` は設置先URLに合わせて変更してください。
- ホームページ側のCSPで iframe や inline style が制限されている場合は許可設定が必要です。
- スマホ対応を強めたい場合は、iframe高さを `900px` 以上にするか、ページ内で縦長表示に調整してください。

## 別チャットへ渡す依頼文

下記をそのまま別チャットへ渡してください。

```text
既存ホームページへ住宅計画シミュレーターを実装してください。

実装用ファイルは house-perspective-app フォルダにあります。
中身は index.html / styles.css / app.js / homepage-embed-example.html です。

最優先は iframe 埋め込みです。
ホームページ内の適切なセクションに以下を設置してください。

<iframe
  src="/house-perspective-app/index.html#embed"
  width="100%"
  height="860"
  loading="lazy"
  title="住宅計画シミュレーター"
  style="border:0;border-radius:14px;max-width:1440px;box-shadow:0 20px 60px rgba(34,48,42,.18);"
></iframe>

要件:
- house-perspective-app フォルダを公開ディレクトリへ配置
- #embed 付きURLで公開表示モードにする
- ページ幅に合わせてレスポンシブに表示
- ブランド名やCTA文言があればホームページ側のトーンに合わせる
- 既存サイトのデザインを壊さない
- 実装後、iframeが表示され、敷地入力、推奨建坪、平面図、3Dパースが動くことを確認

注意:
このツールはCanvasベースの住宅計画シミュレーターで、BIMの法規判定・構造計算までは含みません。
問い合わせ導線や初回プラン検討用の体験として扱ってください。
```
