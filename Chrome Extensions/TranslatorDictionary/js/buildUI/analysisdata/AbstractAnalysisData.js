
class AbstractAnalysisData {

    constructor(){
        if (new.target === AbstractAnalysisData) {
            throw new TypeError("Cannot construct AbstractAnalysisData instances directly");
        }
    }
    
    isWord(){
        throw new Error('You have to implement isWord() overrided method ');
    }

    isParagraph(){
        throw new Error('You have to implement isParagraph() overrided method ');
    }

    getResponseData(){
        throw new Error('You have to implement getResponseData() overrided method ');
    }

    getResponseDataFromUrl(){
        throw new Error('You have to implement getResponseDataFromUrl() overrided method ');
    }
}

export{
    AbstractAnalysisData
}