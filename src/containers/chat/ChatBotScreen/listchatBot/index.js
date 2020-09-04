import index from "../TestCovid";

const qs = require("./question");
const anw = require("./answers");

export function hanldQuestion(type, index) {
    let txt = "";

    switch (type) {
        case "date":

            if (index < 4) {
                // console.log("==== chat bot text ====", anw.date[0])
                txt = anw.date[0]
            } else if (index < 7) {
                txt = anw.date[1];
            } else if (index < 10) txt = anw.date[2]
            break;
        case "weather":
            if (index < 4) {
                // console.log("==== chat bot text ====", anw.date[0])
                txt = anw.weather[0]
            } else if (index < 10) {
                txt = (index >= 6 && index <= 9) ? anw.weather[2] : anw.weather[1];
            }
            break;
        case "mini":
            if (index < 3) {
                // console.log("==== chat bot text ====", anw.date[0])
                txt = anw.mini[0]
            } else if (index < 6) {
                txt = anw.mini[1];
            }
            break;
        default:
            txt = "";

    }

    return txt;
}

export function requesThemes(strQs) {
    strQs = (strQs + "").toUpperCase();
    let len = strQs.length;
    let txt = "";

    qs.date.map((item, index) => {
        item = item.toUpperCase();
        // console.log("==== chat bot text ====", item, strQs)
        if (strQs.length <= item.length) {
            // not yet check case loop mose key.
            if (item.indexOf(strQs) == 0) {
                return txt = hanldQuestion("date", index);
            }
        }
    })

    qs.weather.map((item, index) => {
        item = item.toUpperCase();
        // console.log("==== chat bot text ====", item, strQs)
        if (strQs.length <= item.length) {
            // not yet check case loop mose key.
            if (item.indexOf(strQs) == 0) {
                return txt = hanldQuestion("weather", index);
            }
        }
    })
    qs.mini.map((item, index) => {
        item = item.toUpperCase();
        // console.log("==== chat bot text ====", item, strQs)
        if (strQs.length <= item.length) {
            // not yet check case loop mose key.
            if (item.indexOf(strQs) == 0) {
                return txt = hanldQuestion("mini", index);
            }
        }
    })

    if (!txt) return txt = anw.erorr[Math.floor(Math.random() * Math.floor(6))];
    return txt;

}


export default {
    requestQuery(qs) {
        return new Promise((resolve, reject) => {

            const text = qs.length >= 3 ? requesThemes(qs) : "Bạn hãy nhập nhiều ký tự hơn. \nĐể mình có thể hỗ trợ những câu hỏi của bạn!!!.";
            console.log("==== chat bot text ====", text)

            if (text && text !== "") {
                return resolve({
                    code: 0,
                    data: {
                        text: text
                    }
                });
            } else {
                return reject();
            }
        })
    }
}