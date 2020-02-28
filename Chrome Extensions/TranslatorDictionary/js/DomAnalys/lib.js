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

function requestUrl(setting, callback) {

  if (setting.params) {
    setting.url += "/"
    for (const e of setting.params) {
      if (e.type === 'Number') {
        setting.url += parseInt(e.value)
      } else {
        setting.url += e.value + ''
      }
      setting.url += "/"
    }
    setting.url = setting.url.substr(0, setting.url.length - 1);
  }

  if (setting.query) {
    setting.url += "?"
    Object.keys(setting.query).map(key => {
      setting.url += `${key}=${setting.query[key]}&`
    });
    setting.url = setting.url.substr(0, setting.url.length - 1);
  }

  if (setting.anotherFormat) {
    setting.url += setting.anotherFormat
  }

  let headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Max-Age': 60,
    'Access-Control-Allow-Credentials': true
  }
  if (setting.headers) {
    Object.keys(setting.headers).map(key => {
      headers[key + ''] = setting.headers[key]
    });
  }

 //

  $.ajax({
    url: setting.url,
    headers: xhr => {
      Object.keys(headers).map(key => {
        xhr.setRequestHeader(key, headers[key]);
      })
    },
    data: setting.data || {},
    type: setting.requestType,
    success: result => {

      if (setting.formatReponse) {
        if (setting.formatReponse.type === 'Json') {
          if (typeof result === 'Object') {
            try {
              callback(JSON.parse(result), null)
            } catch (e) {
              callback(result, {
                readyState: 0, status: 0, statusText: '',
                error: `Error ${e} when parse to Json `
              })
            }
          } else {
            callback(result, {
              readyState: 0, status: 0, statusText: '',
              error: `Error parse ${typeof result} to Json`
            })
          }
        } else if (setting.formatReponse.type === 'Object') {
          if (typeof result !== 'Object') {
            try {
              callback(JSON.parse(result), null)
            } catch (e) {
              callback(result, {
                readyState: 0, status: 0, statusText: '',
                error: `Error parse ${typeof result} to Object and ${e}`
              })
            }
          } else {
            callback(result, {
              readyState: 0, status: 0, statusText: '',
              error: `Error ${e} when parse to Object`
            })
          }
        } else if (setting.formatReponse.type === 'Dom') {
          try {
            let doc = new DOMParser().parseFromString(result, setting.formatReponse.format);
            console.log('doc', doc, setting.url)
            if (setting.formatReponse.elementType) {
              if (setting.formatReponse.elementType.type == 'id') {
                doc = doc.getElementById(setting.formatReponse.elementType.value + '');
              } else if (setting.formatReponse.elementType.type == 'class') {
                doc = doc.getElementsByClassName(setting.formatReponse.elementType.value + '');
              } else if (setting.formatReponse.elementType.type == 'tag') {
                doc = doc.getElementsByTagName(setting.formatReponse.elementType.value + '');
              } else {
                doc = doc.querySelectorAll(setting.formatReponse.elementType.value + '');
              }
              callback(doc, null)
            } else {
              callback(result, null)
            }
          } catch (e) {
            callback(result, {
              readyState: 0, status: 0, statusText: '',
              error: `Error parse ${typeof result} to Dom: ${setting.formatReponse.format} and ${e}`
            })
          }
        }
      } else {
        callback(result, null)
      }
    },
    error: e => {
      callback(null, { readyState: e.readyState, status: e.status, statusText: e.statusText, error: '' })
    }
  });
}

export {
  standardStr,
  replaceTagHTMLByString,
  getValueOnAttr,
  getUrlInText,
  checkVietNameseChar,
  getOnLyValueInTag,
  decodeHtmlEntities,
  requestUrl,
  checkPluralEnglish
};