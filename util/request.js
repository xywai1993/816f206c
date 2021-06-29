const fs = require('uxp').storage.localFileSystem;
const { formats } = require('uxp').storage;
function xhrBinary(url) {
    // [1]
    return new Promise((resolve, reject) => {
        // [2]
        const req = new XMLHttpRequest(); // [3]
        req.onload = () => {
            if (req.status === 200) {
                try {
                    const arr = new Uint8Array(req.response); // [4]
                    resolve(arr); // [5]
                } catch (err) {
                    reject(`Couldnt parse response. ${err.message}, ${req.response}`);
                }
            } else {
                reject(`Request had an error: ${req.status}`);
            }
        };
        req.onerror = reject;
        req.onabort = reject;
        req.open('GET', url, true);
        req.responseType = 'arraybuffer'; // [6]
        req.send();
    });
}

async function createImage(imageUrl) {
    try {
        //     const photoUrl = jsonResponse.message; // [2]
        const date = new Date().getTime();
        const photoObj = await xhrBinary(imageUrl); // [3]
        const tempFolder = await fs.getTemporaryFolder(); // [4]
        const tempFile = await tempFolder.createFile(`tmp_${date}_${parseInt(Math.random() * 1000)}`, { overwrite: true }); // [5]
        await tempFile.write(photoObj, { format: formats.binary }); // [6]
        // applyImagefill(selection, tempFile); // [7]
        return tempFile;
    } catch (err) {
        console.log('error', err);
        console.log(err.message);
    }
}

async function downloadImage(url = 'https://tinyfac.es/api/users') {
    let filter = [];
    const avatarList = localStorage.getItem('avatarList');
    if (avatarList) {
        console.log(JSON.parse(avatarList));
        filter = JSON.parse(avatarList);
    } else {
        localStorage.setItem('avatarList', JSON.stringify(filter));
        const data = await fetch(url).then((da) => da.json());
        filter = data.map((item) => item.avatars[0].url);
    }

    // const oneUrl = filter[0].url;
    const promiseAll = filter.map((item) => createImage(item));

    return Promise.all(promiseAll);
}

// async function downlaodImage(url) {
//     if (selection.items.length) {
//         // [1]
//         const url = 'https://dog.ceo/api/breeds/image/random'; // [2]
//         return fetch(url) // [3]
//             .then(function (response) {
//                 return response.json(); // [4]
//             })
//             .then(function (jsonResponse) {
//                 return downloadImage(selection, jsonResponse); // [5]
//             });
//     } else {
//         console.log('Please select a shape to apply the downloaded image.');
//     }
// }

module.exports = {
    downloadImage,
};
