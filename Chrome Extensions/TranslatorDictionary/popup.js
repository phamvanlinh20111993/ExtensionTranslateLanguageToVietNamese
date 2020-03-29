

const TEXT_INFORMATION = "TEXT_INFORMATION";
const PARAGRAPH_INFORMATION = "PARAGRAPH_INFORMATION";
const MAX_TEXT = 5000;
const CHECK_LANGUAGE = "CHECK_LANGUAGE";
const TRANS_TEXT = "TRANS_TEXT";

translateText = obj => {
    let content = ``
    for (data of obj.trans) {
        content += `<div><label for="email">
                            <span class="glyphicon glyphicon-tag"></span>&nbsp;
                            ${data.type}
                        </label>
                    <div class="container">`
        for (e of data.mean) {
            content += `<p><span class="glyphicon glyphicon-arrow-right"></span>
                        &nbsp;${e}</p>`
        }
        content += `</div></div>`
    }

    return `<div>${content}</div>`;
}

megaphone = totalPro => {

    let setTime;
    getAudio = (e, url) => {
        try {
            setTime && clearTimeout(setTime)
            e.target.style.color = "green"
            setTime = setTimeout(() => {
                new Audio(url).play()
                e.target.style.color = "black"
            }, 300);
        } catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }

    for (let index = 0; index < totalPro; index++) {
        if (document.getElementById(`speak-${index}`)) {
            document.getElementById(`speak-${index}`).addEventListener("click", e => {
                let url = document.getElementById(`url-${index}`).value;
                url && url.trim() != "" && getAudio(e, url)
            });
        }
    }
}

pronunciationText = obj => {
    let content = ``, index = 0, speakerNone = `<span class="glyphicon glyphicon-volume-off"
    style="cursor: pointer; font-size: 18px;top: 3px;></span>`;
    speaker = index => `<span class="glyphicon glyphicon-bullhorn" id="speak-${index}"
                              style="cursor: pointer;top: 3px;"></span>`
    for (e of obj.pro) {
        console.log(e.url)
        content += `<p style='font-size: 16px;'>
                  &nbsp;
                  ${e.url && e.url.trim() != "" ? speaker(index) : speakerNone}
                  <i style="font-size:14px;"> (${e.type})</i>
                  <input type="hidden" value = "${e.url}" id="url-${index++}">
                  ${e.pro}
                </p>`
    }
    return `<div style="">
              ${content}
            </div>`
}

descriptionText = obj => {
    let content = ``
    for (e of obj.des) {
        content += `
              <p style="font-size: 15px;">&nbsp;
                <span class="glyphicon glyphicon-share-alt"></span>
                ${e}
              </p>`;
    }
    return `<div>${content}</div>`
}

domTextTranslate = obj => {
    console.log(obj)
    if (!obj.translate) {
        return `<div style="margin-left: 5px;">
              <h4><b>${obj.content}</b> (<span style="font-size:14px;font-style:italic;">${obj.typeText}</span>)</h4>
            </div>
            <div style="padding:5px;">
              ${pronunciationText(obj)}
              ${descriptionText(obj)}
              ${translateText(obj)}
            </div>`
    } else {
        return `<div style="margin-left: 5px;">
              <h4>${obj.content}</h4>
            </div>
            <div style="padding:5px;font-size: 16px; font-style: italic;"> 
              <span class="glyphicon glyphicon-share-alt"></span>&nbsp;
              ${obj.translate}
            </div>`
    }
}

formatText = text => text && text.length > 0 && text.split(/\s+/).join(" ").trim();

getDataResponse = (highlightedText, callback) => {

    matchWord = text => {
        return text && text.trim().length > 0
            && text.split(/\s+/) !== []
            && text.split(/\s+/).length === 1
            && text.match(/\\\/\.,\"\';:>|~`<_\?!@#\$%\=+-\{\}^&*\(\)/) == null
    }

    matchString = str => str && str.trim().length > 0 && str.split(/\s+/).length > 0
        && /.*(?=.*[^\{\$%@#}]+).*/.test(str.trim())

    formatText = text => text && text.length > 0 && text.split(/\s+/).join(" ").trim()

    checkVietNameseChar = text =>
        /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/.test(text)

    if (matchWord(highlightedText)) {
        if (!checkVietNameseChar(highlightedText)) {
            chrome.runtime.sendMessage({
                signal: CHECK_LANGUAGE,
                value: highlightedText
            }, function (response) {
                if (response.error)
                    callback(null, response.error)
                if (response.data) {
                    if (response.data.detectLanguage.signal != 'en') {
                        let obj = { content: highlightedText, translate: response.data.text }
                        callback(obj, null)
                    } else {
                        chrome.runtime.sendMessage({
                            signal: TEXT_INFORMATION,
                            value: highlightedText
                        }, function (res) {
                            if (res.err)
                                callback({ content: highlightedText, translate: response.data.text }, null)
                            let contentTextArg = res.data;
                            contentTextArg.content = highlightedText;
                            callback(contentTextArg, null)

                        })
                    }
                }
            });
        }
    } else {

        if (checkVietNameseChar(highlightedText)) {
            callback(null, { error: `Tex too long: ${MAX_TEXT} or is vietnamese characters` })
            return;
        }

        chrome.runtime.sendMessage({
            signal: PARAGRAPH_INFORMATION,
            value: highlightedText
        }, function (response) {
            response.err && callback(null, response.err)
            let obj = { content: highlightedText, translate: response.data.text }
            callback(obj, null)
        });
    }
}


document.addEventListener('DOMContentLoaded', function (event) {

    let inputTyping = document.getElementById('checkValueTyping');
    let showDomContext = document.getElementById("showDomContext");
    // event 
    chrome.runtime.getBackgroundPage(function (bg) {
        chrome.storage.sync.get(['chooseText'], function (items) {
            if (items.chooseText) {
                inputTyping.value = items.chooseText;
                let highlightedText = formatText(items.chooseText);
                getDataResponse(highlightedText, (data, error) => {
                    if (data) {
                        showDomContext.innerHTML = domTextTranslate(data)
                        megaphone(data.pro && data.pro.length || 0)
                    }
                });
                chrome.storage.sync.remove(['chooseText'], function (Items) { });
            } else {
                inputTyping.value = '';
            }
        });
    });

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        console.log('active tab', tab.title)
    });

    inputTyping.addEventListener('click', function (e) {
        //auto focus input
        inputTyping.focus();
        chrome.tabs.getSelected(null, function (tab) {
            d = document;
            let highlightedText = e.target.value;
            if (highlightedText.trim() != "") {
                getDataResponse(highlightedText, (data, error) => {
                    if (data) {
                        showDomContext.innerHTML = domTextTranslate(data)
                        megaphone(data.pro && data.pro.length || 0)
                    }
                });
            }
            /* var f = d.createElement('form');
             f.action = 'https://facebook.com';
             f.method = 'post';
             var i = d.createElement('input');
             i.type = 'text';
             i.name = 'url';
             i.value = tab.url;
             f.appendChild(i);
             d.body.appendChild(f);
             f.submit(); */
        });
    }, false);

    inputTyping.addEventListener('keyup', function (e) {
        e.preventDefault();
        let x = e.which || e.keyCode;
        if (x == 13) {
            let highlightedText = e.target.value
            getDataResponse(highlightedText, (data, error) => {
                // alert(JSON.stringify(data))
                if (data) {
                    showDomContext.innerHTML = domTextTranslate(data)
                    megaphone(data.pro && data.pro.length || 0)
                }
            });
        }
    }, false);

}, false);

