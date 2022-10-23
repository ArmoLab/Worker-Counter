# 由 Cloudflare Workers 及 KV 驅動的網站計數器.

您正閱讀 正體中文 版本的自述文檔. [Click here to go to English version.](https://github.com/kobe-koto/CounterWorkerKV/blob/main/readme.md)

## 部署

1. 綁定一個 KV 儲存空間, 變量名爲 `CounterSpace`.

2. 綁定一個域名, 該域名的頂級域名將被設定爲通過此域名訪問的計數器的命名空間.

   如通過 counter.example.dev 訪問的計數器的命名空間爲 example.dev.

3. 閱讀下面的使用方法

## 如何使用?

在請求 URL 中添加這些參數 (多選一).

- `?type=visitor` 返回當前訪客人數.
- `?type=hit` 返回當前點閱數.
- `?type=text&text=...(已編碼的文本)...` 返回被替換過的字符串. (請使用下列方法進行編碼 `btoa(encodeURI("將要編碼的文本"))`, 具體文本中的那些內容將會被替換, 請參閱 "關於 `?type=text&text=...`" 部分).
- `?type=MoeCounter` 返回 MoeCounter 樣式的計數 SVG 圖像, 需要額外的參數 (請參閱 "關於 `?type=MoeCounter`" 部分).

### 關於 `?type=text&text=...`

- `@CounterByKoto_Visitors` 將會被替換成當前訪客人數.
- `@CounterByKoto_Hits` 將會被替換成當前點閱數.
- `@CounterByKoto_NameSpace` 將會被替換成當前命名空間.

一個例子:
```text
https://project.example.dev/?type=text&text=JUU4JUE4JUFBJUU1JTk1JThGJUU0JUJBJUJBJUU2JTk1JUI4OiUyMEBDb3VudGVyQnlLb3RvX1Zpc2l0b3JzLCUyMCVFOCVBOCVBQSVFNSU5NSU4RiVFNiVBQyVBMSVFNiU5NSVCODolMjBAQ291bnRlckJ5S290b19IaXRzLCUyME5hbWVzcGFjZTolMjBAQ291bnRlckJ5S290b19OYW1lU3BhY2UlMEQlMEE=
```
你會得到形如 `訪問人數: 1, 訪問次數: 3, Namespace: example.dev` 的響應.

### 關於 `?type=MoeCounter`

參數(全都要!)

- `theme=...(themeID)...` 您可在 [此處](https://github.com/kobe-koto/CounterWorkerKV/tree/main/MoeCounterRes) 找到所有可用的主題

- `value=` (hit | visitor | JSON)

  **請注意: JSON value 將會傳回 當前點閱數和訪客人數的 MoeCounter 樣式的 SVG 圖像 (DataURL, base64 編碼)**

一個例子:

```text
https://project.example.dev/?type=MoeCounter&theme=rule34&value=hit
```

你會得到形如下圖的響應.

![Example MoeCounter rule34](https://github.koto.cc/kobe-koto/CounterWorkerKV/raw/main/Example/Example-MoeCounter-rule34.svg)

## 感謝您的閱讀!
