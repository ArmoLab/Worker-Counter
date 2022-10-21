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


    let SVG = (function (){
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
            } else if (url.search.slice(0,4) === "?img") {
                UniHeader["Content-Type"] = "image/svg+xml"
                return SVG;
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

    return (!!result) ? decodeURI(result[2]).replace(/\+/gi, " ") : null;
}


/*
 * MoeCounter-like draft
 * ..but i really dont know if the Workers has file-reader API (and i dont want to test for it. LOL),
 * so these code will not appear in the production env.
 */

/*
 * x is 45x
 */

/*
const MoeCounterRaw = "https://raw.githubusercontent.com/journey-ad/Moe-counter/master/assets/theme/" + "rule34" + "/";
let reader = new FileReader();

fetch(MoeCounterRaw + 0 + ".gif")
    .then(res=>res.blob())
    .then(res=>{
        Promise.resolve()
            .then(() => FileReaderPromise(res))
            .then((DataURL) => console.log(DataURL.target.result));
    })

function FileReaderPromise (file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = resolve;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

 */