import { DEFAULT_CONTACT_PROPS } from "../constants/contact";

export function getFormData(form) {
    const elements = Array.prototype.filter.call(form.elements, e => {
        return e.tagName === "INPUT" || e.tagName === "TEXTAREA";
    });
    const customProps = Object.keys(DEFAULT_CONTACT_PROPS.info);

    return elements.reduce((result, element) => {
        const { id, value } = element;
        const label = element.getAttribute("data-attr-label");
        const custom = customProps.indexOf(id) === -1;
        const item = { value, label, custom };

        if (!id || !item.value) {
            return result;
        }

        return {
            ...result,
            [id]: item
        };
    }, {})
}

export function getUniqueId(prefix) {
    return `${prefix}${Date.now()}`;
}

export function encodeImageFileAsURL(element) {
    const file = element.files[0];
    const reader = new FileReader();

    return new Promise((onRes, onRej) => {
        reader.onloadend = function() {
            onRes(reader.result);
        };
        reader.readAsDataURL(file);
    });
}