function standardStr(str) {
    str = decodeHtmlEntities(str || '');
    return str && str.trim().replace(/\s{2,}/g, ' ') || '';
}

function replaceTagHTMLByString(html, str) {
    return standardStr(html.replace(/<\/?\w+(?:\s*[a-zA-Z0-9._*: +!,?\-/\"\'#=;$%^&~`|()]+)?>/g, str));
}

function getValueOnAttr(dom, attr) {
    return dom && standardStr(dom.getAttribute(attr + '')) || '';
}

//protocol://domainOrIPAddress:port/path/filename
function getUrlInText(txt) {
    let protocol = "[A-Za-z]+:(?:\/){0,3}",
        domain = "(?:(?:[a-zA-Z0-9@_-]+\\.)+[a-zA-Z0-9@_-]+)(?:\\/)?",
        ip = "(?:(?:(?:\\d{0,2}|1\\d{2}|2[0-5][0-5])\\.){3}(?:\\d{0,2}|1\\d{2}|2[0-5][0-5]))",
        domainOrIp = "(?:" + domain + "|" + ip + ")(?::\d+)?",
        path = "(?:[a-zA-Z0-9_-]+\\/)*",
        filename = "(?:[a-zA-Z0-9_-]+(?:\\.\\w+)?)?",
        regex = new RegExp(`${protocol}${domainOrIp}${path}${filename}`);

    return txt.match(regex)[0] || txt;
}

function checkVietNameseChar(text) {
    return (/[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/.test(text));
}

//https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
/**
 * <h2 class="fl">
 *      compile 
 *      <span class="color-black">/kəm'pail/</span>
 *      &nbsp;&nbsp;
 *      <span class="color-orange">
 *      </span>
 *  </h2>
 * 
 * just get 'compile' text 
 */
function getOnLyValueInTag(tag) {
    // my idea
    // let listChild = tag.childNodes;
    // for(let e of listChild){
    //     if(e.nodeType  !== 3){// is not text node
    //         tag.removeChild(e);
    //     }
    // }
    while (tag.firstElementChild) {
        tag.removeChild(tag.lastElementChild);
    }
    return standardStr(decodeHtmlEntities(tag.innerHTML));
}

//https://stackoverflow.com/questions/5796718/html-entity-decode
function decodeHtmlEntities(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function checkPluralEnglish(text) {
    //check nound end with es
    let value = text.toLowerCase().match(/^\s+(\w+)(?:sh|ch|s|x|z)es\s+$/)[1];
    //check s plural
    return value || text;
}

export {
    standardStr,
    replaceTagHTMLByString,
    getValueOnAttr,
    getUrlInText,
    checkVietNameseChar,
    getOnLyValueInTag,
    decodeHtmlEntities,
    checkPluralEnglish
};