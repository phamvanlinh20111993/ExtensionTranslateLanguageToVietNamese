import {
    replaceTagHTMLByString,
    getOnLyValueInTag,
} from '../../Helper.js';

import {
    LABAN_URL
} from '../../../api/Helper.js';

import {
    AbstractTranslateWord
} from '../AbstractTranslateWord.js';

import {
    requestUrl
} from '../../../api/Helper.js'

class GetDomDictLabanPage extends AbstractTranslateWord {
    #dom;
    #word;
    
    constructor(dom, word) {
        super();
        this.#dom = dom || document.body.appendChild(document.createElement("BODY"));
        this.#word = word;
    }

    //id word_not_found
    checkWordIsCorrect = () => this.#dom.getElementsByClassName("fl word_tab_title word_tab_title_0")[0]

    getWord = () => {
        let container = this.#dom.getElementsByClassName("fl word_tab_title word_tab_title_0")[0],
            word = '';
        if (container) {
            let h2Tag = container.querySelector("h2");
            word = h2Tag && getOnLyValueInTag(h2Tag) || word;
        }
        return word;
    }

    getReferenceLink(){
        return LABAN_URL+"/find?query=" + this.getWord();
    }

    getPronoundAndSound = () => {
        let container = this.#dom.getElementsByClassName("color-black")[0],
            obj = [{
                type: "US",
                pro: '',
                url: ''
            }, {
                type: "UK",
                pro: '',
                url: ''
            }];
        if (container) {
            let pro = container.innerHTML;
            obj[0] = {
                type: "US",
                pro: pro || '',
                url: ''
            };
            obj[1] = {
                type: "UK",
                pro: pro || '',
                url: ''
            }
        }

        const _this = this;

        return new Promise(resolve => {
            requestUrl({
                url: LABAN_URL,
                params: [{
                    value: 'ajax'
                }, {
                    value: 'getsound'
                }],
                query: {
                    accent: 'us',
                    word: _this.#word
                },
                requestType: "GET",
            }, (result, err) => {
                if (err) {
                    console.log(err)
                } else {
                    obj[0].url = result.data;
                    requestUrl({
                        url: LABAN_URL,
                        params: [{
                            value: 'ajax'
                        }, {
                            value: 'getsound'
                        }],
                        query: {
                            accent: 'uk',
                            word: _this.#word
                        },
                        requestType: "GET",
                    }, (res, err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            obj[1].url = res.data;
                            resolve(obj);
                        }
                    });
                }
            });
        })
    }

    getTranslateDes = () => {
        let obj = [],
            container = this.#dom.querySelectorAll("#content_selectable")[1],
            ind = -1;
        if (container) {
            let childNode = container.childNodes;
            for (const e of childNode) {
                if (e.nodeType != 3) {
                    if (e.className == "bg-grey bold font-large m-top20") {
                        ind++;
                        let type = replaceTagHTMLByString(e.innerHTML, '');
                        obj[ind] = {
                            type,
                            mean: []
                        }
                    }

                    if (e.className == "grey bold margin25 m-top15") {
                        let mean = e.innerHTML || '',
                            indTmp = ind < 0 ? 0 : ind;
                        if (!obj[indTmp]) {
                            obj[indTmp] = {
                                type: 'Kiểu không xác định',
                                mean: []
                            }
                        }
                        obj[indTmp].mean.push(mean)
                    } else if (e.className == "green bold margin25 m-top15") {
                        let mean = e.innerHTML || '',
                            indTmp = ind < 0 ? 0 : ind;
                        if (!obj[indTmp]) {
                            obj[indTmp] = {
                                type: 'Kiểu không xác định',
                                mean: []
                            }
                        }
                        obj[indTmp].mean.push(mean)
                    }
                }
            }
            // omg check
            if (obj.length == 0) {
                for (const e of childNode) {
                    if (e.nodeType != 3) {
                        if (e.className == "bg-grey bold font-large m-top20") {
                            ind++;
                            let type = replaceTagHTMLByString(e.innerHTML, '');
                            obj[ind] = {
                                type,
                                mean: []
                            }
                        }
                        if (e.className == "grey bold margin25 m-top15") {
                            let mean = e.innerHTML || '',
                                indTmp = ind < 0 ? 0 : ind;
                            if (!obj[indTmp]) {
                                obj[indTmp] = {
                                    type: 'Kiểu không xác định',
                                    mean: []
                                }
                            }
                            obj[indTmp].mean.push(mean)
                        } else if (e.className == "grey bold margin25 m-top15") {
                            let mean = e.innerHTML || '',
                                indTmp = ind < 0 ? 0 : ind;
                            if (!obj[indTmp]) {
                                obj[indTmp] = {
                                    type: 'Kiểu không xác định',
                                    mean: []
                                }
                            }
                            obj[indTmp].mean.push(mean)
                        }
                    }
                }
            }
        }

        return obj;
    }
}

export {
    GetDomDictLabanPage
};