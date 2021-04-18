import {
    GOOGLE_TRANSLATE_URL,
    FOOTER_NAME,
    getOffsetDimension,
    WORDTYPELIST
} from '../Helpers.js';

import {
    AbstractBuildContentUI
} from "../AbstractBuildContentUI.js";

class BuildContentUI extends AbstractBuildContentUI {

    #speakerNone

    constructor() {
        super();
        this.#speakerNone = ` <span class="glyphicon glyphicon-volume-off" 
        style="font-size: 17px; top: 4px;"></span>`;
    }

    #calPositionShowPopup = e => {
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

    #modalTrans = obj => `<div class="modal-content-trans">
                            <div class="modal-header-trans">
                                <button type="button" class="close-trans" data-dismiss="modal">&times;</button>
                                <h5 class="modal-title">Translate ${obj.title} 
                                    <span style="float:right;
                                                font-size:14px !important;
                                                font-style:italic;">
                                        <a target="_blank" href="${obj.url}"
                                        data-toggle="tooltip" title="click go to translate">google translate</a>
                                    </span>
                                </h5>
                            </div>
                            <div class="modal-body-trans">
                                ${obj.contentFormat}
                            </div>
                            <div class="modal-footer-trans">
                                <span>${FOOTER_NAME}</span>
                            </div>
                        </div>`;

    #contentTextP = obj => `<div>
                                <div>
                                    <h5 style="font-weight:bold;font-size: 16px;
                                            word-break: break-word;">
                                        ${obj.highlightedText}
                                    </h5>
                                </div>
                                <div>
                                    <p><span class="glyphicon glyphicon-arrow-right"></span>
                                        &nbsp;${obj.translateText}</p>
                                </div>
                            </div>`;

    #contentText = obj => {
        let pronound = ``,
            des = ``,
            ind,
            content,
            trans = ``,
            relatedWords = obj.relateWords && obj.relateWords.length > 0 ? `related: ` : ``;

        for (ind = 0; ind < obj.pro.length || 0; ind++) {
            if (obj.pro[ind].type != '' && obj.pro[ind].pro != '') {
                let url = obj.pro[ind].url
                pronound += `<p style="font-size: 13px;">
                            &nbsp;
                            ${url && url.trim() != "" ? this.#speaker(ind) : this.#speakerNone}
                            <i style="font-size:11px;"> (${obj.pro[ind].type})</i> 
                            ${obj.pro[ind].pro}
                        </p>`;
            }
        }

        if (relatedWords.length > 0) {
            //href="${obj.relateWords[pos][1]}" 
            for (let pos = 0; pos < obj.relateWords.length; pos++) {
                relatedWords += `<a class="referenceUrl" target="_blank" id="relate_${pos}" 
                    data-toggle="tooltip"  title="click more information" style="color: blue;">
                    ${obj.relateWords[pos][0].trim()}(${WORDTYPELIST[obj.relateWords[pos][2].trim().toLowerCase()]})
                </a>,`
            }
            relatedWords = relatedWords.substring(0, relatedWords.length - 1)
        }

        //format define description
        const desLength = obj.des.length > 3 ? 3 : obj.des.length;
        for (ind = 0; ind < desLength; ind++) {
            des += `<p style="font-size: 15px;">&nbsp;
                        <span class="glyphicon glyphicon-chevron-right"></span>
                        ${obj.des[ind]}
                    </p>`;
        }

        //format translate
        for (ind = 0; ind < obj.trans.length || 0; ind++) {
            if (obj.trans[ind].type != '') {
                trans += `<h5 style="font-weight:bold;">
                           <a class="referenceUrl" href="${obj.transReferenceLink || obj.url}" target="_blank"
                              data-toggle="tooltip" title="click more information">
                               ${obj.trans[ind].type}
                           </a>
                       </h5>`;
            }
            const meanLengh = obj.trans[ind].mean.length > 3 ? 3 : obj.trans[ind].mean.length;
            for (let pos = 0; pos < meanLengh; pos++) {
                trans += `<p style="font-size:15px;">
                            &nbsp;<span class="glyphicon glyphicon-hand-right"></span>
                            ${obj.trans[ind].mean[pos]}
                        </p>`
            }
        }

        return `<div id="definition_word">
                    <div>
                        <h4 style="font-weight:bold;"> 
                            <a class="referenceUrl" href="${obj.referenceLink || obj.url}" target="_blank"
                                data-toggle="tooltip" title="click more information">
                                 ${obj.highlightedText} (${obj.typeText || 'unk'})
                            </a>
                        </h4>
                        ${pronound}
                    </div>
                    <div style="line-height:normal;">
                        ${des}
                    </div>
                </div>

                <div id="translate_word">
                    <div style="line-height:normal;">
                        ${trans}
                    </div>
                </div>

                <div>
                    <div style="color:black !important;" id="relate_word">
                        ${relatedWords}
                    </div>
                </div>`;
    }

    contentLoading = (e, textShowUp) => {
        e.preventDefault();
        e.stopPropagation();
        $('body').append('<div id="loading-image-content"></div>');
        $('#loading-image-content').addClass('popup-trans');
        $('#loading-image-content').css({
            position: 'absolute',
            minWidth: '180px',
            height: '100px',
            background: 'white',
            border: '1px solid rgba(0,0,0,.2)',
            borderRadius: '6px',
            boxShadow: '0 5px 15px rgba(0,0,0,.5)',
            zIndex: 10000000
        });

        const shadowDOM = '<div id = "popup-modal-loading"></div>';
        $('#loading-image-content').append(shadowDOM)
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
        const content = `<div style="width: 100%;
                                     padding-right: 15px;
                                     padding-left: 15px;
                                     margin-right: auto;
                                     margin-left: auto;"> 
                           <h3>${textShowUp}</h3>
                          <i class="fa fa-spinner fa-spin" style="font-size:40px;color:blue;"></i>
                        </div>`
        shadow.innerHTML = `${importCss}${content}`;
    }

    // overrided method
    showContentUI = (obj) => {

        const e = obj.e,
            from = obj.from,
            contentFormat = obj.contentFormat,
            highlightedText = obj.highlightedText;

        //fix target type language showing
        const targetType = 'vi';

        const fromLanguage = `<b><i>${from.toUpperCase()}</i></b> to <b><i>${targetType.toUpperCase()}</i></b>`;
        const url = `${GOOGLE_TRANSLATE_URL}#view=home&op=translate&sl=${from}&tl=vi&text=${encodeURI(highlightedText.toLowerCase())}`;
        const content = this.#modalTrans({
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

        const shadowDOM = '<div id="popup-modal-transl"></div>';
        $('#translator-popup-page').append(shadowDOM)

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
        setTimeout(() => this.#calPositionShowPopup(e), 120)

        // click button x on corner right of modal
        shadow.querySelector('.close-trans').addEventListener('click', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            $('#translator-popup-page').remove();
        });

        this.#takeSoundEvent([contentFormat], 0, 1)
    }

    showContentUITranslateWord(e, highlightedText, response) {
        const contentTextArg = response;
        const contentFormat = {};
        let typeText = contentTextArg.typeText || '';

        typeText = typeText.split(",")
        for (let i = 0; i < typeText.length; i++) {
            typeText[i] = WORDTYPELIST[typeText[i].trim().toLowerCase()]
        }

        contentTextArg.typeText = typeText.join(', ')
        contentTextArg.highlightedText = highlightedText;
        contentFormat.dom = this.#contentText(contentTextArg);
        contentFormat.pro = contentTextArg.pro;
        contentFormat.relateWords = contentTextArg.relateWords;

        this.showContentUI({
            e,
            from: response.lang,
            contentFormat,
            highlightedText
        });
    }

    showContentUITranslateString(e, highlightedText, response) {
        const contentFormat = {};
        const obj = {
            highlightedText,
            translateText: response.translateText
        }
        contentFormat.dom = this.#contentTextP(obj)
        this.showContentUI({
            e,
            from: response.lang,
            contentFormat,
            highlightedText
        });
    }

    showContentUITranslateImage(e, highlightedText, response) {
        const contentFormat = {};
        contentFormat.dom = this.#contentTextP({
            highlightedText,
            translateText: response.data.text
        });

