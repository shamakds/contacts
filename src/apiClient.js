const StorageItemKey = "CONTACTS";

function getPromise(setRes, setRej) {
    return new Promise((onRes, onRej) => {
        setRes(onRes);
        setRej(onRej);
    });
}

export const contact = {
    get: () => {
        let resolve; let reject;
        const promise = getPromise((onRes) => {resolve = onRes}, (onRej) => {reject = onRej});
        const data = JSON.parse(localStorage.getItem(StorageItemKey)) || [];
        resolve && resolve(data);

        return promise;
    },
    post: (props) => {
        let resolve; let reject;
        const promise = getPromise((onRes) => {resolve = onRes}, (onRej) => {reject = onRej});
        let records = JSON.parse(localStorage.getItem(StorageItemKey)) || [];
        const contact = {
            ...props,
            createdOn: Date.now()
        };
        records.push(contact);
        localStorage.setItem(StorageItemKey, JSON.stringify(records));
        resolve && resolve({
            data: contact,
            all: records
        });

        return promise;
    },
    delete: (id) => {
        let resolve; let reject;
        const promise = getPromise((onRes) => {resolve = onRes}, (onRej) => {reject = onRej});
        let records = JSON.parse(localStorage.getItem(StorageItemKey)) || [];
        const contact = records.find(o => o.id === id);
        const index = records.indexOf(contact);

        records.splice(index, 1);
        localStorage.setItem(StorageItemKey, JSON.stringify(records));
        resolve && resolve({
            data: null,
            all: records
        });

        return promise;
    },
    update: (props) => {
        let resolve; let reject;
        const promise = getPromise((onRes) => {resolve = onRes}, (onRej) => {reject = onRej});
        let records = JSON.parse(localStorage.getItem(StorageItemKey)) || [];
        const contact = records.find(o => o.id === props.id);
        const index = records.indexOf(contact);
        const updatedContact = {
            ...contact,
            info: props.info
        };

        records.splice(index, 1, updatedContact);
        localStorage.setItem(StorageItemKey, JSON.stringify(records));
        resolve && resolve({
            data: updatedContact,
            all: records
        });

        return promise;
    },
};