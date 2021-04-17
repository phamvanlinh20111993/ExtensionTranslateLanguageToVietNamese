(async () => {
    const helperSrc = chrome.extension.getURL('./js/buildUI/Helpers.js');
    const helpers = await import(helperSrc);
    const [IGNORETAGS,
        PARAGRAPH_INFORMATION,
        TEXT_INFORMATION,
        matchString,
        formatText,
        checkURLImage,
        getOffsetDimension,
        preventClickInSideContentRange,
        isNull
    ] = [helpers.IGNORETAGS,
        helpers.PARAGRAPH_INFORMATION,
        helpers.TEXT_INFORMATION,
        helpers.matchString,
        helpers.formatText,
        helpers.checkURLImage,
        helpers.getOffsetDimension,
        helpers.preventClickInSideContentRange,
        helpers.isNull
    ];

    const builContentUIUrl = chrome.extension.getURL('./js/buildUI/pagecontent/BuildContentUI.js');
    const builContentUI = await import(builContentUIUrl);
    const buildContentUIClass = new builContentUI.BuildContentUI();

    const analysisDataUIUrl = chrome.extension.getURL('./js/buildUI/analysisdata/AnalysisDataUI.js');
    const analysisDataUIInstance = await import(analysisDataUIUrl);
    const analysisDataUI = new analysisDataUIInstance.AnalysisDataUI();

    const analysisImageTextUrl = chrome.extension.getURL('./js/analysisTextIMAGE/AnalysisTextImage.js');
    const analysisImageTextInstance = await import(analysisImageTextUrl);
    const analysisImageText = new analysisImageTextInstance.AnalysisTextImage();

    const buildIconTranslateUIUrl = chrome.extension.getURL('./js/buildUI/pagecontent/BuildIconTranslateUI.js');
    buildIconTranslateUI = await import(buildIconTranslateUIUrl);

    let checkTimeOutTranslateText, checkContentTimeout;

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
                        value: text,
                        targetType: 'vi'
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

    $(document).off("cut copy paste", "**");

    let timeoutShowPopUp = null;
    $(document).mouseup(async function (e) {
        // e.stopPropagation();
        e.preventDefault();
        if (preventClickInSideContentRange("translator-popup-page", e))
            return;

        if (preventClickInSideContentRange("loading-icon-translate", e))
            return;

        //match text match is in input tag or textArea tag,... do nothing
        if ($(e.target)[0] && IGNORETAGS.includes($(e.target)[0].tagName)) {
            $('#translator-popup-page').remove();
            return;
        }

        // remove image loading popup loading
        $('#loading-image-content') &&
            $('#loading-image-content').length > 0 &&
            $('#loading-image-content').remove();

        // remove icon translate popup loading
        $('#loading-icon-translate') &&
            $('#loading-icon-translate').length > 0 &&
            $('#loading-icon-translate').remove();

        let highlightedText = "";
        (window.getSelection && (highlightedText = window.getSelection().toString())) ||
        (document.selection && document.selection.type != "Control" && (
            highlightedText = document.selection.createRange().text));

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
        console.info('Text selected: ', highlightedText)
        if (matchString(highlightedText)) {
            // set data to storage
            chrome.storage.sync.set({
                chooseText: highlightedText
            }, function () {
                console.info("Settings saved.");
            });
            //standard input text
            highlightedText = formatText(highlightedText);
            analysisDataUI.setData(highlightedText);
            // get data response after analysis
            const response = await analysisDataUI.getDataResponse();
            //  alert('data'  +  JSON.stringify(response))
            if (!isNull(response) && !response.err) {
                let data
                // string can not be stranslated, then return this input, do nothing
                if (typeof response.response === 'string') {
                    //........
                } else if (response.type == PARAGRAPH_INFORMATION) {
                    data = {
                        translateText: response.response.data.text,
                        lang: response.lang
                    }
                    if (response.response.data.text.toLowerCase() !== highlightedText.toLowerCase()) {
                        buildIconTranslateUI.showIconTranslate(e, function (sign) {
                            $('#loading-icon-translate').remove();
                            buildContentUIClass.showContentUITranslateString(e, highlightedText, {
                                ...data
                            })
                        })
                    }
                } else if (response.type == TEXT_INFORMATION) {
                    data = response.response.data;
                    data.lang = response.lang
                    buildIconTranslateUI.showIconTranslate(e, function (sign) {
                        $('#loading-icon-translate').remove();

                        buildContentUIClass.showContentUITranslateWord(e, highlightedText, {
                            ...data
                        })
                        const relateWords = data.relateWords;
                        // click relate words
                        if (relateWords && relateWords.length > 0) {
                            clickRelateWord(relateWords)
                        }
                    })
                }
            }

            const browser = chrome || browser;
            browser.runtime.connect().onDisconnect.addListener(function () {
                // clean up when content script gets disconnected
                console.info("Retry connected...")
            });
        }

    });


    $(document).dblclick(async function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();


        // remove icon translate popup loading
        $('#loading-icon-translate') &&
            $('#loading-icon-translate').length > 0 &&
            $('#loading-icon-translate').remove();

        // 
        const $translatorPopupPage = $('#translator-popup-page');
        if ($translatorPopupPage.length > 0) {
            $translatorPopupPage.remove();
        }

        if (preventClickInSideContentRange("translator-popup-page", e))
            return;

        !$(e.target)[0] && ['IMG', 'img'].includes($(e.target)[0].tagName) &&
            $('#loading-image-content') &&
            $('#loading-image-content').length > 0 &&
            $('#loading-image-content').remove();

        if ($(e.target)[0] && ['IMG', 'img'].includes($(e.target)[0].tagName) &&
            checkURLImage($(e.target)[0].src)) {
            // modal loading translate image text
            !$('#loading-image-content').length && buildContentUIClass.contentLoading(e, 'Analyzing photos ...');

            analysisImageText.getTextFromImageAPI($(e.target)[0].src, async function (data) {
                // analysisImageText.getTextFromImageClient($(e.target)[0].src, async function (data) {
                console.log('data', data)
                // response is not existed or error is true then clear popup then do nothing and return
                const responseResult = data.result;
                //   const responseResult = data;
                if (data.err) {
                    $('#loading-image-content').remove();
                    buildContentUIClass.contentLoading(e, 'Image not contains any text.');
                    checkContentTimeout && clearTimeout(checkContentTimeout);
                    checkContentTimeout = setTimeout(() => $('#loading-image-content').remove(), 2000);
                    return;
                }

                //check is translate image content
                //loading content is showing
                if ($('#loading-image-content') && $('#loading-image-content').length > 0) {
                    analysisDataUI.setData(responseResult.text);
                    // get data response after analysis
                    let responseUI = {
                        data: {
                            text: '',
                            detectLanguage: {
                                signal: 'en'
                            }
                        }
                    };
                    let response = await analysisDataUI.getDataResponse();
                    console.log('await analysisDataUI.getDataResponse() response: ', response)
                    if (typeof response === 'string')
                        responseUI.data.text = response;
                    else
                        responseUI = response.response

                    buildContentUIClass.showContentUITranslateImage(e, responseResult.text, responseUI);
                }
            })
            // TODO implement new solution
            //  console.info('imageInstance', imageInstance)
            /*      checkTextImage($(e.target)[0].src, (response, error) => {

                      console.info('Log checkTextImage response: ', {
                          response,
                          error
                      })

                      // response is not existed or error is true then clear popup then do nothing and return
                      if (!response) {
                          $('#loading-image-content').remove();
                          buildContentUIClass.contentLoading(e, 'Image not contains any text.')
                          checkContentTimeout && clearTimeout(checkContentTimeout)
                          checkContentTimeout = setTimeout(() => $('#loading-image-content').remove(), 2000)
                          return;
                      }

                      //check is translate image content
                      //loading content is showing
                      if ($('#loading-image-content') && $('#loading-image-content').length > 0) {
                          buildContentUIClass.showContentUITranslateImage(e, response.textInImage, response);
                      }
                  }); */
        }
    });

    $(document).keydown(function (e) {
        const $translatorPopupPage = $('#translator-popup-page');
        if ($translatorPopupPage.length > 0) {
            $translatorPopupPage.remove();
        }
    });

    $(document).click((e) => {
        const isSelectText = window.getSelection && window.getSelection();
        if (isSelectText && isSelectText.rangeCount > 0) {
            const coordSelectedText = getOffsetDimension(window.getSelection().getRangeAt(0));
            const clickCoordX = e.pageX,
                clickCoordY = e.pageY;

            // (coordSelectedText.bottom - coordSelectedText.top >= 7) &&
            // (coordSelectedText.right - coordSelectedText.left >= 5) &&
            // !(clickCoordX > coordSelectedText.left - 40 &&
            //     clickCoordX < coordSelectedText.right + 40 &&
            //     clickCoordY > coordSelectedText.top - 40 &&
            //     clickCoordY < coordSelectedText.bottom + 40) &&
            // removeWindowSelectionText()
        }
    })

    let clickRelateWord = (relateWords) => {
        const contentDOM = document.querySelector('#popup-modal-transl')

        for (let ind = 0; ind < relateWords.length; ind++) {
            const listenRelateEvent = contentDOM.shadowRoot.querySelector('#relate_' + ind);

            listenRelateEvent && listenRelateEvent.addEventListener('click', async function (e) {
                e.stopPropagation();
                e.stopImmediatePropagation();

                let dataResponses = []
                for (let pos = 0; pos < relateWords.length; pos++) {
                    analysisDataUI.setData(relateWords[pos][1]);
                    const responseData = await analysisDataUI.getDataResponseByUrl();
                    let dataResponse = {}
                    dataResponse.des = responseData.data.des
                    dataResponse.relateWords = responseData.data.relateWords
                    dataResponse.pro = responseData.data.pro
                    dataResponse.referenceLink = relateWords[pos][1]
                    dataResponse.typeText = relateWords[pos][2]
                    dataResponse.highlightedText = relateWords[pos][0].trim()
                    dataResponses.push(dataResponse)
                }

                buildContentUIClass.updateContentUI(dataResponses)
            });
        }
    }

})();