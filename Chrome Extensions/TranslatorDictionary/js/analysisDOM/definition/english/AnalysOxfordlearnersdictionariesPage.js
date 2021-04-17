import {
    standardStr,
    replaceTagHTMLByString,
    getValueOnAttr,
    WORDTYPELIST
}
from '../../Helper.js';

import {
    OXFORD_DICT_URL
} from '../../../api/Helper.js';


import {
    AbstractDefinitionWord
} from '../AbstractDefinitionWord.js';


class GetDomOxfordPage extends AbstractDefinitionWord {

    //private properties
    #dom;
    #domEntryDefinitionRange

    constructor(dom) {
        super();
        this.#dom = dom[0] || document.body.appendChild(document.createElement("BODY"))
        this.#domEntryDefinitionRange = 
        this.#dom.getElementsByClassName("oald")[0] //|| this.#dom.getElementById("entryContent")
    }

    checkWordIsCorrect = () => {
        this.#domEntryDefinitionRange.getElementsByClassName("definition-title")[0]
    }

    getReferenceLink = () => {
        return OXFORD_DICT_URL + "/" + "definition/english/" + this.getWord();
    }

    getWord = () => this.#domEntryDefinitionRange.getElementsByClassName("headword")[0] &&
                this.#domEntryDefinitionRange.getElementsByClassName("headword")[0].innerHTML

    getTypeWord = () => {
        let content =this.#domEntryDefinitionRange.getElementsByClassName("pos")[0].innerHTML || '';
        return replaceTagHTMLByString(content, '');
    }

    getPronoundAndSound = () => {
        let container = this.#domEntryDefinitionRange.getElementsByClassName("phonetics")[0],
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
        let containerM = this.#domEntryDefinitionRange.getElementsByClassName("senses_multiple")[0];
        let containerS = this.#domEntryDefinitionRange.getElementsByClassName("sense_single")[0];
        let obj = []
        let desList = []

        if (containerM) {
            desList = containerM.getElementsByClassName("def");
        } else
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

    /**
     * Return url and type of this word
     * [data, url, data type]
     */
    getRelateWords(){
        const correctWord = this.getWord();
        let relateWordIdDomWrap = this.#dom.getElementsByClassName("responsive_entry_center_right")[0];
        if(!relateWordIdDomWrap){
            return []
        }
        let relateWordIdDom = relateWordIdDomWrap.getElementsByClassName("responsive_row")[0]
        
        if(relateWordIdDom == null){
            return []
        }else{
            let res = []
            let relateWords = relateWordIdDom.getElementsByClassName("list-col")[0];
            let listRelateWord = relateWords.getElementsByTagName("a");
            for(const aTag of listRelateWord){
                // ex: <span class="arl1">source <pos-g hclass="pos" htag="span"><pos>verb</pos></pos-g></span>
                let span = aTag.getElementsByTagName("span")[0]
                let pos = span && span.getElementsByTagName("pos")[0]
                let spanValue = (span && span.innerHTML.match(/[\w\s_\-]*/)[0]) || ""
                if(pos && spanValue.trim().toLowerCase() === correctWord.trim().toLowerCase()
                  && this.getTypeWord().trim().toLowerCase() != pos.innerHTML.trim().toLowerCase()){
                    res.push([spanValue, aTag.href, pos.innerHTML])
                }
            }

            return res
        }
    }

    /**
     * Return:
     * [data, url, data type] ex: ["source", 
     * https://www.oxfordlearnersdictionaries.com/definition/english/source_2",
     * "noun"]
     */
    getNearByWords(){
        let nearbyWordDom = this.#dom.getElementsByClassName("responsive_row nearby")[0];

        if(!nearbyWordDom){
            return []
        }else{
            let res = []
            let relateWord = nearbyWordDom.getElementsByClassName("list-col")[0];
            let listRelateWord = relateWord.getElementsByTagName("a");
            for(const aTag of listRelateWord){
                let dataTag = aTag.getElementsByClassName("hwd")[0]
                let pos = dataTag && dataTag.getElementsByTagName("pos")[0]
                let dataValue = (dataTag && dataTag.innerHTML.match(/[\w\s_\-]*/)[0]) || ""
                res.push([(dataValue && dataValue.trim()) || "", aTag.href, pos ? pos.innerHTML : ""])
            }

            return res
        }

    }

}

export {
    GetDomOxfordPage
};