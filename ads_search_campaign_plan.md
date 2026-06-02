# KAZ & MIO 検索広告 初期テスト案

更新日: 2026-06-02

## 目的

商品レビューへ直接送るのではなく、まず「買う前タイムマシン診断」に送る。
検索した人の悩みを診断で受け止めて、結果タイプ別ページと既存ツールへ流す。

広告の主目的:

- 診断ページのクリック率を見る
- どの悩みタイプが反応しやすいかを見る
- 診断結果ページから既存ツールへ進む割合を見る

## 配信前提

- 配信面: Google 検索広告のみ
- 地域: 日本
- 最終URL: `buy_before_diagnosis_lp.html`
- 診断ページへはLP内CTAからUTMを引き継いで送る
- 商品名の強い訴求、価格訴求、割引訴求は避ける
- アフィリエイトリンク直行ではなく、診断・確認ページを受け皿にする

## 広告グループ

### 1. 玄関渋滞タイプ

最終URL:

`https://kaz-mio.github.io/buy_before_diagnosis_lp.html?utm_source=google&utm_medium=cpc&utm_campaign=buy_before_diagnosis&utm_content=stroller_entrance&utm_term={keyword}`

検索語句の狙い:

- ベビーカー 玄関 狭い
- ベビーカー 置き場所 玄関
- ベビーカー 車 トランク 入るか
- ベビーカー 買う前 サイズ

見出し案:

- ベビーカー玄関に入る？
- 買う前に置き場チェック
- 玄関渋滞タイプ診断
- 畳んだ後まで確認

説明文案:

- ベビーカーを買う前に、玄関・車・荷物の置き場で困らないか5問で確認。
- 折りたたみサイズだけでなく、帰宅後の置き場と通路幅を先に見ます。

### 2. 乗せ降ろし迷子タイプ

最終URL:

`https://kaz-mio.github.io/buy_before_diagnosis_lp.html?utm_source=google&utm_medium=cpc&utm_campaign=buy_before_diagnosis&utm_content=carseat_stress&utm_term={keyword}`

検索語句の狙い:

- チャイルドシート 乗せ降ろし 大変
- チャイルドシート 駐車場 狭い
- チャイルドシート ベルト 留めにくい
- チャイルドシート 毎日 しんどい

見出し案:

- 乗せ降ろしで詰まない？
- 毎朝の車移動を確認
- チャイルドシート診断
- ドア開口も買う前に

説明文案:

- チャイルドシート選びの前に、駐車場・ドア・ベルトの困りごとを5問で確認。
- 車種だけでなく、毎日の乗せ降ろしやすさを家族目線でチェックします。

### 3. リビング圧迫タイプ

最終URL:

`https://kaz-mio.github.io/buy_before_diagnosis_lp.html?utm_source=google&utm_medium=cpc&utm_campaign=buy_before_diagnosis&utm_content=baby_circle_room&utm_term={keyword}`

検索語句の狙い:

- ベビーサークル 部屋 狭い
- ベビーサークル 置けるか
- ベビーサークル リビング 圧迫
- ベビーサークル 通路幅

見出し案:

- ベビーサークル置ける？
- リビング圧迫を確認
- 通路幅まで買う前に
- 部屋サイズ診断へ

説明文案:

- ベビーサークルを置いたあと、大人が通れるか、家具が開くかを先に確認。
- 置けるだけでなく、暮らしにくくならないか5問でチェックします。

### 4. 在庫の雪崩タイプ

最終URL:

`https://kaz-mio.github.io/buy_before_diagnosis_lp.html?utm_source=google&utm_medium=cpc&utm_campaign=buy_before_diagnosis&utm_content=diaper_stock&utm_term={keyword}`

検索語句の狙い:

- おむつ まとめ買い 後悔
- おむつ サイズアウト 買いすぎ
- おむつ 買い置き どれくらい
- 育児 消耗品 ストック 管理

見出し案:

- おむつ買いすぎ予報
- サイズアウト前に確認
- 在庫の雪崩タイプ診断
- 買い置き量を見直す

説明文案:

- おむつや消耗品を買う前に、残り枚数・交換ペース・サイズ替えを確認。
- 安心の買い置きが収納の悩みになる前に、5問でチェックします。

### 5. 季節ずれタイプ

最終URL:

`https://kaz-mio.github.io/buy_before_diagnosis_lp.html?utm_source=google&utm_medium=cpc&utm_campaign=buy_before_diagnosis&utm_content=kids_size_season&utm_term={keyword}`

検索語句の狙い:

- 子ども服 買いすぎ
- 子ども服 サイズアウト 早い
- 子ども靴 サイズアウト 早い
- 子ども服 来年用 失敗

見出し案:

- 子ども服の先買い注意
- 季節ずれタイプ診断
- 靴サイズアウト前に
- 買う前にサイズ確認

説明文案:

- 子ども服や靴を先買いする前に、成長ペースと使う季節を5問で確認。
- 着る前に小さい、季節が合わないを減らすための買う前チェックです。

## 除外キーワード候補

- 無料
- 中古
- 公式
- クーポン
- 価格
- 最安
- 激安
- ランキング
- フリマ
- メルカリ
- 返品

## まず見る指標

- 広告グループ別クリック率
- LP表示イベント `ad_lp_view`
- LP内CTAクリックイベント `ad_lp_cta_click`
- 診断ボタン押下イベント `buy_before_diagnosis`
- 結果リンククリックイベント `buy_before_result_click`
- 結果タイプ別ページの閲覧数
- 診断から既存ツールへ進んだ数

## 初期判断メモ

クリック率が高くても、診断後にツールへ進まない広告グループは訴求が浅い可能性あり。
逆にクリック数が少なくても、診断後の回遊が強い広告グループはページを厚くする候補。
