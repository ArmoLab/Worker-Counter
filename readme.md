# Counter based on Cloudflare Workers & KV

## TL;DW ~~(Too Long, Don't write.)~~

1. Bind a KV space as `CounterSpace`.
2. Use it follow down below.

## How to use?

Just add these parameter

- `?type=visitor` returns total visitor count.
- `?type=hit` returns total hits count.
- `?type=text&text=...(your encoded words)...` returns a replaced text (encode your words using `btoa(encodeURI("some s*ck words"))`).

### about `?type=text&text=...`

- `@CounterByKoto_Visitors` will replace to total VISITORS count.
- `@CounterByKoto_Hits` will replace to total HITS count.
- `@CounterByKoto_NameSpace` will replace to total NAMESPACE.

a example: 
```text
https://project.example.dev/?type=text&text=JUU4JUE4JUFBJUU1JTk1JThGJUU0JUJBJUJBJUU2JTk1JUI4OiUyMEBDb3VudGVyQnlLb3RvX1Zpc2l0b3JzLCUyMCVFOCVBOCVBQSVFNSU5NSU4RiVFNiVBQyVBMSVFNiU5NSVCODolMjBAQ291bnRlckJ5S290b19IaXRzLCUyME5hbWVzcGFjZTolMjBAQ291bnRlckJ5S290b19OYW1lU3BhY2UlMEQlMEE=
```
fetch it, then you will get a response like `訪問人數: 1, 訪問次數: 3, Namespace: example.dev`
