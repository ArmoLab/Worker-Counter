/*
 * Copyright [Now] kobe-koto
 * Under AGPL 3.0
 */

CounterSpace = CounterSpace || {};

addEventListener("fetch", event => {
    event.respondWith(CounterMain(event.request));
})


async function CounterMain (request) {
    let url = new URL(request.url);
    let NameSpace = (function (url) {
        let TempArray = url.host.split(".");
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
/*    let CountNow = await CounterSpace.get(NameSpace + "_Hits")
    !CountNow ? CountNow = 1 : CountNow++;
    CounterSpace.put(NameSpace + "_Hits", CountNow);*/


    // noinspection JSCheckFunctionSignatures
    return new Response(
        (function (){
            if (url.search === "?visitor") {
                return CounterJSON.visitor
            } else if (url.search === "?hit") {
                return CounterJSON.hit
            } else if (url.search.slice(0,5) === "?text") {
                return decodeURI(atob(
                    url.search
                        .replace(/\?text=/,"")
                        .replace(/%3D/gi,"=")
                ))
                    .replace(/@CounterByKoto_Visitors/gi, CounterJSON.visitor.toString())
                    .replace(/@CounterByKoto_Hits/gi, CounterJSON.hit.toString())
                    .replace(/@CounterByKoto_NameSpace/gi, CounterJSON.namespace)
            } else {
                UniHeader["Content-Type"] = "application/json;charset=UTF-8"
                return JSON.stringify(CounterJSON)
            }
        })()

        , { headers: UniHeader, status:200 }
    );
}

const UniHeader = {
    "Content-Type": "plain/text;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store"
};
