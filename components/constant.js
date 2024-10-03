import { Dimensions } from 'react-native'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const scale = windowWidth / 320;

const notificationTypes = {
 POST_TAG : 'POST_TAG',
NEW_POST : 'NEW_POST',
MESSAGE : 'MESSAGE',
CONNECTION : 'CONNECTION',
ACCEPT_CONNECTION : 'ACCEPT_CONNECTION',
REJECT_CONNECTION : 'REJECT_CONNECTION',
LIKE_POST : 'LIKE_POST',
POST_COMMENT : 'POST_COMMENT',
POST_COMMENT_REPLY : 'POST_COMMENT_REPLY',
ANNOUNCEMENT_COMMENT:'ANNOUNCEMENT_COMMENT',
LIKE_ANNOUNCEMENT : 'LIKE_ANNOUNCEMENT',
LIKE_ANNOUNCEMENT_COMMENT : 'LIKE_ANNOUNCEMENT_COMMENT',
CHECK_IN_UPDATE :'CHECK_IN_UPDATE',
POST_RESHARE :'POST_RESHARE',
EVENT_JOIN:'EVENT_JOIN',
}

const ResponsiveSize = (size) => Math.round(size * scale);


const global = {
    primaryColor: '#05348E',
    primaryColorDark:"#002245",
    secondaryColor: "#69BE25",
    black: 'black',
    white: 'white',
    description:"#DADADA",
    inputWidth: windowWidth * 0.9,
    inputHeight: windowHeight * 0.07,
    inputPaddingH: windowWidth * 0.06,
    placeholderColor: '#666666',
    red:'red'
}

export { global, ResponsiveSize, notificationTypes }