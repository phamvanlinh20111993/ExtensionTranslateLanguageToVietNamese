import {
    standardStr,
    replaceTagHTMLByString,
    getValueOnAttr,
    getUrlInText
} from '../../Helper.js';

import {
    AbstractTranslateWord
} from '../AbstractTranslateWord.js'

class GetDomLacVietPage extends AbstractTranslateWord {
    #dom;
    #word;
    constructor(dom, word) {
        super();
        this.#dom = dom || document.body.appendChild(document.createElement("BODY"));
        this.#word = word;
    }

    checkWordIsCorrect = () => this.#dom.getElementById("divContent")

    getWord = () => {
        let container = this.#dom.getElementsByClassName("m5t")[0],
            word = '';
        if (container) {
            word = container.getElementsByClassName("w fl")[0];
            word = word && word.innerHTML;
        }
        return word;
    }

    getPronoundAndSound = () => {
        let container = this.#dom.getElementsByClassName("m5t")[0],
            obj = [];
        if (container) {
            let pro = container.getElementsByClassName("p5l fl cB")[0];
            pro = pro && pro.innerHTML;
            let urlContainer = container.getElementsByClassName("p5l fl")[1],
                url = '';
            if (urlContainer) {
                let urlDom = urlContainer.getElementsByTagName("embed")[0];
                url = urlDom && getValueOnAttr(urlDom, 'flashvars');
            }

            obj[0] = {
                type: 'BrE',
                url: getUrlInText(url),
                pro
            }
        }
        return new Promise(resolve => resolve(obj));
    }

    getTranslateDes = () => {
        let obj = [],
            container = this.#dom.getElementsByClassName('m5t')[0],
            ind = 0;

        if (container) {
            container = container.getElementsByClassName('p10')[0];
            while (container && container.querySelector(`#partofspeech_${ind}`)) {
                let typeText = container.querySelector(`#partofspeech_${ind}`);
                if (typeText) {
                    let type = typeText.getElementsByClassName('ub')[0] || '';
                    if (type != '') {
                        type = type.innerHTML;
                    }

                    type = replaceTagHTMLByString(type, '');

                    let meanList = typeText.getElementsByClassName("m"),
                        mean = [];
                    for (let e of meanList) {
                        let replace = replaceTagHTMLByString(e.innerHTML, '');
                        mean.push(standardStr(replace));
                    }
                    obj.push({
                        type,
                        mean
                    })
                }
                ind++
            }
        }

        return obj;
    }
}


export {
    GetDomLacVietPage
};