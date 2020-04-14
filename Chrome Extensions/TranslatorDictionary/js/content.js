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
const GOOGLE_TRANSLATE_URL = "https://translate.google.com/";
// const VIETNAMESE_CHARACTERS = `ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯ
//                               ĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊ
//                               ỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ`;

matchWord = text => {
    return text && text.trim().length > 0 &&
        text.split(/\s+/) !== [] &&
        text.split(/\s+/).length === 1 &&
        text.match(/\\\/\.,\"\';:>|~`<_\?!@#\$%\=+-\{\}^&*\(\)/) == null
}

matchString = str => str && str.trim().length > 0 && str.split(/\s+/).length > 0 &&
    str.match(/[\{\$@&#\}`~]+/) == null
    // not html tag
    &&
    !(/<\/?[a-z][\s\S]*>/i.test(str))

formatText = text => text && text.length > 0 && text.split(/\s+/).join(" ").trim()

checkURLImage = url => url && url.match(/\.(jpeg|jpg|gif|png)$/) != null

checkVietNameseChar = text => /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/.test(text)

removeWindowSelectionText = () => window.getSelection
    // Chrome
    &&
    ((window.getSelection().empty && window.getSelection().empty())
        // Firefox
        ||
        (window.getSelection().removeAllRanges && window.getSelection().removeAllRanges())
        // IE
        ||
        (document.selection && document.selection.empty()))

$(document).off("cut copy paste", "**");

contentTextP = obj => `<div>
                            <div>
                                <h5 style="font-weight:bold;font-size: 16px;
                                           word-break: break-word;">${obj.highlightedText}</h5>
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
        trans = ``,
        speakerNone = ` <span class="glyphicon glyphicon-volume-off" 
                              style="font-size: 17px; top: 4px;"></span>`;
    speaker = ind => `<span class="glyphicon glyphicon-bullhorn" 
                            style="top: 3px;" id="pro_${ind}"></span>`

    for (ind = 0; ind < obj.pro.length || 0; ind++) {
        if (obj.pro[ind].type != '' && obj.pro[ind].pro != '') {
            let url = obj.pro[ind].url
            pronound += `<p style='font-size: 13px;'>
                            &nbsp;
                            ${url && url.trim() != "" ? speaker(ind) : speakerNone}
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
                            <span>© 2020 LinhPV - VNTranslator Extension</span>
                        </div>
                     </div>`;


contentLoading = (e, textShowUp) => {
    e.preventDefault();
    e.stopPropagation();
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
        zIndex: 10000000
    });

    let shadowDom = '<div id = "popup-modal-loading"></div>';
    $('#loading-image-content').append(shadowDom)
    $('#loading-image-content').css({
        left: e.pageX,
        top: e.pageY + 10
    });

    const urlCssFontAwesome = chrome.extension.getURL("/assets/css/font-awesome.min.css");
    const importCss = `<style>
                                @import "${urlCssFontAwesome}";
                            </style>`;
    const shadow = document.querySelector('#popup-modal-loading').attachShadow({
        mode: 'open'
    });
    let content = ` <h3>${textShowUp}</h3>
                    <i class="fa fa-spinner fa-spin" style="font-size:24px;color:red"></i>`
    shadow.innerHTML = `${importCss}${content}`;
}

getOffsetDimension = e => {
    const rect = e.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        right: rect.right + window.scrollX,
        bottom: rect.bottom + window.scrollY,
        leftViewPort: rect.left,
        topViewPort: rect.top,
        rightViewPort: rect.right,
        bottomViewPort: rect.bottom,
    };
}

preventClickInSideRange = (id, e) => {

    if ($(`#${id}`) && $(`#${id}`).length > 0) {
        //click inside popup do nothing
        if (e.target.id == id ||
            ($(e.target).parents($(`#${id}`)) && $(e.target).parents($(`#${id}`))[0].id == id)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            return true;
        }
        $(`#${id}`).remove();
    }

    return false;
}

calPositionShowPopup = e => {
    const isSelectText = window.getSelection && window.getSelection();
    // const VIEWPORT_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    // const VIEWPORT_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const VIEWPORT_HEIGHT = $(window).height();
    const VIEWPORT_WIDTH = $(window).width();
    if (isSelectText && isSelectText.rangeCount > 0) {
        let coordSelectedText = getOffsetDimension(window.getSelection().getRangeAt(0));
        /**
         * 
         * screenX, screenY
         * offsetX, offsetY
         * clientX, clientY
         * pageX, pageY
         * 
         */
        //  let selObj = window.getSelection();
        //  let selRange = selObj.getRangeAt(0);
        //  https://www.w3schools.com/jquery/html_outerheight.asp
        let widthPopup = $('#translator-popup-page').outerWidth()
        let heightPopup = $('#translator-popup-page').outerHeight()
        let positionX = coordSelectedText.left + parseInt((coordSelectedText.right - coordSelectedText.left) / 2) - parseInt(widthPopup / 2)
        let positionY = coordSelectedText.bottom + 7;
        //check left corner
        if (coordSelectedText.left < widthPopup / 2) {
            positionX = coordSelectedText.left + parseInt((coordSelectedText.right - coordSelectedText.left) / 2)
        }
        //check right corner
        if (VIEWPORT_WIDTH - coordSelectedText.right < widthPopup / 2) {
            positionX = coordSelectedText.left + parseInt((coordSelectedText.right - coordSelectedText.left) / 2) - widthPopup
        }
        //check top corner : not necessary it is default show up
        //.................

        //check bottom corner
        if (coordSelectedText.topViewPort > VIEWPORT_HEIGHT - coordSelectedText.bottomViewPort) {
            positionY = coordSelectedText.top - heightPopup - 4
        }

        $('#translator-popup-page').css({
            left: positionX,
            top: positionY
        });
    } else {
        $('#translator-popup-page').css({
            left: e.pageX,
            top: e.pageY
        });
    }
}

clickSound = () => {

    let setTime;
    playSound = url => {
        try {
            setTime && clearTimeout(setTime)
            setTime = setTimeout(new Audio(url).play(), 300);
        } catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    // click buhorn span
    for (let ind = 0; ind < 2; ind++) {
        let listenEvent = shadow.querySelector(`#pro_${ind}`);
        listenEvent && listenEvent.addEventListener('click', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            // do somthing there
            playSound(contentFormat.pro[ind].url)
        });
    }
}

showModalTrans = (e, from, contentFormat, $translatorPopupPage, highlightedText) => {
    let fromLanguage = `<b><i>${from}</i></b> to <b><i>vi</i></b>`;
    let url = `${GOOGLE_TRANSLATE_URL}#view=home&op=translate&sl=${from}&tl=vi&text=${encodeURI(highlightedText.toLowerCase())}`;
    let content = modalTrans({
        url,
        title: fromLanguage,
        contentFormat: contentFormat.dom
    })

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
        // padding: '0',
        // margin: '0',
        zIndex: 10000000
    });

    let shadowDom = '<div id="popup-modal-transl"></div>';
    $('#translator-popup-page').append(shadowDom)

    const urlCssContent = chrome.extension.getURL("/css/content-script.css");
    const urlCssBoostrap = chrome.extension.getURL("/assets/css/bootstrap.min.css");

    const shadow = document.querySelector('#popup-modal-transl').attachShadow({
        mode: 'open'
    });
    const importCss = `<style>
                                @import "${urlCssContent}";
                                @import "${urlCssBoostrap}";
                            </style>`;
    shadow.innerHTML = `${importCss}${content}`;
    //cal position to show modal
    setTimeout(() => calPositionShowPopup(e), 100)

    // click button x on corner right of modal
    shadow.querySelector('.close-trans').addEventListener('click', function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        $('#translator-popup-page').remove();
    });

    clickSound();
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
                    pro: [{ type: 'bre', pro: '/həˈləʊ/', url: '' },
                            { type: 'nAmE', pro: '/həˈləʊ/', url: '' }],
                    trans: [{ type: 'danh từ', mean: ['cân nặng', 'súc vật'] },
                            { type: 'động từ', mean: ['chiều cao', 'cái con cặc nhé', 'vãi lon con chó']}]
                *  }
                **/
                if (response.data) {
                    if (response.data.detectLanguage.signal != 'en') {
                        callback({
                            lang: response.data.detectLanguage.signal,
                            response
                        }, null)
                    } else {
                        chrome.runtime.sendMessage({
                            signal: TEXT_INFORMATION,
                            value: highlightedText
                        }, function (res) {
                            if (res.err)
                                callback({
                                    lang: 'ja',
                                    response
                                }, null)

                            callback({
                                lang: response.data.detectLanguage.signal,
                                response: res
                            }, null)
                        })
                    }
                }
            });
        }
    } else {

        if ((highlightedText && highlightedText.split(/\s+/).length > MAX_TEXT) ||
            checkVietNameseChar(highlightedText)) {
            callback(null, {
                error: `Tex too long: ${MAX_TEXT} or is vietnamese characters`
            })
            return;
        }
        chrome.runtime.sendMessage({
            signal: PARAGRAPH_INFORMATION,
            value: highlightedText
        }, function (response) {
            response.err && callback(null, response.err)
            callback({
                type: PARAGRAPH_INFORMATION,
                response
            }, null)
        });
    }
}

