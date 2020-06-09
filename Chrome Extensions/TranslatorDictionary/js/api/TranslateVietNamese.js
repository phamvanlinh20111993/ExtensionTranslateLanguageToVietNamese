import {
    requestUrl
} from './Helper.js';

function getTranslateInLabanPage(requestData) {
    const LABAN_URL = "https://dict.laban.vn";

    return new Promise(resolve => {
        requestUrl({
            url: LABAN_URL,
            params: [{
                value: 'find',
                type: 'String'
            }],
            query: {
                type: 1,
                query: requestData.value
            },
            requestType: "GET",
            data: {},
            formatResponse: {
                type: 'Dom',
                format: 'text/html',
                elementType: {
                    type: 'id',
                    value: 'slide_show'
                }
            }
        }, (r, e) => {
            resolve({
                result: r,
                err: e
            })
        })
    })
}


/*  
  // preparatory for laban
  requestUrl({
    url: 'http://tratu.coviet.vn',
    params: [{ value: 'hoc-tieng-anh'}, { value: 'tu-dien' },
             { value: 'lac-viet' }, { value: 'A-V/'}],
    anotherFormat: `${request.value}.html`, 
    requestType: "GET",
    data: {},
    formatResponse: {
      type: 'Dom',
      format: 'text/html',
      elementType: {
        type: 'id',
        value: 'ctl00_ContentPlaceHolderMain_ctl00'
      }
    }
  }, (result, err) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      const analysLacVietDom = new analysLacViet.GetDomLacVietPage(result);
      console.log('analysLacVietDom doc', analysLacVietDom.getWord())
      console.log('analysLacVietDom doc1', analysLacVietDom.getPronoundAndSound())
      console.log('analysLacVietDom doc2', analysLacVietDom.getTranslateDes())
    }
  }); */

function getTranslateLacVietPage(request) {
    const LACVIET_URL = "http://tratu.coviet.vn";

    return new Promise(resolve => {

        // preparatory for laban
        requestUrl({
            url: LACVIET_URL,
            params: [{
                    value: 'hoc-tieng-anh'
                }, {
                    value: 'tu-dien'
                },
                {
                    value: 'lac-viet'
                }, {
                    value: 'A-V/'
                }
            ],
            anotherFormat: `${request.value}.html`,
            requestType: "GET",
            data: {},
            formatResponse: {
                type: 'Dom',
                format: 'text/html',
                elementType: {
                    type: 'id',
                    value: 'ctl00_ContentPlaceHolderMain_ctl00'
                }
            }
        }, (result, err) => {
            resolve({
                result,
                err
            })
        });
    })
}

export {
    getTranslateInLabanPage,
    getTranslateLacVietPage
}