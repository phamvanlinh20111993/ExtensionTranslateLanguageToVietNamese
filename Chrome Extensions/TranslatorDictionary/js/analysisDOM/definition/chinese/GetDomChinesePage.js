
import {
    AbstractDefinitionWord
} from '../AbstractDefinitionWord.js';

// TODO implement new language
class GetDomChinesePage extends AbstractDefinitionWord {

    //private properties
    #dom;

    constructor(dom) {
        super();
        this.#dom = dom || document.body.appendChild(document.createElement("BODY"))
    }

    checkWordIsCorrect = () => {
     
    }

    getReferenceLink = () => {
        return "";
    }

    getWord = () => true

    getTypeWord = () => {
       
    }

    getPronoundAndSound = () => {
      return []
    }

    getDescriber = () => {
      return []
    }

}

export {
    GetDomChinesePage
};