/**
    * format getDataResponse() argument
    * {
        highlightedText,
        typeText: 'noun',
        des: ['hello exclamation', 'from the Oxford Advanced Learner'],
        pro: [{ type: 'bre', pro: '/həˈləʊ/', url: '' },
                { type: 'nAmE', pro: '/həˈləʊ/', url: '' }],
        trans: [{ type: 'danh từ', mean: ['cân nặng', 'con vật'] },
                { type: 'động từ', mean: ['chiều cao', 'cái con ấy nhé', 'con chó màu vàng']}]
    *  }
**/

import {
    ENGLISH_TYPE,
    VIETNAMESE_TYPE
} from '../../Helper.js';

import {
    getDefintionInOxfordPage,
    getDefintionInOxfordPageByUrl
} from '../../api/DefinitionEnglish.js';

import {
    connectGoogleAPI
} from '../../api/ConnectGoogleAPI.js';

import {
    getTranslateInLabanPage,
    getTranslateLacVietPage
} from '../../api/TranslateVietNamese.js';

import {
    GetDomOxfordPage
} from '../../analysisDOM/definition/english/AnalysOxfordlearnersdictionariesPage.js';

import {
    GetDomDictLabanPage
} from '../../analysisDOM/translate/English-VietNamese/AnalysLaBanPage.js';

import {
    GetDomLacVietPage
} from '../../analysisDOM/translate/English-VietNamese/AnalysLacvietPage.js';

// to do: advance
function formatDataResponse(textTranslate, originType, targetType) {
    let response = {
        highlightedText: textTranslate,
        typeText: null,
        des: [],
        pro: [],
        trans: [],
        referenceLink: "",
        transReferenceLink: ""
    }

    return response;
}

async function getTranslateResponse(textTranslate) {
    //get translate word
    let translate = await getTranslateInLabanPage({
        value: textTranslate
    });

    let analysVietNameseDOM;
    if (translate.err) {
        console.error('Error getTranslateResponse(): ', err)
        translate = await getTranslateLacVietPage({
            value: textTranslate
        });
        analysVietNameseDOM = new GetDomLacVietPage(translate.result, textTranslate)
    } else {
        analysVietNameseDOM = new GetDomDictLabanPage(translate.result, textTranslate)
    }

    if (analysVietNameseDOM && !analysVietNameseDOM.checkWordIsCorrect()) {
        analysVietNameseDOM = null;
    }

    return analysVietNameseDOM;
}

async function getDefinitionResponse(textTranslate, originType) {
    //get definition in english this word
    let definition = null;
    let analysOxfordDOM;

    if (originType === ENGLISH_TYPE) {
        definition = await getDefintionInOxfordPage({
            value: textTranslate
        })

        if (definition.err) {
            // try with text add keyword _1 or _2
            // definition = await getDefintionInOxfordPage({
            //     value: textTranslate + "_1"
            // });
            definition = null;
            // To do need analysis another page
        } else {
            analysOxfordDOM = new GetDomOxfordPage(definition.result);
        }

        // analysOxfordDOM.checkWordIsCorrect() mean that that word is not has defintition
        if (analysOxfordDOM && analysOxfordDOM.checkWordIsCorrect()) {
            analysOxfordDOM = null;
        }
    }

    return analysOxfordDOM;
}

async function getDefinitionUrlResponse(url) {
    let definition = await getDefintionInOxfordPageByUrl(url)
    let analysOxfordDOM = new GetDomOxfordPage(definition.result);
    // analysOxfordDOM.checkWordIsCorrect() mean that that word is not has defintition
    if (analysOxfordDOM && analysOxfordDOM.checkWordIsCorrect()) {
        analysOxfordDOM = null;
    }
    return analysOxfordDOM;
}

async function formatWordResponseWithOutTranslate(url){
    let response = {}
    //get definition in english this word
    const analysOxfordDOM = await getDefinitionUrlResponse(url);
    if (analysOxfordDOM) {
        response.typeText = analysOxfordDOM.getTypeWord();
        response.des = analysOxfordDOM.getDescriber();
        response.pro = analysOxfordDOM.getPronoundAndSound();
        response.referenceLink = analysOxfordDOM.getReferenceLink();
        response.relateWords = analysOxfordDOM.getRelateWords();
        response.nearlyWords = analysOxfordDOM.getNearByWords();
    } else {
        response.des = [];
    }

    return response
}

// auto translate to vietnamese
async function formatWordResponse(textTranslate, originType) {
    let response = {
        highlightedText: textTranslate
    }
    //get definition in english this word
    const analysOxfordDOM = await getDefinitionResponse(textTranslate, originType);
    const analysVietNameseDOM = await getTranslateResponse(textTranslate);

    if (analysOxfordDOM) {
        response.typeText = analysOxfordDOM.getTypeWord();
        response.des = analysOxfordDOM.getDescriber();
        response.pro = analysOxfordDOM.getPronoundAndSound();
        response.referenceLink = analysOxfordDOM.getReferenceLink();
        response.relateWords = analysOxfordDOM.getRelateWords();
        response.nearlyWords = analysOxfordDOM.getNearByWords();
    } else {
        response.des = [];
        response.referenceLink = GetDomOxfordPage.getDefaultPageLink() + textTranslate
    }

    if (analysVietNameseDOM) {
        response.trans = analysVietNameseDOM.getTranslateDes();
        response.transReferenceLink = analysVietNameseDOM.getReferenceLink();
        if (response.trans && typeof response.trans[0] === 'object') {
            response.typeText = !response.typeText ? analysVietNameseDOM.getTranslateDes()[0].type : response.typeText;
        }
        if(!response.pro){
            response.pro = await analysVietNameseDOM.getPronoundAndSound();
        }
    } else {
        response = null;
    }

    console.info('Response from formatDataResponse(): ', response)
    return response;
}

async function formatTextResponse(textTranslate, originType) {
    return await connectGoogleAPI({
        value: textTranslate,
        originType
    });
}

export {
    formatWordResponse,
    formatTextResponse,
    formatWordResponseWithOutTranslate
}