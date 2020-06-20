class AbstractBuildContentUI {

    constructor() {
        if (new.target === AbstractBuildContentUI) {
            throw new TypeError("Cannot construct AbstractBuildContentUI instances directly");
        }
    }

    showContentUI(obj) {
        throw new Error('You have to implement showContentUI() method');
    }

    showContentUI() {
        throw new Error('You have to implement showContentUI() method');
    }
}

export {
    AbstractBuildContentUI
}