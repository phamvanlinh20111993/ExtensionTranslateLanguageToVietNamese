
matchWord = text => {
    return text && text.length > 0
        && text.split(/\s+/) !== []
        && text.split(/\s+/).length === 1
    // && text.trim().match(/^[A-Za-z]+$/)
}

matchString = str => str && str.length > 0 && str.split(/\s+/).length > 0
    && /.*(?=.*[^\{\$%@#}]+).*/.test(str.trim())

formatText = text => text && text.length > 0 && text.split(/\s+/).join(" ").trim()

checkURL = url => {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

checkVietNameseChar = text =>
    /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/.test(text)

const ignoreTags = ["INPUT", "TEXTAREA", "BUTTON"];

const _wordType = {
    'adjective': 'adj',
    'noun': 'n',
    'verb': 'v',
    'adverb': 'adv',
    'exclamation': 'exc',
    'pronoun': 'pro',
    'indefinite article': 'art',
    'determiner': 'deter',
    'preposition': 'pre',

    'danh từ': 'n',
    'tính từ': 'adj',
    'trạng từ': 'adv',
    'mạo từ': 'art',
    'đại từ': 'pronoun',
    'động từ': 'v',
    'cảm thán': 'exc',
};

const TEXT_INFORMATION = "TEXT_INFORMATION";
const PARAGRAPH_INFORMATION = "PARAGRAPH_INFORMATION";
const MAX_TEXT = 5000;
const CHECK_LANGUAGE = "CHECK_LANGUAGE";
const TRANS_TEXT = "TRANS_TEXT";

$(document).off("cut copy paste", "**");


contentTextP = obj => `<div>
                            <div>
                                <h5 style="font-weight:bold;font-size: 16px;">${obj.highlightedText}</h5>
                            </div>
                            <div>
                                <p><span class="glyphicon glyphicon-arrow-right"></span>
                                    &nbsp;${obj.translateText}</p>
                            </div>
                        </div>`;

contentText = obj => {
    let pronound = ``,
        des = ``,
        ind,
        content,
        trans = ``;

    for (ind = 0; ind < obj.pro.length || 0; ind++) {
        if (obj.pro[ind].type != '' && obj.pro[ind].pro != '') {
            pronound += `<p style='font-size: 13px;'>
                            &nbsp;
                            <span class="glyphicon glyphicon-bullhorn" id="pro_${ind}"></span>
                            <i style="font-size:11px;"> (${obj.pro[ind].type})</i> 
                            ${obj.pro[ind].pro}
                        </p>`;
        }
    }
    let desLength = obj.des.length > 3 ? 3 : obj.des.length;
    for (ind = 0; ind < desLength; ind++) {
        des += `<p style="font-size: 15px;">&nbsp;
                    <span class="glyphicon glyphicon-chevron-right"></span>
                    ${obj.des[ind]}
                </p>`;
    }
    for (ind = 0; ind < obj.trans.length || 0; ind++) {
        if (obj.trans[ind].type != '') {
            des += `<h5 style="font-weight:bold;">
                        ${obj.trans[ind].type}
                    </h5>`;
        }
        let meanLengh = obj.trans[ind].mean.length > 3 ? 3 : obj.trans[ind].mean.length;
        for (let pos = 0; pos < meanLengh; pos++) {
            des += `<p style="font-size: 15px;">&nbsp;
                        <span class="glyphicon glyphicon-hand-right"></span>
                        ${obj.trans[ind].mean[pos]}
                    </p>`
        }
    }

    content = `<div>
                    <div>
                        <h4 style="font-weight:bold;"> 
                            ${obj.highlightedText} (${obj.typeText || 'unk'}) 
                        </h4>
                        ${pronound}
                    </div>
                         <div style="line-height: normal;">
                           ${des}
                        </div>
                </div>
                <div>
                    <div style="color:green;">
                        ${trans}
                    </div>
                </div>`;

    return content;
}

modalTrans = obj => `<div class="modal-content-trans">
                        <div class="modal-header-trans">
                            <button type="button" class="close-trans" data-dismiss="modal">&times;</button>
                            <h5 class="modal-title">Translate ${obj.title} 
                                <span style="float:right;
                                             font-size:14px !important;
                                             font-style:italic;">
                                    <a target="_blank" href="${obj.url}">google translate</a>
                                </span>
                            </h5>
                        </div>
                        <div class="modal-body-trans">
                            ${obj.contentFormat}
                        </div>
                        <div class="modal-footer-trans">
                            <span>© 2020 LinhVan - Translator Extension</span>
                        </div>
                     </div>`;


contentLoading = (e) => {
    $('body').append('<div id="loading-image-content"></div>');
    $('#loading-image-content').addClass('popup-trans');
    $('#loading-image-content').css({
        position: 'absolute',
        minWidth: '200px',
        height: '100px',
        background: 'white',
        border: '1px solid rgba(0,0,0,.2)',
        borderRadius: '6px',
        boxShadow: '0 5px 15px rgba(0,0,0,.5)',
        zIndex: 10000
    });

    let shadowDom = '<div id = "popup-modal-transl1"></div>';
    $('#loading-image-content').append(shadowDom)
    $('#loading-image-content').css({
        left: e.offsetX,
        top: e.offsetY + 10
    });

    const shadow = document.querySelector('#popup-modal-transl1').attachShadow({ mode: 'open' });
    let content = '<h1>loading text...</h1>'

    shadow.innerHTML = `${content}`;
}


showModalTrans = (e, from, contentFormat, $translatorPopupPage, highlightedText) => {
    let fromLanguage = `<b><i>${from}</i></b> to <b><i>vi</i></b>`;
    let url = `https://translate.google.com/#view=home&op=translate&sl=${from}&tl=vi&text=${encodeURI(highlightedText.toLowerCase())}`;
    let content = modalTrans({ url, title: fromLanguage, contentFormat: contentFormat.dom })

    if ($translatorPopupPage.length > 0) {
        //click inside pop up do nothing
        if (e.target.id == "translator-popup-page"
            || $(e.target).parents("#translator-popup-page").length) {
            e.stopPropagation();
            return;
        }
        $translatorPopupPage.remove();
    }

    $('body').append('<div id="translator-popup-page"></div>');
    $('#translator-popup-page').addClass('popup-trans');
    $('#translator-popup-page').css({
        position: 'absolute',
        minWidth: '200px',
        maxWidth: '400px',
        height: 'auto',
        background: 'white',
        border: '1px solid rgba(0,0,0,.2)',
        borderRadius: '6px',
        boxShadow: '0 5px 15px rgba(0,0,0,.5)',
        zIndex: 1000000000
    });

    let shadowDom = '<div id = "popup-modal-transl"> hi there </div>';
    $('#translator-popup-page').append(shadowDom)
    /**
     * screenX, screenY
     * offsetX, offsetY
     * clientX, clientY
     * pageX, pageY
     */

    let selObj = window.getSelection();
    let selRange = selObj.getRangeAt(0);
    console.log('range ', selRange, selRange.startContainer.parentNode.offsetWidth,
        selRange.startContainer.parentNode.offsetHeight)
    $('#translator-popup-page').css({
        left: e.pageX + selRange.startOffset,
        top: e.pageY + selRange.startContainer.parentNode.offsetHeight - 10
    });

    const urlCssContent = chrome.extension.getURL("css/content-script.css"),
        urlCssBoostrap = chrome.extension.getURL("dist/css/bootstrap.min.css")

    const shadow = document.querySelector('#popup-modal-transl').attachShadow({ mode: 'open' });
    const importCss = `<style>
                                @import "${urlCssContent}";
                                @import "${urlCssBoostrap}";
                            </style>`;
    shadow.innerHTML = `${importCss}${content}`;

    // click button x
    shadow.querySelector('.close-trans').addEventListener('click', function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        $('#translator-popup-page').remove();
    });

    playSound = url => {
        let setTime;
        try {
            if (setTime) {
                clearTimeout(setTime)
            } else {
                setTime = setTimeout(new Audio(url).play(), 300);
            }
        } catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }

    // click buhorn span
    let listenEvent = shadow.querySelector('#pro_0');
    if (listenEvent) {
        listenEvent.addEventListener('click', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            // do somthing there
            playSound(contentFormat.pro[0].url)
        });
    }

    // click buhorn span
    let listenEventN = shadow.querySelector('#pro_1');
    if (listenEventN) {
        listenEventN.addEventListener('click', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            // do somthing there    
            playSound(contentFormat.pro[1].url)
        });
    }
}

getDataResponse = (highlightedText, callback) => {
    if (matchWord(highlightedText)) {
        if (!checkVietNameseChar(highlightedText)) {
            chrome.runtime.sendMessage({
                signal: CHECK_LANGUAGE,
                value: highlightedText
            }, function (response) {
                if (response.error)
                    callback(null, response.error)
                /**
                * format contentText() argument
                * {
                    highlightedText,
                    typeText: 'noun',
                    des: ['hello exclamation', 'from the Oxford Advanced Learner'],
                    pro: [{ type: 'bre', pro: '/həˈləʊ/' },
                            { type: 'nAmE', pro: '/həˈləʊ/' }],
                    trans: [{ type: 'danh từ', mean: ['cân nặng', 'súc vật'] },
                            { type: 'động từ', mean: ['chiều cao', 'cái con cặc nhé', 'vãi lon con chó']}]
                *  }
                **/
                if (response.data) {
                    if (response.data.detectLanguage.signal != 'en') {
                        callback({
                            lang: response.data.detectLanguage.signal, response
                        }, null)
                    } else {
                        chrome.runtime.sendMessage({
                            signal: TEXT_INFORMATION,
                            value: highlightedText
                        }, function (res) {
                            if (res.err)
                                callback({ lang: 'ja', response }, null)

                            callback({
                                lang: response.data.detectLanguage.signal, response: res
                            }, null)
                        })
                    }
                }
            });
        }
    } else {
        if (highlightedText && highlightedText.split(/\s+/).length > MAX_TEXT ||
            checkVietNameseChar(highlightedText)) {
            callback(null, { error: `Tex too long: ${MAX_TEXT} or is vietnamese characters` })
        }
        chrome.runtime.sendMessage({
            signal: PARAGRAPH_INFORMATION,
            value: highlightedText
        }, function (response) {
            if (response.err)
                callback(null, response.err)
            callback({ type: PARAGRAPH_INFORMATION, response }, null)
        });
    }
}

checkTextImage = (imageUrl, callback) => {
    // example: https://www.geeksforgeeks.org/javascript-get-the-text-of-a-span-element/
    Tesseract.recognize(
        imageUrl,
        'eng',
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log('image url ', text);
        chrome.runtime.sendMessage({
            signal: PARAGRAPH_INFORMATION,
            value: text
        }, function (response) {
            if (response.err)
                callback(null, response.err)
            callback(response, null)
        });

    })
}


