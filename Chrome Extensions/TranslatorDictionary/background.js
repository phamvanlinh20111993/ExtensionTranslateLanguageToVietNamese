// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//import {GetDomOxfordPage} from './DomAnalys/analysOxfordlearnersdictionariesPage.js';

chrome.runtime.onInstalled.addListener(function () {
    console.log("Extension are installed.");
});

chrome.runtime.onConnect.addListener(port => {
    console.log("We are connected now ", port);
});

// chrome.browserAction.onClicked.addListener(function(tab) { 

// });

(async () => {

    const LABAN_URL = "https://dict.laban.vn";
    const OXFORD_DICT_URL = "https://www.oxfordlearnersdictionaries.com";
    const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com";

    const srcOxford = chrome.runtime.getURL("./js/DomAnalys/analysOxfordlearnersdictionariesPage.js");
    const analysOxford = await import(srcOxford);

    const srcLacViet = chrome.runtime.getURL("./js/DomAnalys/analysLacVietPage.js");
    const analysLacViet = await import(srcLacViet);

    const srcLaBan = chrome.runtime.getURL("./js/DomAnalys/analysLaBanPage.js");
    const analysLaBan = await import(srcLaBan);

    const libAn = chrome.runtime.getURL("./js/DomAnalys/lib.js");
    const lib = await import(libAn);

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            request.value = request.value && request.value.toLowerCase() || '';
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

            if (request.signal === "TEXT_INFORMATION") {

                lib.requestUrl({
                    url: OXFORD_DICT_URL,
                    params: [{
                            value: 'definition',
                            type: 'String'
                        },
                        {
                            value: 'english',
                            type: 'String'
                        },
                        {
                            value: request.value,
                            type: 'String'
                        }
                    ],
                    query: {
                        q: request.value
                    },
                    requestType: "GET",
                    data: {},
                    formatReponse: {
                        type: 'Dom',
                        format: 'text/html',
                        elementType: {
                            type: 'id',
                            value: 'entryContent'
                        }
                    }
                }, (result, err) => {
                    if (err) {
                        console.error(err)
                        let responseFormat = {};

                        lib.requestUrl({
                            url: LABAN_URL,
                            params: [{
                                value: 'find',
                                type: 'String'
                            }],
                            query: {
                                type: 1,
                                query: request.value
                            },
                            requestType: "GET",
                            data: {},
                            formatReponse: {
                                type: 'Dom',
                                format: 'text/html',
                                elementType: {
                                    type: 'id',
                                    value: 'slide_show'
                                }
                            }
                        }, (r, e) => {

                            if (e) {
                                sendResponse({
                                    data: null,
                                    e: true
                                })
                            } else {
                                const analysLaBanDom = new analysLaBan.GetDomDictLabanPage(r, request.value);
                                if (!analysLaBanDom.checkWordIsCorrect()) {
                                    sendResponse({
                                        data: null,
                                        e: true
                                    })
                                }

                                responseFormat.des = [];
                                analysLaBanDom.getPronoundAndSound(data => {
                                    let getData = analysLaBanDom.getTranslateDes();
                                    if (getData && typeof getData[0] === 'object') {
                                        responseFormat.typeText = analysLaBanDom.getTranslateDes()[0].type;
                                    }

                                    responseFormat.trans = analysLaBanDom.getTranslateDes();
                                    responseFormat.pro = data;
                                    console.log('đata laban', responseFormat);
                                    sendResponse({
                                        data: responseFormat,
                                        err: false
                                    })
                                })
                            }
                        });
                    } else {
                        const analysOxfordDom = new analysOxford.GetDomOxfordPage(result);
                        let responseFormat = {},
                            getDataFalse = false;

                        // console.log('dd', analysOxfordDom.checkWordIsCorrect())
                        // console.log('dd', analysOxfordDom.getTypeWord())
                        // console.log('dd', analysOxfordDom.getDescriber())
                        // console.log('dd', analysOxfordDom.getPronoundAndSound())

                        if (analysOxfordDom.checkWordIsCorrect()) {
                            getDataFalse = true;
                        } else {
                            responseFormat.typeText = analysOxfordDom.getTypeWord();
                            responseFormat.des = analysOxfordDom.getDescriber();
                            responseFormat.pro = analysOxfordDom.getPronoundAndSound();
                        }

                        lib.requestUrl({
                            url: LABAN_URL,
                            params: [{
                                value: 'find',
                                type: 'String'
                            }],
                            query: {
                                type: 1,
                                query: request.value
                            },
                            requestType: "GET",
                            data: {},
                            formatReponse: {
                                type: 'Dom',
                                format: 'text/html',
                                elementType: {
                                    type: 'id',
                                    value: 'slide_show'
                                }
                            }
                        }, (result, err) => {
                            if (err) {
                                console.log(err)
                                sendResponse({
                                    data: null,
                                    err: true
                                })
                            } else {
                                const analysLaBanDom = new analysLaBan.GetDomDictLabanPage(result, request.value);
                                if (!getDataFalse) {
                                    responseFormat.trans = analysLaBanDom.getTranslateDes();
                                    sendResponse({
                                        data: responseFormat,
                                        err: false
                                    })
                                } else {
                                    responseFormat.des = [];
                                    analysLaBanDom.getPronoundAndSound((data) => {
                                        responseFormat.typeText = analysLaBanDom.getTranslateDes()[0].type;
                                        responseFormat.trans = analysLaBanDom.getTranslateDes();
                                        responseFormat.pro = data;
                                        console.log('đata laban', responseFormat);
                                        sendResponse({
                                            data: responseFormat,
                                            err: false
                                        })
                                    })
                                }
                            }
                        });
                    }
                });

                /*  
                  // preparatory for laban
                  requestUrl({
                    url: 'http://tratu.coviet.vn',
                    params: [{ value: 'hoc-tieng-anh'}, { value: 'tu-dien' },
                             { value: 'lac-viet' }, { value: 'A-V/'}],
                    anotherFormat: `${request.value}.html`, 
                    requestType: "GET",
                    data: {},
                    formatReponse: {
                      type: 'Dom',
                      format: 'text/html',
                      elementType: {
                        type: 'id',
                        value: 'ctl00_ContentPlaceHolderMain_ctl00'
                      }
                    }
                  }, (result, err) => {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log(result)
                      const analysLacVietDom = new analysLacViet.GetDomLacVietPage(result);
                      console.log('analysLacVietDom doc', analysLacVietDom.getWord())
                      console.log('analysLacVietDom doc1', analysLacVietDom.getPronoundAndSound())
                      console.log('analysLacVietDom doc2', analysLacVietDom.getTranslateDes())
                    }
                  }); */
            }

            if (request.signal === "PARAGRAPH_INFORMATION" || request.signal === "CHECK_LANGUAGE") {
                lib.requestUrl({
                    url: API_TRANSLATE_PARAGRAPH_URL,
                    params: [{
                        value: 'translate1'
                    }],
                    query: {
                        to: 'vi',
                        translateText: request.value
                    },
                    requestType: "GET",
                    data: {},
                }, (result, err) => {
                    if (err) {
                        console.log(err)
                        sendResponse({
                            data: null,
                            err: true
                        })
                    } else {
                        console.log(result)
                        sendResponse({
                            data: result,
                            err: false
                        })
                    }
                });
            }

            return true; // Inform Chrome that we will make a delayed sendResponse
        });
})();