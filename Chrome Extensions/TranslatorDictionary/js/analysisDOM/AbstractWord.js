class AbstractWord{
    
    constructor() {
        if (new.target === AbstractWord) {
          throw new TypeError("Cannot construct AbstractWord instances directly");
        }
    }

    checkWordIsCorrect(){
        throw new Error('You have to implement checkWordIsCorrect() method ');
    }
}

export{
    AbstractWord
}