$(document).mouseup(function (e) {
    //  e.stopPropagation();
    //match text match is in input tag or textArea tag,... do nothing
    // console.log("tag", $(e.target)[0].tagName)
    if ($(e.target)[0] && ignoreTags.includes($(e.target)[0].tagName)) {
        $('#translator-popup-page').remove();
        return;
    }

    if ($('#loading-image-content') && $('#loading-image-content').length > 0) {
        $('#loading-image-content').remove();
    }

    if ($(e.target)[0] && ['IMG', 'img'].includes($(e.target)[0].tagName) &&
        checkURL($(e.target))) {
        console.log('data', $(e.target)[0].src)
        // modal loading translate image text
        contentLoading(e)
        checkTextImage($(e.target).src, (response, error) => {
            //check is translate image content
            console.log('value', $('#loading-image-content'))
            //loading content is showing
            if ($('#loading-image-content') && $('#loading-image-content').length > 0) {
                let textFromImage = text;
                let contentFormat = {};
                contentFormat.dom = contentTextP({
                    highlightedText: textFromImage,
                    translateText: response.data.text
                });
                contentFormat.sound = '';
                $('#loading-image-content').remove();
                showModalTrans(e, response.data.detectLanguage.signal,
                    contentFormat, $('#translator-popup-page'), textFromImage);
            }

        })
    }

    let highlightedText = "";
    //  console.log("tag", $(e.target))
    if (window.getSelection) {
        highlightedText = window.getSelection().toString();
    }
    else if (document.selection && document.selection.type != "Control") {
        highlightedText = document.selection.createRange().text;
    }

    console.log("text is....: ", highlightedText);
    let timeout = null;
    let $translatorPopupPage = $('#translator-popup-page');

    // hidden popup when nothing text is choosen or click outside popup
    if ($translatorPopupPage.length > 0
        && !$translatorPopupPage.is(e.target)
        && $translatorPopupPage.has(e.target).length === 0) {
        //   console.log('click outside popup')
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            //      console.log('removed')
            $translatorPopupPage.remove();
        }, 200);
    }
    //when hight text
    if (matchString(highlightedText)) {
        // set data to storage
        chrome.storage.sync.set({
            chooseText: highlightedText
        }, function () {
            console.log("Settings saved");
        });

        let contentFormat = {};
        highlightedText = formatText(highlightedText);

        getDataResponse(highlightedText, (response, error) => {
            if (response) {
                console.log(response)
                if (response.lang) {
                    if (response.lang != 'en') {
                        let obj = { highlightedText, translateText: response.response.data.text }
                        contentFormat.dom = contentTextP(obj)
                        showModalTrans(e, response.response.data.detectLanguage.signal,
                            contentFormat, $('#translator-popup-page'), highlightedText);
                    } else {
                        let contentTextArg = response.response.data;
                        let typeText = contentTextArg.typeText || '';
                        console.log('contentTextArg', contentTextArg)

                        typeText = typeText.split(",")
                        for (let i = 0; i < typeText.length; i++)
                            typeText[i] = _wordType[typeText[i].trim().toLowerCase()]

                        contentTextArg.typeText = typeText.join(', ')
                        contentTextArg.highlightedText = highlightedText;
                        contentFormat.dom = contentText(contentTextArg);
                        contentFormat.pro = contentTextArg.pro;

                        showModalTrans(e, response.lang,
                            contentFormat, $('#translator-popup-page'), highlightedText);
                    }
                    //reponse.type
                } else {
                    let obj = { highlightedText, translateText: response.response.data.text }
                    contentFormat.dom = contentTextP(obj);
                    contentFormat.sound = '';
                    showModalTrans(e, response.response.data.detectLanguage.signal,
                        contentFormat, $('#translator-popup-page'), highlightedText);
                }
            }
        })

        let browser = chrome || browser;
        browser.runtime.connect().onDisconnect.addListener(function () {
            // clean up when content script gets disconnected
            console.log("retry connectd")
        });
    }

});

$(document).keydown(function () {
    console.log("key down")
    let $translatorPopupPage = $('#translator-popup-page');
    if ($translatorPopupPage.length > 0) {
        //  $translatorPopupPage.remove();
    }
});
