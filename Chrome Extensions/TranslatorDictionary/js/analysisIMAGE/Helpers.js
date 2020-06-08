const UNICODE_CHARARACTERS = /[\p{L}\p{N}]+/gu

const CAPITAL_LETTERS = ['.', '!', '?', ':']

const SPACE_WORD_CHARARACTERS = CAPITAL_LETTERS.concat([',', ''])

const MULTI_LANGUAGE_TESSERACT = `afr+ara+aze+bel+ben+bul+cat+ces+chi_sim
+chi_tra+chr+dan+deu+ell+eng+enm+epo+est+eus+fin+fra+frk+frm+glg+grc+heb+hin+hrv+hun+ind
+isl+ita+ita_old+jpn+kan+kor+lav+lit+mal+mkd+mlt+msa+nld+nor+pol+por+ron+rus+slk+slv+spa+spa_old+sqi+srp+swa+swe+tam+tel+tgl+tha+tur+ukr+vie`;

export{
    MULTI_LANGUAGE_TESSERACT
}