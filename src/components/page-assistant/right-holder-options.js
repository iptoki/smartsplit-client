export default function RightHolderOptions(rightHolders) {
    if (!Array.isArray(rightHolders)) {
        throw new Error('rightHolders param must be an array');
    }

    return rightHolders.map(makeRightHolderOption);
}

function makeRightHolderOption(rightHolder) {
    return {
        key: rightHolder.rightHolderId,
        value: rightHolder.rightHolderId,
        text: makeRightHolderText(rightHolder),
        image: {
            avatar: true,
            src: makeRightHolderAvatarUrl(rightHolder)
        }
    };
};

function makeRightHolderText(rightHolder) {
    return rightHolder.artistName ?
        rightHolder.artistName :
        [rightHolder.firstName, rightHolder.lastName]
            .filter(text => text)
            .join(' ');
};

function makeRightHolderAvatarUrl(rightHolder) {
    const avatarImage = rightHolder.avatarImage;

    return avatarImage ?
        'https://smartsplit-images.s3.us-east-2.amazonaws.com/' + avatarImage :
        'https://smartsplit-images.s3.us-east-2.amazonaws.com/faceapp.jpg';
};