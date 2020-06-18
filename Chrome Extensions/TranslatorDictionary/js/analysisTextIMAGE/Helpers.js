import {
    SPACE_CHARACTER,
    STRING_EMPTY
} from '../Helper.js';

const CAPITAL_LETTERS = ['.', '!', '?', ':']

const SPACE_WORD_CHARARACTERS = CAPITAL_LETTERS.concat([',', ';'])

const MULTI_LANGUAGE_TESSERACT = `afr+ara+aze+bel+ben+bul+cat+ces+chi_sim
+chi_tra+chr+dan+deu+ell+eng+enm+epo+est+eus+fin+fra+frk+frm+glg+grc+heb+hin+hrv+hun+ind
+isl+ita+ita_old+jpn+kan+kor+lav+lit+mal+mkd+mlt+msa+nld+nor+pol+por+ron+rus+slk+slv+spa+spa_old+sqi+srp+swa+swe+tam+tel+tgl+tha+tur+ukr+vie`;

// can be use another solution by using map
function ignoreAllOpenCloseCharacter(text) {

    const COUPLE_OPEN_CHARACTER = ['\'', '\"', '(', '{', '[', '`']

    const COUPLE_CLOSE_CHARACTER = ['\'', '\"', ')', '}', ']', '`']

    const ignoreAOpenCloseCharacter = function (openChar, closeChar) {
        let stack = [],
            invalidOpenCloseStack = []
        for (let index = 0; index < text.length; index++) {
            if (text[index] == openChar) {
                stack.push(index)
            } else if (text[index] == closeChar) {
                if (stack.length == 0) {
                    invalidOpenCloseStack.push(index)
                } else {
                    stack.pop()
                }
            }
        }

        let map = {}
        stack = stack.concat(invalidOpenCloseStack);
        for (let index = 0; index < stack.length; index++) {
            map[stack[index]] = 1;
        }

        let textIgnore = STRING_EMPTY;
        for (let index = 0; index < text.length; index++) {
            if (map[index]) {
                textIgnore += SPACE_CHARACTER;
            } else {
                textIgnore += text[index];
            }
        }

        return textIgnore;
    }

    const COUPLE_OPEN_CLOSE_SPECIAL_CHARACTER = ['\'', '\"', '`'];

    const ignoreAOpenCloseSpecialCharacter = function (openCloseChar) {
        let stack = [];
        for (let index = 0; index < text.length; index++) {
            if (text[index] == openCloseChar) stack.push(index)
        }

        let stackLength = stack.length;
        if (stackLength % 2 != 0) {
            let textIgnore = STRING_EMPTY
            for (let index = 0; index < text.length; index++) {
                if (stack[stackLength - 1] == index) {
                    textIgnore += SPACE_CHARACTER;
                } else {
                    textIgnore += text[index];
                }
            }
            return textIgnore;
        }

        return text;
    }

    for (let index = 0; index < COUPLE_OPEN_CHARACTER.length; index++) {
        text = ignoreAOpenCloseCharacter(COUPLE_OPEN_CHARACTER[index], COUPLE_CLOSE_CHARACTER[index]);
    }

    for (let index = 0; index < COUPLE_OPEN_CLOSE_SPECIAL_CHARACTER.length; index++) {
        text = ignoreAOpenCloseSpecialCharacter(COUPLE_OPEN_CLOSE_SPECIAL_CHARACTER[index]);
    }

    return text.replace(/\s+/g, SPACE_CHARACTER).trim();
}

function ignoreAllPunctuationLetter(text) {
    const UNICODE_CHARARACTERS = /[^\p{L}\p{N}!@#$%^&*()+=-\[\]\\\\';,.\/{}|\\":<>\?~]+/gu
    return text.replace(UNICODE_CHARARACTERS, SPACE_CHARACTER);
}

function capitalLetter(text) {
    text = text.replace(/\s+/g, SPACE_CHARACTER).trim();

    let textCapital = text[0].toUpperCase();
    for (let index = 1; index < text.length;) {
        textCapital += text[index];
        if (index + 2 < text.length &&
            text[index + 1] == SPACE_CHARACTER &&
            CAPITAL_LETTERS.includes(text[index])) {
            textCapital += text[index + 1];
            textCapital += text[index + 2].toUpperCase();
            index += 2;
        } else if (index + 1 < text.length && CAPITAL_LETTERS.includes(text[index])) {
            textCapital += text[index + 1].toUpperCase();
            index++;
        }
        index++;
    }

    return textCapital;
}

function addSpaceCharWithSomeSpecialChar(text) {
    const regex = new RegExp('([' + SPACE_WORD_CHARARACTERS.join('') + ']+)', 'g');

    text = text.replace(regex, "$1" + SPACE_CHARACTER);
    text = text.replace(/\s+/g, SPACE_CHARACTER).trim();

    return text;
}

function calculateImageSize({
    height,
    width
}) {
    const MAX_WIDTH = 360;
    const MAX_HEIGHT = 550;

    height = height == 0 ? 1 : height;
    width = height == 0 ? 1 : width;

      const minRatio = Math.min(MAX_HEIGHT/height, MAX_WIDTH/ width)

    return {
        height: parseInt(minRatio * height),
        width: parseInt(minRatio * width)
    }
}

export {
    MULTI_LANGUAGE_TESSERACT,
    ignoreAllOpenCloseCharacter,
    ignoreAllPunctuationLetter,
    capitalLetter,
    addSpaceCharWithSomeSpecialChar,
    calculateImageSize
}