# The-View
家計簿アプリを自作しました。　<br >
収入、支出を月ごとに入力、削除、管理できます。

# 使用技術
- **React**: 18.3.1
- **TypeScript**: 4.9.5
- **React Router**: 6.23.1
- **Firebase**: 9.0.2
- **Chakra UI**: 2.8.2
- **Framer Motion**: 11.2.10
- **Emotion**: @emotion/react 11.11.4, @emotion/styled 11.11.5
- **Testing Libraries**: @testing-library/react 13.4.0, @testing-library/jest-dom 5.17.0, @testing-library/user-event 13.5.0
- **Babel**: @babel/core 7.24.7
- **ESLint**

詳細は package.json を参照してください。


# 機能一覧

*動画サイズの影響で表示の大きさや画質に差があります。
<br >
<br >

-ユーザ登録機能

![ユーザ登録](https://github.com/Inoue-T826/react-kakeibo-app/assets/170819367/98ba86d8-0af2-4185-8c48-538ccf2fe7fc)

自分のメールアドレスと6桁以上の任意のパスワードを用いてユーザ登録できます。
<br >
<br >
<br >
-ログイン機能

![ログイン](https://github.com/Inoue-T826/react-kakeibo-app/assets/170819367/2e161172-fc37-4fe9-9171-c51302f1aae1)

登録したユーザ情報を入力することで、ユーザごとのホーム画面に移動できます。



-データの登録、閲覧機能

![データ入力](https://github.com/Inoue-T826/react-kakeibo-app/assets/170819367/8a28ff7e-98a0-40bc-ab4a-a1a2f4aa81a3)

入力したい月に移動して＋,－を用いて収支、支出のテキスト、金額を設定し追加することができます。



-データの削除

![データ削除](https://github.com/Inoue-T826/react-kakeibo-app/assets/170819367/0174e1b4-ed18-4776-beac-7fce0343c5aa)

×ボタンを押し、確認に許可をすることで、当該データを削除することができます。



-他ユーザのページ閲覧

![閲覧](https://github.com/Inoue-T826/react-kakeibo-app/assets/170819367/eee3761e-4644-4864-996a-eede5785b803)

ページ下の入力フォームに他ユーザのメールアドレスを入力すると、元々選択していた月のユーザの情報を閲覧することができます。
ただし、他ユーザのページにデータを追加したり、削除したりすることはできません。
