/*
 * Copyright [Now] kobe-koto
 * Under AGPL 3.0
 */

CounterSpace = CounterSpace || {};

const SVGTemplate = `<image xmlns="http://www.w3.org/2000/svg" x="%imgX" y="0" width="%generalWidth" height="%generalHeight" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="%imgBase64"/>`;
const SVGHeader =
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="%SVGWidth" height="%generalHeight">`+
    `<title>Moe Count by kobe-koto</title>`+
    `<g>%SVGBody</g>`+
    `</svg>`;

addEventListener("fetch", event => {
    event.respondWith(CounterMain(event.request));
})


async function CounterMain (request) {
    let url = new URL(request.url);
    let NameSpace = (function (url) {
        let TempArray =
            url.host
                .replace(/.com./gi, ".com-")
                .replace(/.org./gi, ".org-")
                .replace(/.edu./gi, ".edu-")
                .replace(/.gov./gi, ".gov-")
                .split(".");
        return TempArray[TempArray.length-2] + "." + TempArray[TempArray.length-1];
        /*
         * only support the TOP LEVEL DOMAIN
         * like example.com, example.org is support. but a domain like example.com.cn is not supported.)
         */
    })(url)
    let CounterJSON = await (async function (headers) {
        let Hits = await CounterSpace.get(NameSpace + "_Hits")
        !Hits ? Hits = 1 : Hits++;
        CounterSpace.put(NameSpace + "_Hits", Hits);

        let Visitors = await CounterSpace.get(NameSpace + "_Visitors"),
            VisitorIP = headers.get("CF-Connecting-IP");
        !Visitors
            ? Visitors = []
            : Visitors = Visitors.split(",")
        if (VisitorIP && !Visitors.includes(VisitorIP)) {
            Visitors[Visitors.length] = VisitorIP;
        }
        CounterSpace.put(NameSpace + "_Visitors", Visitors.toString());

        let JSON = {}
        JSON.visitor = Visitors.length
        JSON.hit = Hits;
        JSON.namespace = NameSpace;
        return JSON;
    })(request.headers)

    let TextOnlySVG = (function (){
        if (GetQueryString(url, "img") || url.search.match(/(^\?img$|^\?img&)/i)) {
            let VisitorText = GetQueryString(url, "VisitorText"),
                HitText = GetQueryString(url, "HitText"),
                NamespaceText = GetQueryString(url, "NamespaceText"),

                Color = GetQueryString(url, "Color") || "000000",
                FontFamily = GetQueryString(url, "FontFamily") || "sans-serif";

            return (
                "<svg xmlns=\"http://www.w3.org/2000/svg\">" +
                  (VisitorText ? "<text x=\"0\" y=\"20\" fill=\"#@Color\" font-family=\"@FontFamily\">" +
                      VisitorText + ": " + CounterJSON.visitor +
                      "</text>" : ""
                  ) +
                  (HitText ? "<text x=\"0\" y=\"40\" fill=\"#@Color\" font-family=\"@FontFamily\">" +
                      HitText + ": " + CounterJSON.hit +
                      "</text>" : ""
                  ) +
                  (NamespaceText ? "<text x=\"0\" y=\"60\" fill=\"#@Color\" font-family=\"@FontFamily\">" +
                      NamespaceText + ": " + CounterJSON.namespace +
                      "</text>" : ""
                  ) +
                "</svg>"
            )
                .replace(/@Color/g, Color)
                .replace(/@FontFamily/g, FontFamily)
        } else {
            return null;
        }
    })()

    let MoeCounterSVG = await (async function (theme, ResponseValue){
        if (GetQueryString(url, "type") === "MoeCounter") {
            CounterJSON.hit = CounterJSON.hit.toString().padStart(8, "0").split("")
            CounterJSON.visitor = CounterJSON.visitor.toString().padStart(8, "0").split("")

            let MoeCounterRes =
                await fetch("https://github.com/kobe-koto/CounterWorkerKV/raw/main/MoeCounterRes/" + theme + ".json")
                    .then(res => res.json())
            MoeCounterRes.ArrayBase64 = MoeCounterRes.ArrayBase64 || [];
            MoeCounterRes.height = MoeCounterRes.height || 0;
            MoeCounterRes.width = MoeCounterRes.width || 0;

            let SVGPart = "";
            for (
                let time = 0;
                time < CounterJSON[ResponseValue].length;
                time++
            ) {
                SVGPart +=
                    SVGTemplate
                        .replace(/%generalWidth/g, MoeCounterRes.width)
                        .replace(/%generalHeight/g, MoeCounterRes.height)
                        .replace(/%generalHeight/g, MoeCounterRes.height)
                        .replace(/%imgX/g, (time * MoeCounterRes.width).toString())
                        .replace(/%imgBase64/g, MoeCounterRes.ArrayBase64[CounterJSON[ResponseValue]])
            }
            return SVGHeader
                .replace(/%SVGWidth/g, CounterJSON[ResponseValue].length * MoeCounterRes.width)
                .replace(/%generalHeight/g, MoeCounterRes.height)
                .replace(/%SVGBody/g, SVGPart)
        } else {
            return null;
        }
    })(GetQueryString(url, "theme"), GetQueryString(url, "value"))

    // noinspection JSCheckFunctionSignatures
    return new Response(
        (function (){
            if (GetQueryString(url, "type") === "visitor") {
                return CounterJSON.visitor
            } else if (GetQueryString(url, "type") === "hit") {
                return CounterJSON.hit
            } else if (GetQueryString(url, "type") === "text") {
                return decodeURI(atob(GetQueryString(url, "text")))
                    .replace(/@CounterByKoto_Visitors/gi, CounterJSON.visitor.toString())
                    .replace(/@CounterByKoto_Hits/gi, CounterJSON.hit.toString())
                    .replace(/@CounterByKoto_NameSpace/gi, CounterJSON.namespace)
            } else if (GetQueryString(url, "type") === "img") {
                UniHeader["Content-Type"] = "image/svg+xml"
                return TextOnlySVG;
            } else if (GetQueryString(url, "type") === "MoeCounter") {
                UniHeader["Content-Type"] = "image/svg+xml"
                return MoeCounterSVG
            } else {
                UniHeader["Content-Type"] = "application/json;charset=UTF-8"
                return JSON.stringify(CounterJSON)
            }
        })()

        , { headers: UniHeader, status:200 }
    );
}

const UniHeader = {
    "Content-Type": "text/plain;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "max-age=0, no-cache, no-store, must-revalidate"
};



function GetQueryString (url, name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let result = url.search.slice(1).match(reg);

    return result ? decodeURI(result[2]).replace(/\+/gi, " ") : null;
}
