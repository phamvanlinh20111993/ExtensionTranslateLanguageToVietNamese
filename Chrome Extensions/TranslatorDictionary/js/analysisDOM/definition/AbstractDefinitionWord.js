import {
    AbstractWord
} from '../AbstractWord.js'

class AbstractDefinitionWord extends AbstractWord {

    constructor() {
        super();
        if (new.target === AbstractDefinitionWord) {
            throw new TypeError("Cannot construct AbstractDefinitionWord instances directly");
        }
    }

    checkWordIsCorrect() {
        throw new Error('You have to implement checkWordIsCorrect() overrided method ');
    }

    getWord() {
        throw new Error('You have to implement getWord() method ');
    }

    checkWordIsCorrect() {
        throw new Error('You have to implement checkWordIsCorrect() overrided method ');
    }

    getTypeWord() {
        throw new Error('You have to implement getTypeWord() method');
    }

    getPronoundAndSound() {
        throw new Error('You have to implement getPronoundAndSound() method');
    }

    getDescriber() {
        throw new Error('You have to implement getDescriber() method');
    }
}

export {
    AbstractDefinitionWord
}