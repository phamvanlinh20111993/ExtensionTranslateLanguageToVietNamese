import {
    standardStr,
    replaceTagHTMLByString,
    getValueOnAttr
}
from '../../Helper.js';

import {
    AbstractDefinitionWord
} from '../AbstractDefinitionWord.js';

class GetDomOxfordPage extends AbstractDefinitionWord {
    //private properties
    #dom;

    constructor(dom) {
        super();
        this.#dom = dom || document.body.appendChild(document.createElement("BODY"))
    }

    checkWordIsCorrect = () => {
        this.#dom.getElementsByClassName("definition-title")[0]
    }

    getWord = () => this.#dom.getElementsByClassName("headword")[0] &&
        this.#dom.getElementsByClassName("headword")[0].innerHTML

    getTypeWord = () => {
        let content = this.#dom.getElementsByClassName("pos")[0].innerHTML || '';
        return replaceTagHTMLByString(content, '');
    }

    getPronoundAndSound = () => {
        let container = this.#dom.getElementsByClassName("phonetics")[0],
            obj = [],
            url,
            pro;
        if (container) {
            let phoneBr = container.getElementsByClassName("phons_br")[0]
            if (phoneBr) {
                url = phoneBr.getElementsByClassName("sound audio_play_button pron-uk icon-audio")[0]
                pro = phoneBr.getElementsByClassName("phon")[0]
                obj[0] = {
                    type: 'BrE',
                    url: getValueOnAttr(url, 'data-src-mp3'),
                    pro: pro.innerHTML
                }

            }

            let phonsNAm = container.getElementsByClassName("phons_n_am")[0]
            if (phoneBr) {
                url = phonsNAm.getElementsByClassName("sound audio_play_button pron-us icon-audio")[0]
                pro = phonsNAm.getElementsByClassName("phon")[0]
                obj[1] = {
                    type: 'nAmE',
                    url: getValueOnAttr(url, 'data-src-mp3'),
                    pro: pro.innerHTML
                }

            }
        }

        return obj
    }

    getDescriber = () => {
        let containerM = this.#dom.getElementsByClassName("senses_multiple")[0];
        let containerS = this.#dom.getElementsByClassName("sense_single")[0];
        let obj = []
        let desList = []

        if (containerM) {
            desList = containerM.getElementsByClassName("def");
        }else 
        if (containerS) {
            desList = containerS.getElementsByClassName("def");
        }

        // if (containerM) {
        //     desList = containerM.getElementsByClassName("def") || [];
        // }
        // if (containerS) {
        //     desList = desList.concat(containerS.getElementsByClassName("def") || []);
        // }

        let ind = 0;
        while (desList && ind < desList.length) {
            let str = desList[ind++].innerHTML || "";
            str = replaceTagHTMLByString(str, '');
            str = standardStr(str)
            obj.push(str)
        }

        return obj
    }

}

export {
    GetDomOxfordPage
};