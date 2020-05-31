(async () => {
    const helperSrc = chrome.extension.getURL('./js/buildUI/Helpers.js');
    const helpers = await import(helperSrc);
    const [IGNORETAGS,
        WORDTYPELIST,
        TEXT_INFORMATION,
        PARAGRAPH_INFORMATION,
        MAX_TEXT,
        CHECK_LANGUAGE,
        matchWord,
        matchString,
        formatText,
        checkURLImage,
        removeWindowSelectionText,
        getOffsetDimension,
        preventClickInSideContentRange,
        checkVietNameseChar
    ] = [helpers.IGNORETAGS,
        helpers.WORDTYPELIST,
        helpers.TEXT_INFORMATION,
        helpers.PARAGRAPH_INFORMATION,
        helpers.MAX_TEXT,
        helpers.CHECK_LANGUAGE,
        helpers.matchWord,
        helpers.matchString,
        helpers.formatText,
        helpers.checkURLImage,
        helpers.removeWindowSelectionText,
        helpers.getOffsetDimension,
        helpers.preventClickInSideContentRange,
        helpers.checkVietNameseChar
    ];

    const builContentUIUrl = chrome.extension.getURL('./js/buildUI/pagecontent/BuildContentUI.js');
    const builContentUI = await import(builContentUIUrl);
    const buildContentUIClass = new builContentUI.BuildContentUI();

    const analysisDataUIUrl = chrome.extension.getURL('./js/buildUI/analysisdata/AnalysisDataUI.js');
    const analysisDataUIInstance = await import(analysisDataUIUrl);
    const analysisDataUI = new analysisDataUIInstance.AnalysisDataUI();

    getDataResponse = (highlightedText, callback) => {

        if (matchWord(highlightedText)) {
            if (!checkVietNameseChar(highlightedText)) {

                chrome.runtime.sendMessage({
                    signal: CHECK_LANGUAGE,
                    value: highlightedText,
                    currentType: 'en',
                    targetType: 'vi'
                }, function (response) {

                    if (response.err)
                        callback(null, response.err)

                    if (response.data) {
                        if (response.data.detectLanguage.signal != 'en') {
                            callback({
                                lang: response.data.detectLanguage.signal,
                                response
                            }, null)
                        } else {
                            chrome.runtime.sendMessage({
                                signal: TEXT_INFORMATION,
                                value: highlightedText,
                                currentType: 'en',
                                targetType: 'vi'
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
                value: highlightedText,
                currentType: 'en',
                targetType: 'vi'
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

    $(document).off("cut copy paste", "**");

    let timeoutShowPopUp = null;
    $(document).mouseup(async function (e) {

        // e.stopPropagation();
        e.preventDefault();
        if (preventClickInSideContentRange("translator-popup-page", e))
            return;

        //match text match is in input tag or textArea tag,... do nothing
        if ($(e.target)[0] && IGNORETAGS.includes($(e.target)[0].tagName)) {
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
        console.info('Text selected: ', highlightedText)
        if (matchString(highlightedText)) {
            // set data to storage
            chrome.storage.sync.set({
                chooseText: highlightedText
            }, function () {
                console.info("Settings saved.");
            });

            const contentFormat = {};

            //standard input text
            highlightedText = formatText(highlightedText);

            analysisDataUI.setData(highlightedText);
            // get data response after analysis
            const response1 = await analysisDataUI.getDataResponse();
            console.log(response1, '---------------------------------------------------------------------------------------------')

            getDataResponse(highlightedText, (response, error) => {
                if (response) {

                    console.log(response)

                    if (response.lang) {
                        if (response.lang != 'en') {
                            const obj = {
                                highlightedText,
                                translateText: response.response.data.text
                            }
                            contentFormat.dom = buildContentUIClass.contentTextP(obj)
                            buildContentUIClass.showContentUI({
                                e,
                                from: response.response.data.detectLanguage.signal,
                                contentFormat,
                                highlightedText
                            });
                        } else {
                            const contentTextArg = response.response.data;
                            let typeText = contentTextArg.typeText || '';

                            typeText = typeText.split(",")
                            for (let i = 0; i < typeText.length; i++)
                                typeText[i] = WORDTYPELIST[typeText[i].trim().toLowerCase()]

                            contentTextArg.typeText = typeText.join(', ')
                            contentTextArg.highlightedText = highlightedText;
                            contentFormat.dom = buildContentUIClass.contentText(contentTextArg);
                            contentFormat.pro = contentTextArg.pro;

                            buildContentUIClass.showContentUI({
                                e,
                                from: response.lang,
                                contentFormat,
                                highlightedText
                            });
                        }
                        //reponse.type
                    } else {
                        const obj = {
                            highlightedText,
                            translateText: response.response.data.text
                        }
                        contentFormat.dom = buildContentUIClass.contentTextP(obj);
                        contentFormat.sound = '';
                        buildContentUIClass.showContentUI({
                            e,
                            from: response.response.data.detectLanguage.signal,
                            contentFormat,
                            highlightedText
                        });
                    }
                }
            })

            const browser = chrome || browser;
            browser.runtime.connect().onDisconnect.addListener(function () {
                // clean up when content script gets disconnected
                console.info("Retry connected...")
            });
        }

    });


    $(document).dblclick(function (e) {
        e.preventDefault();
        e.stopPropagation()
        e.stopImmediatePropagation();

        if (preventClickInSideContentRange("translator-popup-page", e))
            return;

        !$(e.target)[0] && ['IMG', 'img'].includes($(e.target)[0].tagName) &&
            $('#loading-image-content') &&
            $('#loading-image-content').length > 0 &&
            $('#loading-image-content').remove();

        if ($(e.target)[0] && ['IMG', 'img'].includes($(e.target)[0].tagName) &&
            checkURLImage($(e.target)[0].src)) {
            // modal loading translate image text
            !$('#loading-image-content').length && buildContentUIClass.contentLoading(e, 'Loading text ...');
            checkTextImage($(e.target)[0].src, (response, error) => {

                if (!response) {
                    $('#loading-image-content').remove();
                    buildContentUIClass.contentLoading(e, 'Image not contains any text.')
                    checkContentTimeout && clearTimeout(checkContentTimeout)
                    checkContentTimeout = setTimeout(() => $('#loading-image-content').remove(), 2500)
                    return;
                }

                //check is translate image content
                //loading content is showing
                if ($('#loading-image-content') && $('#loading-image-content').length > 0) {
                    const textFromImage = response.textInImage;
                    const contentFormat = {};
                    contentFormat.dom = buildContentUIClass.contentTextP({
                        highlightedText: textFromImage,
                        translateText: response.data.text
                    });
                    contentFormat.sound = '';
                    $('#loading-image-content').remove();
                    buildContentUIClass.showContentUI({
                        e,
                        from: response.data.detectLanguage.signal,
                        contentFormat,
                        $translatorPopupPage: $('#translator-popup-page'),
                        textFromImage
                    });
                }
            });
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

            (coordSelectedText.bottom - coordSelectedText.top >= 7) &&
            (coordSelectedText.right - coordSelectedText.left >= 5) &&
            !(clickCoordX > coordSelectedText.left - 10 &&
                clickCoordX < coordSelectedText.right + 10 &&
                clickCoordY > coordSelectedText.top - 10 &&
                clickCoordY < coordSelectedText.bottom + 10) &&
            removeWindowSelectionText()
        }
    })

})();