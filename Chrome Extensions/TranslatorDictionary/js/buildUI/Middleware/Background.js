// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//import {GetDomOxfordPage} from './DomAnalys/analysOxfordlearnersdictionariesPage.js';

chrome.runtime.onInstalled.addListener(function () {
    console.log("Extension are installed.");
});

chrome.runtime.onConnect.addListener(port => {
    console.log("We are connected now...", port);
});

// chrome.browserAction.onClicked.addListener(function(tab) { 

// });

(async () => {
    const helperUrl = chrome.runtime.getURL("./js/buildUI/Helpers.js");
    const helper = await import(helperUrl);

    const formatDataResponseUrl = chrome.runtime.getURL("./js/buildUI/middleware/FormatDataResponse.js");
    const formatDataResponse = await import(formatDataResponseUrl);

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            request.value = request.value && request.value.toLowerCase() || '';

            console.log(sender.tab ?
                "Conected from a content script:" + sender.tab.url :
                "Conected from the extension");
            
            if (request.signal === helper.TEXT_INFORMATION) {
               
                formatDataResponse.formatWordResponse(request.value, request.currentType).then(result => {
                    if (!result) {
                        sendResponse({
                            data: null,
                            err: true
                        })
                    } else {
                        sendResponse({
                            data: result,
                            err: false
                        })
                    }
                });

                return true; // Inform Chrome that we will make a delayed sendResponse
            }

            if (request.signal === helper.PARAGRAPH_INFORMATION ||
                request.signal === helper.CHECK_LANGUAGE) {
                formatDataResponse.formatTextResponse(request.value, request.targetType).then(result => {

                    if (result.err) {
                        sendResponse({
                            data: null,
                            err: true
                        })
                    } else {
                        sendResponse({
                            data: result.result,
                            err: false
                        })
                    }
                })

                return true; // Inform Chrome that we will make a delayed sendResponse
            }

            return true; // Inform Chrome that we will make a delayed sendResponse
        });
})();