くわばらＦＰオフィスの GitHub Pages 用サイト一式です。
この版は「Googleカレンダー予約 準備版」です。

まずはこの ZIP の中身を、そのままリポジトリ直下に上書きアップロードしてください。
必要なファイル:
- index.html
- style.css
- script.js
- hero-bg-clean.jpg
- profile-photo.jpg
- .nojekyll

今の状態でもホームページとして使えます。
予約欄は「Googleカレンダー埋め込み前」の案内表示になっています。

後から Google カレンダーの予約スケジュールを作成したら、
index.html の中の次のコメントの間を埋め込みコードに差し替えます。
- GOOGLE_CALENDAR_EMBED_START
- GOOGLE_CALENDAR_EMBED_END

初心者の方は、埋め込みコードを取得したあとにこの index.html をまた差し替えるのが簡単です。
