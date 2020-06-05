(async () => {

    const helperSrc = chrome.extension.getURL('./js/buildUI/Helpers.js');
    const helpers = await import(helperSrc);
    const formatText = helpers.formatText;

    const analysisDataUIUrl = chrome.extension.getURL('./js/buildUI/analysisdata/AnalysisDataUI.js');
    const analysisDataUIInstance = await import(analysisDataUIUrl);
    const analysisDataUI = new analysisDataUIInstance.AnalysisDataUI();

    const buildPopupUIUrl = chrome.extension.getURL('./js/buildUI/popupcontent/BuildPopupUI.js');
    const buildPopupUIInstance = await import(buildPopupUIUrl);
    const buildPopupUI = new buildPopupUIInstance.BuildPopupUI();

    async function showContent(highlightedText) {
        let showDomContext = document.getElementById("showDomContext");
        analysisDataUI.setData(highlightedText);
        // get data response after analysis
        const response = await analysisDataUI.getDataResponse();
        if (!helpers.isNull(response) && !response.err) {
            let data
            // string can not be stranslated
            if (typeof response.response === 'string') {
                data = {
                    translate: response.response
                }
                // string is translated and is paragraph
            } else if (response.type == helpers.PARAGRAPH_INFORMATION) {
                data = {
                    translate: response.response.data.text
                }
                // string is translated and is text
            } else {
                data = response.response.data
            }
            data.content = highlightedText;
            showDomContext.innerHTML = buildPopupUI.showContentUI(data)
            buildPopupUI.megaPhone(data.pro && data.pro.length || 0)
        }
    }

    addEventListenerInputContentPopup = () => {
        let inputTyping = document.getElementById('checkValueTyping');
        // event 
        chrome.runtime.getBackgroundPage(function (bg) {
            chrome.storage.sync.get(['chooseText'], async function (items) {
                if (items.chooseText) {
                    inputTyping.value = items.chooseText;
                    let highlightedText = formatText(items.chooseText);
                    highlightedText != "" && showContent(highlightedText);
                    chrome.storage.sync.remove(['chooseText'], function (Items) {
                        console.info('Removed items.')
                    });
                } else {
                    inputTyping.value = '';
                }
            });
        });

        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, ([tab]) => {
            console.info('Active tab.', tab.title)
        });

        inputTyping.addEventListener('click', function (e) {
            //auto focus input
            inputTyping.focus();
            chrome.tabs.getSelected(null, function (tab) {
                d = document;
                let highlightedText = formatText(e.target.value);
                highlightedText != "" && showContent(highlightedText)
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

        inputTyping.addEventListener('keyup', async function (e) {
            e.preventDefault();
            let x = e.which || e.keyCode;
            if (x == 13) {
                let highlightedText = e.target.value;
                !helpers.isNull(highlightedText) && showContent(helpers.formatText(highlightedText))
            }
        }, false);
    }

    // using in async case
    if (document.readyState !== "loading") {
        addEventListenerInputContentPopup();
        console.info('DOM content loaded in async case.')
    } else {
        document.addEventListener('DOMContentLoaded', addEventListenerInputContentPopup, false);
    }

})();