        contentFormat.sound = '';
        $('#loading-image-content').remove();
        this.showContentUI({
            e,
            from: response.data.detectLanguage.signal,
            contentFormat,
            highlightedText
        });
    }

    #speaker = ind => `<span class="glyphicon glyphicon-bullhorn" 
            style="top: 3px;" id="pro_${ind}"></span>`

    updateContentUI = descriptionArr => {
        const contentDOM = document.querySelector('#popup-modal-transl');
        let contentDOMContentUI = contentDOM.shadowRoot.querySelector('#definition_word').innerHTML;
        let originPro = descriptionArr.pop()
        let desArr = descriptionArr

        desArr && desArr.length > 0 && desArr.map((des, postition) => {
            let pronound = ``
            for (let ind = 0; ind < des.pro.length || 0; ind++) {
                if (des.pro[ind].type != '' && des.pro[ind].pro != '') {
                    let url = des.pro[ind].url
                    pronound += `<p style='font-size: 13px;'>
                                    &nbsp;
                                    ${url && url.trim() != "" ? this.#speaker(2 * postition + ind + 2) : this.#speakerNone}
                                    <i style="font-size:11px;"> (${des.pro[ind].type})</i> 
                                    ${des.pro[ind].pro}
                                </p>`;
                }
            }

            let description = ``
            for (let ind = 0; ind < des.des.length; ind++) {
                description += `<p style="font-size: 15px;">&nbsp;
                                <span class="glyphicon glyphicon-chevron-right"></span>
                                ${des.des[ind]}
                            </p>`;
            }
            contentDOMContentUI +=
                `<div>
                        <h4 style="font-weight:bold;"> 
                            <a class="referenceUrl" href="${des.referenceLink || des.url}" target="_blank"
                            data-toggle="tooltip" title="click more information">
                                ${des.highlightedText} (${WORDTYPELIST[des.typeText.trim().toLowerCase()] || 'unk'})
                            </a>
                        </h4>
                        ${pronound}
                    </div>
                    <div style="line-height: normal;">
                        ${description}
                    </div>`
        })
        contentDOM.shadowRoot.querySelector('#definition_word').innerHTML = contentDOMContentUI
        contentDOM.shadowRoot.querySelector('#relate_word').innerHTML = ""
        // add click burn horn
        if(desArr && desArr.length > 0){
            desArr.unshift(originPro)
            this.#takeSoundEvent(desArr, 0, desArr.length)
        }
    }

    #takeSoundEvent(contentFormats, from, to) {
        const shadow = document.querySelector('#popup-modal-transl')
        let setTime;
        const playSound = url => {
            try {
                setTime && clearTimeout(setTime)
                setTime = setTimeout(new Audio(url).play(), 300);
            } catch (e) {
                throw new Error(`Error: ${e}`);
            }
        }

        // click buhorn span
        for (let ind = 0; ind < to; ind++) {
            for(let pos = 0; pos < contentFormats[ind].pro.length; pos++){
                const listenEvent = shadow.shadowRoot.querySelector('#pro_' + (from + 2 * ind + pos));
                listenEvent && listenEvent.addEventListener('click', function (e) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    // do somthing there
                    playSound(contentFormats[ind].pro[pos].url)
                });
            }
        }
    }
}

export {
    BuildContentUI
}