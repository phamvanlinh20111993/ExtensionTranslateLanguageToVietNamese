

import {
    AbstractWord
} from '../AbstractWord.js'

class AbstractTranslateWord extends AbstractWord{
    
    constructor() {
        super();
        if (new.target === AbstractTranslateWord) {
          throw new TypeError("Cannot construct AbstractTranslateWord instances directly");
        }
    }

    checkWordIsCorrect(){
        throw new Error('You have to implement checkWordIsCorrect() override method ');
    }

    getWord(){
        throw new Error('You have to implement getWord() method ');
    }

    getPronoundAndSound(){
        throw new Error('You have to implement getPronoundAndSound() method ');
    }

    getTranslateDes(){
        throw new Error('You have to implement getTranslateDes() method');
    }
}

export{
    AbstractTranslateWord
}