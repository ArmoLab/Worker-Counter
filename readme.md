# Counter based on Cloudflare Workers & KV

You are reading the English version readme. [點擊此處閱讀中文自述文檔.](https://github.com/kobe-koto/CounterWorkerKV/blob/main/readme.zh-Hant.md)

## TL;DW ~~(Too Long, Don't write.)~~

1. Bind a KV space as `CounterSpace`.
2. Bind a domain. the domain will became your counter name-space.
3. Use it follow down below.

## How to use?

Just add these parameters. (don't do it all in one)

- `?type=visitor` returns total visitor count.
- `?type=hit` returns total hits count.
- `?type=text&text=...(your encoded words)...` returns a replaced text (encode your words using `btoa(encodeURI("some s*ck words"))`).
- `?type=MoeCounter` returns a MoeCounter-like counter SVG, need other parameters (please read it down below :3).

### about `?type=text&text=...`

- `@CounterByKoto_Visitors` will replace to total VISITORS count.
- `@CounterByKoto_Hits` will replace to total HITS count.
- `@CounterByKoto_NameSpace` will replace to total NAMESPACE.

a example: 
```text
https://project.example.dev/?type=text&text=JUU4JUE4JUFBJUU1JTk1JThGJUU0JUJBJUJBJUU2JTk1JUI4OiUyMEBDb3VudGVyQnlLb3RvX1Zpc2l0b3JzLCUyMCVFOCVBOCVBQSVFNSU5NSU4RiVFNiVBQyVBMSVFNiU5NSVCODolMjBAQ291bnRlckJ5S290b19IaXRzLCUyME5hbWVzcGFjZTolMjBAQ291bnRlckJ5S290b19OYW1lU3BhY2UlMEQlMEE=
```
fetch it, then you will get a response like `訪問人數: 1, 訪問次數: 3, Namespace: example.dev`

### about `?type=MoeCounter`

other parameters

- `theme=...(themeID)...` you can find all the available theme in [Here](https://github.com/kobe-koto/CounterWorkerKV/tree/main/MoeCounterRes)

- `value=` (hit | visitor | JSON) 

  **Warn: JSON will return both hit and visitor count SVG (as DataURL, base64 encoded)**

a example:

```text
https://project.example.dev/?type=MoeCounter&theme=rule34&value=hit
```

will get a response like 

![Example MoeCounter rule34](https://github.koto.cc/kobe-koto/CounterWorkerKV/raw/main/Example/Example-MoeCounter-rule34.svg)

## Readme end, Thanks for your reading.
