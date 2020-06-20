import {
    getOffsetDimension
} from '../Helpers.js';

function calPositionShowPopup(e) {
    const isSelectText = window.getSelection && window.getSelection();
    const VIEWPORT_HEIGHT = $(window).height();
    const VIEWPORT_WIDTH = $(window).width();
    if (isSelectText && isSelectText.rangeCount > 0) {
        let coordSelectedText = getOffsetDimension(window.getSelection().getRangeAt(0));
        let widthPopup = $('#loading-icon-translate').outerWidth()
        let heightPopup = $('#loading-icon-translate').outerHeight()
        let positionX = coordSelectedText.left + parseInt((coordSelectedText.right - coordSelectedText.left) / 2) - parseInt(widthPopup / 2)
        let positionY = coordSelectedText.bottom + 2;
        //check left corner
        if (coordSelectedText.left < widthPopup / 2) {
            positionX = coordSelectedText.left + parseInt((coordSelectedText.right - coordSelectedText.left) / 2)
        }
        //check right corner
        if (VIEWPORT_WIDTH - coordSelectedText.right < widthPopup / 2) {
            positionX = coordSelectedText.left + parseInt((coordSelectedText.right - coordSelectedText.left) / 2) - widthPopup
        }
        //check bottom corner
        if (coordSelectedText.topViewPort > VIEWPORT_HEIGHT - coordSelectedText.bottomViewPort) {
            positionY = coordSelectedText.top - heightPopup - 3
        }

        $('#loading-icon-translate').css({
            left: positionX,
            top: positionY
        });
    } else {
        $('#loading-icon-translate').css({
            left: e.pageX,
            top: e.pageY
        });
    }
}

function showIconTranslate(e, callback) {

    e.preventDefault();
    e.stopPropagation();

    var element = document.getElementById('loading-icon-translate');
    if (element) {
        element.remove();
    }

    $('body').append('<div id="loading-icon-translate"></div>');
    $('#loading-icon-translate').addClass('popup-trans');
    $('#loading-icon-translate').css({
        position: 'absolute',
        width: '30px',
        height: '30px',
        background: 'white',
        border: '1px solid rgba(0,0,0,.2)',
        borderRadius: '6px',
        boxShadow: '0 5px 15px rgba(0,0,0,.5)',
        zIndex: 9999
    });

    const shadowDOM = '<div id = "icon-translate-loading"></div>';
    $('#loading-icon-translate').append(shadowDOM)

    const shadow = document.querySelector('#icon-translate-loading').attachShadow({
        mode: 'open'
    });

    const urlImage = chrome.extension.getURL("/assets/translate-icon.jpg");
    const urlCssContent = chrome.extension.getURL("/css/icon-translate.css");

    const importCss = `<style>
                            @import "${urlCssContent}";
                        </style>`;

    const content = `<div class="icon-content">
                        <img src="${urlImage}" class = "img-responsive" 
                            alt="icon not found..."  width="30" height="30"/>
                    </div>`;

    shadow.innerHTML = `${importCss}${content}`;
    setTimeout(() => calPositionShowPopup(e), 0)

    const listenEvent = document.querySelector('#icon-translate-loading');
    listenEvent && listenEvent.addEventListener('click', function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        callback('start')
    });

}

export {
    showIconTranslate
}