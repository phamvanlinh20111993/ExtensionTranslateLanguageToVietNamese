(async () => {

    const helperRootUrl = chrome.extension.getURL('./js/Helper.js');
    const helperRoot = await import(helperRootUrl);

    const helperSrc = chrome.extension.getURL('./js/buildUI/Helpers.js');
    const helpers = await import(helperSrc);
    const formatText = helpers.formatText;

    const analysisDataUIUrl = chrome.extension.getURL('./js/buildUI/analysisdata/AnalysisDataUI.js');
    const analysisDataUIInstance = await import(analysisDataUIUrl);
    const analysisDataUI = new analysisDataUIInstance.AnalysisDataUI();

    const buildPopupUIUrl = chrome.extension.getURL('./js/buildUI/popupcontent/BuildPopupUI.js');
    const buildPopupUIInstance = await import(buildPopupUIUrl);
    const buildPopupUI = new buildPopupUIInstance.BuildPopupUI();

    const analysisTextImageURL = chrome.extension.getURL('./js/analysisTextImage/AnalysisTextImage.js')
    const analysisTextImageInstance = await import(analysisTextImageURL);
    const analysisTextImage = new analysisTextImageInstance.AnalysisTextImage();


    async function showContent(highlightedText) {
        let showDomContext = document.getElementById("showDomContext");
        analysisDataUI.setData(highlightedText);
        // get data response after analysis
        const response = await analysisDataUI.getDataResponse();

        if (!helpers.isNull(response) && !response.err) {
            let data, textTranslated = null
            // string can not be stranslated
            if (typeof response === 'string' || typeof response.response === 'string') {
                let dataResponse = typeof response === 'string' ? response : response.response
                data = {
                    translate: dataResponse
                }
                textTranslated = dataResponse
                // string is translated and is paragraph
            } else if (response.type == helpers.PARAGRAPH_INFORMATION) {
                data = {
                    translate: response.response.data.text
                }
                textTranslated = response.response.data.text
                // string is translated and is text
            } else {
                data = response.response.data
            }

            data.content = highlightedText;
            if (textTranslated && textTranslated.toLowerCase() === highlightedText.toLowerCase()) {

            } else {
                showDomContext.innerHTML = buildPopupUI.showContentUI(data)
                buildPopupUI.megaPhone(data.pro && data.pro.length || 0)
            }
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

    addEventListenerUploadImageFile = () => {

        const checkImageFile = function (file) {
            if (!file.type.startsWith('image/')) {
                return false;
            }
            return true;
        }

        const calculateImageSize = function ({
            height,
            width
        }) {
            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 600;

            height = height == 0 ? 1 : height;
            width = height == 0 ? 1 : width;

            const minRatio = Math.min(MAX_HEIGHT / height, MAX_WIDTH / width)

            return {
                height: parseInt(minRatio * height),
                width: parseInt(minRatio * width)
            }
        }

        const buttonSubmit = document.getElementById('submit-image-file');
        const bodyWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const spinnerLoading = document.getElementById('spinner-loading-content');
        const divImageRange = document.querySelector('#image-range');
        const error = document.getElementById('show-error');
        const fileUpload = document.getElementById('upload-image-file');
        const inputTyping = document.getElementById('checkValueTyping');

        const handleFileUpload = function (file) {
           
            divImageRange.style.display = "block";
            divImageRange.innerHTML = '';

            const img = document.createElement('IMG');
            img.setAttribute("id", "img");
            img.setAttribute("class", "img-rounded");
            img.setAttribute("alt", "Cinque Terre");
            divImageRange.appendChild(img);  
            //   img.classList.add("obj");
            img.file = file;

            const reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);

            reader.readAsDataURL(file);

            const submitForm = document.getElementById('submit-image-file');
            submitForm.style.display = 'block';

            const inputTyping = document.getElementById('checkValueTyping');
            inputTyping.disabled = true;
        }

        fileUpload.addEventListener('change', function (e) {
            error.style.display = 'none';
            spinnerLoading.style.display = "none";

            if (fileUpload.value !== helperRoot.STRING_EMPTY) {

                if (checkImageFile(fileUpload.files[0])) {
                    handleFileUpload(fileUpload.files[0]);
                    const img = document.querySelector('#image-range img');
                    img.onload = function (aImg) {
                        const obj = calculateImageSize({
                            width: img.width,
                            height: img.height
                        })
                        img.width = obj.width
                        img.height = obj.height
                    };
                    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 300)
                } else {
                    divImageRange.style.display = "none";

                    const submitForm = document.getElementById('submit-image-file');
                    submitForm.style.display = 'none';

                    inputTyping.disabled = false;

                    error.style.display = 'block';
                    error.innerHTML = '<strong>Error!</strong> File uploaded is not a image.';
                }
            }
        });

        buttonSubmit.addEventListener("click", function (e) {

            inputTyping.disabled = false;

            spinnerLoading.style.display = "block";
            spinnerLoading.style.marginLeft = (bodyWidth / 2) + "px";
            window.scrollTo(0, document.body.scrollHeight);

            e.preventDefault();
            // init action submit form
            if (checkImageFile(fileUpload.files[0])) {
                let formData = new FormData();
                formData.append('upload-image-file', fileUpload.files[0], fileUpload.files[0].name)

                analysisTextImage.getTextFromImageFile(formData, function (data) {
                    const response = data.result;
                    spinnerLoading.style.display = "none";

                    if (!response.err) {
                        showContent(helpers.formatText(response.text))
                        setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 300)
                    };
                })
            }
        })
    }

    // using in async case
    if (document.readyState !== "loading") {
        addEventListenerInputContentPopup();
        addEventListenerUploadImageFile();
        console.info('DOM content loaded in async case.')
    } else {
        document.addEventListener('DOMContentLoaded', addEventListenerInputContentPopup, false);
        document.addEventListener('DOMContentLoaded', addEventListenerUploadImageFile, false);
    }

})();