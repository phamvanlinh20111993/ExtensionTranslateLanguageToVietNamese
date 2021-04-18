import {
    AbstractBuildContentUI
} from '../AbstractBuildContentUI.js';

class BuildPopupUI extends AbstractBuildContentUI {

    constructor() {
        super();
    }

    #translateText = obj => {
        let content = ``
        for (const data of obj.trans) {
            content += `<div><label for="email">
                                <span class="glyphicon glyphicon-tag"></span>&nbsp;
                                ${data.type}
                            </label>
                        <div class="container">`
            for (const e of data.mean) {
                content += `<p><span class="glyphicon glyphicon-arrow-right"></span>
                            &nbsp;${e}</p>`
            }
            content += `</div></div>`
        }

        return `<div>${content}</div>`;
    }

    #pronunciationText = obj => {
        let content = ``,
            index = 0,
            speakerNone = `<span class="glyphicon glyphicon-volume-off"
        style="cursor: pointer; font-size: 18px;top: 3px;></span>`;

        const speaker = index => `<span class="glyphicon glyphicon-bullhorn" id="speak-${index}"
                                  style="cursor: pointer;top: 3px;"></span>`

        for (const e of obj.pro) {
            content += `<p style='font-size: 16px;'>
                      &nbsp;
                      ${e.url && e.url.trim() != "" ? speaker(index) : speakerNone}
                      <i style="font-size:14px;"> (${e.type})</i>
                      <input type="hidden" value = "${e.url}" id="url-${index++}">
                      ${e.pro}
                    </p>`
        }
        return `<div style="">
                  ${content}
                </div>`
    }

    #descriptionText = obj => {
        let content = ``
        for (const e of obj.des) {
            content += `
                  <p style="font-size: 15px;">&nbsp;
                    <span class="glyphicon glyphicon-share-alt"></span>
                    ${e}
                  </p>`;
        }
        return `<div>${content}</div>`
    }

    megaPhone = totalPro => {
        let setTime;
        const getAudio = (e, url) => {
            try {
                setTime && clearTimeout(setTime)
                e.target.style.color = "green"
                setTime = setTimeout(() => {
                    new Audio(url).play()
                    e.target.style.color = "black"
                }, 300);
            } catch (e) {
                throw new Error(`Error: ${e}`);
            }
        }

        for (let index = 0; index < totalPro; index++) {
            if (document.getElementById(`speak-${index}`)) {
                document.getElementById(`speak-${index}`).addEventListener("click", e => {
                    let url = document.getElementById(`url-${index}`).value;
                    url && url.trim() != "" && getAudio(e, url)
                });
            }
        }
    }

    // overrided method
    showContentUI = obj => {
        if (!obj.translate) {
            return `<div id="definition_text">
                        <div style="margin-left: 5px;">
                            <h4><b>${obj.content}</b> (<span style="font-size:14px;font-style:italic;">
                            ${obj.typeText}</span>)</h4>
                        </div>
                        <div style="padding:5px;">
                            ${this.#pronunciationText(obj)}
                            ${this.#descriptionText(obj)}
                        </div>
                    </div>
                    <div style="padding:5px;">
                        ${this.#translateText(obj)}
                    </div>`
        } else {
            return `<div style="margin-left: 5px;">
                  <h4>${obj.content}</h4>
                </div>
                <div style="padding:5px;font-size: 16px; font-style: italic;"> 
                  <span class="glyphicon glyphicon-share-alt"></span>&nbsp;
                  ${obj.translate}
                </div>`
        }
    }

    updateContentUI = (relateWords) => {
        let res = ``
        relateWords && relateWords.length > 0 && relateWords.map(relateWord => {
            res += `<div style="margin-left: 5px;">
                        <h4><b>${relateWord.highlightedText}</b> (<span style="font-size:14px;font-style:italic;">
                        ${relateWord.typeText}</span>)</h4>
                    </div>
                    <div style="padding:5px;">
                        ${this.#descriptionText(relateWord)}
                    </div>`
        })
        return res
    }
}

export {
    BuildPopupUI
}