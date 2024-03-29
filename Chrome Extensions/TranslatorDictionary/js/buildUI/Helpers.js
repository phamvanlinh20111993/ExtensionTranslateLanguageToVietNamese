

import { SPACE_CHARACTER, STRING_EMPTY } from "../Helper.js";

const IGNORETAGS = ["INPUT", "TEXTAREA", "BUTTON"];

const WORDTYPELIST = {
    'adjective': 'adj',
    'abbreviation': 'abbv',
    'noun': 'n',
    'verb': 'v',
    'adverb': 'adv',
    'exclamation': 'exc',
    'pronoun': 'pro',
    'indefinite article': 'ind art',
    'article': 'art',
    'determiner': 'deter',
    'preposition': 'pre',
    'conjunction': 'conj',

    'danh từ': 'n',
    'viết tắt': 'abbv',
    'tính từ': 'adj',
    'trạng từ': 'adv',
    'mạo từ': 'art',
    'mạo từ bất định': 'ind art',
    'đại từ': 'pronoun',
    'động từ': 'v',
    'cảm thán': 'exc',
    'hạn định': 'deter',
    'liên từ': 'conj',
    'giới từ': 'pre'
};

const TEXT_INFORMATION = "TEXT_INFORMATION";

const URL_TEXT = "URL_TEXT";

const PARAGRAPH_INFORMATION = "PARAGRAPH_INFORMATION";

const MAX_TEXT = 5000;

const CHECK_LANGUAGE = "CHECK_LANGUAGE";

const TRANS_TEXT = "TRANS_TEXT";

const GOOGLE_TRANSLATE_URL = "https://translate.google.com/";

const FORM_POST_SUBMIT_FILE= 'http://localhost:5555/translator-extension/translate/image/file';

const FOOTER_NAME = "© 2020 LinhPhamVan - Translator Extension";

// const VIETNAMESE_CHARACTERS = `ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯ
//                               ĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊ
//                               ỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ`;

const UNICODE_CHARARACTERS = /[\p{L}\p{N}]+/gu
const CAPITAL_LETTERS = ['.', '!', '?', ':']
const SPACE_WORD_CHARARACTERS = CAPITAL_LETTERS.concat([',', ''])

function matchWord(text) {
    text = text ? text.trim() : false
    return text && text.length > 0 &&
        text.split(/\s+/).length === 1
}

function matchParagraph(text) {
    text = text ? text.trim() : false
    return text && text.length > 0 &&
        text.split(/\s+/).length > 1
}

function matchString(str) {
    str = str ? str.trim() : false
    return str && str.length > 0 && str.split(/\s+/).length > 0 &&
        str.match(/[\{\$@&#\}`~]+/) == null
        // not html tag
        &&
        !(/<\/?[a-z][\s\S]*>/i.test(str));
}

function formatText(text) {
    return text && text.length > 0 && text.split(/\s+/).join(" ").trim();
}

function checkURLImage(url) {
    return url && url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

function checkVietNameseChar(text) {
    return /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/.test(text);
}

function isNull(data) {
    return data === null || data === undefined;
}

function isStringEmpty(data) {
    return !isNull(data) && data === ""
}

function isEmpty(data) {
    if (isNull(data)) return false;

    if (typeof data === "string") {
        return data === STRING_EMPTY;
    }

    if (typeof data === "function") {
        return false;
    }

    if (typeof data === "object") {
        if (Array.isArray(data)) {
            return data.length == 0
        } else {
            for (const prop in data) {
                if (object.hasOwnProperty(prop)) {
                    return false;
                }
            }
            return true;
        }
    } else {
        return false;
    }
}


function standardizeString(string) {
    if (isNull(string)) return STRING_EMPTY;

    string = string.trim();
    string = string.split(/\s+/);
    string = string.join(SPACE_CHARACTER)

    let res = ""
    for (const ch of string) {

    }

    return string;
}

function removeWindowSelectionText() {
    return window.getSelection
        // Chrome
        &&
        ((window.getSelection().empty && window.getSelection().empty())
            // Firefox
            ||
            (window.getSelection().removeAllRanges && window.getSelection().removeAllRanges())
            // IE
            ||
            (document.selection && document.selection.empty()));
}

function getOffsetDimension(e) {
    const rect = e.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        right: rect.right + window.scrollX,
        bottom: rect.bottom + window.scrollY,
        leftViewPort: rect.left,
        topViewPort: rect.top,
        rightViewPort: rect.right,
        bottomViewPort: rect.bottom,
    };
}


function preventClickInSideContentRange(id, e) {

    if ($(`#${id}`) && $(`#${id}`).length > 0) {
        //click inside popup do nothing
        let insidePopup = $(e.target).parents($(`#${id}`))
        if (e.target.id == id ||
            (insidePopup && insidePopup.length > 0 && insidePopup[0].id == id)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            return true;
        }
        $(`#${id}`).remove();
    }

    return false;
}

/**
 * if word has no any special in range (1, word.length-2)
 * check character is special: 
 * https://stackoverflow.com/questions/32311081/check-for-special-characters-in-string
 * //TODO advance
 */
function isValidWord(string) {
    if (matchWord(string)) {
        let childStr = string.length > 2 ? string.substring(1, string.length - 2) : ""
        return childStr.match(/\\\/\.,\"\';:>|~`<_\?!@#\$%\=+-\{\}^&*\(\)/) == null
    }
    return false;
}

function isValidParagraph(string) {
    if (matchParagraph(string)) {
        let paragraph = string.split(/\s+/);
        for (const word of paragraph) {
            if (!isValidWord(word))
                return false;
        }
        return true
    }

    return false;
}

export {
    IGNORETAGS,
    WORDTYPELIST,
    TEXT_INFORMATION,
    PARAGRAPH_INFORMATION,
    MAX_TEXT,
    CHECK_LANGUAGE,
    TRANS_TEXT,
    GOOGLE_TRANSLATE_URL,
    FOOTER_NAME,
    FORM_POST_SUBMIT_FILE,
    URL_TEXT,
    isNull,
    isStringEmpty,
    isEmpty,
    matchWord,
    formatText,
    matchString,
    checkURLImage,
    removeWindowSelectionText,
    getOffsetDimension,
    preventClickInSideContentRange,
    checkVietNameseChar,
    isValidWord,
    isValidParagraph,
    matchParagraph,
    standardizeString
}