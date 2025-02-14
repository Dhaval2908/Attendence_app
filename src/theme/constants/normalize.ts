import { Dimensions, Platform } from 'react-native';
import { hasNotch } from "react-native-device-info";

/* Designing Part */
const screenWidth = Dimensions.get('window').width;
export const WINDOW = Dimensions.get('window');
export const deviceType = WINDOW.width < 480 ? 'phone' : 'tablet';

export const isNotch = hasNotch();

export const iPhoneX = (Platform.OS === 'ios' && (WINDOW.height === 812 || WINDOW.height === 896 || WINDOW.height === 844 || WINDOW.height === 926));

export const isIphone14Pro = (Platform.OS === 'ios' && (WINDOW.height === 852 || WINDOW.height === 932));

export const isIphone12 = (Platform.OS === 'ios' && (WINDOW.height === 844 || WINDOW.height === 926));
export const isIphone11Max = (Platform.OS === 'ios' && (WINDOW.height === 896 || WINDOW.height === 926));
export const isIphone12ProMax = (Platform.OS === 'ios' && (WINDOW.height === 926));
export const isIphone7Plus = (Platform.OS === "ios") && (WINDOW.height === 736)

export const aspectRatio = WINDOW.height / WINDOW.width

export const smartScale = (value: number) => {
    if (deviceType == 'phone') {
        const height = Platform.OS === 'ios' ? isIphone11Max ? WINDOW.height - 94 : iPhoneX || isIphone14Pro ? WINDOW.height - 78 : WINDOW.height : WINDOW.height - 24;
        return (value * height) / 667;
    } else {
        //for tablet change do it here
        const height = WINDOW.height;
        return (value * height) / 667;
    }
};

export const fontNormalize = (value: number) => {
    if (deviceType == 'phone') {
        const height = Platform.OS === 'ios' ? isIphone11Max ? WINDOW.height - 94 : iPhoneX || isIphone14Pro ? WINDOW.height - 78 : WINDOW.height : WINDOW.height - 24;
        return (value * height) / 736;
    } else {
        const height = WINDOW.height;
        return (value * height) / 736;
    }
};

export const headerPadding = Platform.OS === 'ios' ? iPhoneX ? smartScale(10) : smartScale(aspectRatio > 2.1 ? 25 : 20) : smartScale(10);

export const headerHeight = Platform.OS === 'ios' ? iPhoneX ? smartScale(aspectRatio > 2.16 ? 100 : 87) : smartScale(65) : smartScale(50);
export const headerWidth = smartScale(screenWidth * 0.8);
export const fontSizeLarge = fontNormalize((deviceType == 'phone') ? 22 : 36);
export const fontSizeMedium = fontNormalize((deviceType == 'phone') ? 17 : 14);
export const fontSizeSmall = fontNormalize((deviceType == 'phone') ? 14 : 16);
export const fontSizeExtraSmall = fontNormalize((deviceType == 'phone') ? 12 : 14);
export const fontSizeContent = fontNormalize((deviceType == 'phone') ? 12 : 14);
export const fontSizeSmallContent = fontNormalize((deviceType == 'phone') ? 8 : 10);

export const emailRegex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"

