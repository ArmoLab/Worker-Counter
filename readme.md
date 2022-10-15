# Counter based on Cloudflare Workers & KV

## TL;DW ~~(Too Long, Don't write.)~~

1. bind KV as a variable "CounterSpace".
2. use it follow down below.

## How to use?

just add these parameter

- `?visitor` returns total visitor count.
- `?hit` returns total hits count.
- `?text=...(your encoded words)...` returns a replaced text (encode your words using `btoa(encodeURI("some s*ck words"))`).

### about `?text=...(your encoded words)...`

- `@CounterByKoto_Visitors` will replace to total VISITORS count.
- `@CounterByKoto_Hits` will replace to total HITS count.
- `@CounterByKoto_NameSpace` will replace to total NAMESPACE.
