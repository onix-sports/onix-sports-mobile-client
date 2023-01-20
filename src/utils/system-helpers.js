import { Platform } from 'react-native';

class ForOs {
    constructor() {
        this.unknownOs = () => this;

        this[Platform.OS] = (cb) => {
            this._val = cb();

            return this;
        }

        return new Proxy(this, {
            get: function get(target, property) {
                return target[property] || target.unknownOs
            }
        })
    }

    val() {
        return this._val;
    }
}

const forOs = () => new ForOs();

export { forOs }