let checkTimeOutTranslateText;
checkTextImage = (imageUrl, callback) => {
    // example: https://www.geeksforgeeks.org/javascript-get-the-text-of-a-span-element/
    try {
        checkTimeOutTranslateText && clearTimeout(checkTimeOutTranslateText)
        checkTimeOutTranslateText = setTimeout(() => {
            Tesseract.recognize(
                imageUrl,
                'eng', {
                    logger: m => console.info(m)
                }
            ).then(({
                data: {
                    text
                }
            }) => {
                chrome.runtime.sendMessage({
                    signal: PARAGRAPH_INFORMATION,
                    value: text
                }, function (response) {
                    if (response.err)
                        callback(null, response.err)
                    response.textInImage = text
                    callback(response, null)
                });

            })
        }, 400);
    } catch (e) {
        callback(null, `Error: ${e}`);
    }
}

let timeoutShowPopUp = null;
$(document).mouseup(function (e) {

    // e.stopPropagation();
    e.preventDefault();
    if (preventClickInSideRange("translator-popup-page", e))
        return;

    //match text match is in input tag or textArea tag,... do nothing
    if ($(e.target)[0] && ignoreTags.includes($(e.target)[0].tagName)) {
        $('#translator-popup-page').remove();
        return;
    }

    $('#loading-image-content') &&
        $('#loading-image-content').length > 0 &&
        $('#loading-image-content').remove();

    let highlightedText = "";
    (window.getSelection && (highlightedText = window.getSelection().toString())) ||
    (document.selection && document.selection.type != "Control" && (
        highlightedText = document.selection.createRange().text))

    let $translatorPopupPage = $('#translator-popup-page');
    // hidden popup when nothing text is choosen or click outside popup
    if ($translatorPopupPage.length > 0 &&
        !$translatorPopupPage.is(e.target) &&
        $translatorPopupPage.has(e.target).length === 0) {
        //   console.log('click outside popup')
        timeoutShowPopUp && clearTimeout(timeoutShowPopUp);
        timeoutShowPopUp = setTimeout(() => {
            //      console.log('removed')
            $translatorPopupPage.remove();
        }, 200);
    }
    //when hight text
    console.log('text selected: ', highlightedText)
    if (matchString(highlightedText)) {
        // set data to storage
        chrome.storage.sync.set({
            chooseText: highlightedText
        }, function () {
            console.info("Settings saved");
        });

        let contentFormat = {};
        highlightedText = formatText(highlightedText);

        getDataResponse(highlightedText, (response, error) => {
            if (response) {
                if (response.lang) {
                    if (response.lang != 'en') {
                        let obj = {
                            highlightedText,
                            translateText: response.response.data.text
                        }
                        contentFormat.dom = contentTextP(obj)
                        showModalTrans(e, response.response.data.detectLanguage.signal,
                            contentFormat, $('#translator-popup-page'), highlightedText);
                    } else {
                        let contentTextArg = response.response.data;
                        let typeText = contentTextArg.typeText || '';

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
                    let obj = {
                        highlightedText,
                        translateText: response.response.data.text
                    }
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
            console.info("retry connectd")
        });
    }

});


$(document).dblclick(function (e) {
    e.preventDefault();
    e.stopPropagation()
    e.stopImmediatePropagation();

    if (preventClickInSideRange("translator-popup-page", e))
        return;

    !$(e.target)[0] && ['IMG', 'img'].includes($(e.target)[0].tagName) &&
        $('#loading-image-content') &&
        $('#loading-image-content').length > 0 &&
        $('#loading-image-content').remove();

    if ($(e.target)[0] && ['IMG', 'img'].includes($(e.target)[0].tagName) &&
        checkURLImage($(e.target)[0].src)) {
        // modal loading translate image text
        !$('#loading-image-content').length && contentLoading(e, 'Loading text ...');
        checkTextImage($(e.target)[0].src, (response, error) => {

            if (!response) {
                $('#loading-image-content').remove();
                contentLoading(e, 'Image not contains any text.')
                checkContentTimeout && clearTimeout(checkContentTimeout)
                checkContentTimeout = setTimeout(() => $('#loading-image-content').remove(), 2500)
                return;
            }

            //check is translate image content
            //loading content is showing
            if ($('#loading-image-content') && $('#loading-image-content').length > 0) {
                let textFromImage = response.textInImage;
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
        });
    }
});


$(document).keydown(function (e) {
    let $translatorPopupPage = $('#translator-popup-page');
    if ($translatorPopupPage.length > 0) {
        // $translatorPopupPage.remove();
    }
});

$(document).click((e) => {
    const isSelectText = window.getSelection && window.getSelection();
    if (isSelectText && isSelectText.rangeCount > 0) {
        let coordSelectedText = getOffsetDimension(window.getSelection().getRangeAt(0));
        let clickCoordX = e.pageX,
            clickCoordY = e.pageY;

        (coordSelectedText.bottom - coordSelectedText.top >= 7) && (coordSelectedText.right - coordSelectedText.left >= 5) && !(clickCoordX > coordSelectedText.left - 10 && clickCoordX < coordSelectedText.right + 10 &&
            clickCoordY > coordSelectedText.top - 10 && clickCoordY < coordSelectedText.bottom + 10) &&
        removeWindowSelectionText()
    }
})