class AbstractFunctionTrans{
    constructor() {
        if (new.target === AbstractFunctionTrans) {
          throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    _getPronunciation(){
        throw new Error('You have to implement this method ');
    }

    _getSound(){
        throw new Error('You have to implement this method');
    }

    _getDefinition(){
        throw new Error('You have to implement this method');
    }

    _getType(){
        throw new Error('You have to implement this method');
    }

    _getTranslates(){
        throw new Error('You have to implement this method');
    }
}