import _ from "lodash";
import Emitter from "components/Emitter";

/**
 * Manage all media devices
 */
class MediaDevice extends Emitter {
    /**
     * Turn on/off a device
     * @param {String} type - Type of the device
     * @param {Boolean} [on] - State of the device
     */
    toggle(type, on) {
        const len = arguments.length;
        if (this.stream) {
            this.stream[`get${type}Tracks`]().forEach((track) => {
                const state = len === 2 ? on : !track.enabled;
                _.set(track, "enabled", state);
            });
        }
        return this;
    }

    /**
     * Stop all media track of devices
     */
    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
        }
        return this;
    }
}

export default MediaDevice;
