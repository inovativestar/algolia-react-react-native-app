import { Dimensions, Platform } from 'react-native';

export const convertObjectToArray = (obj) => {

  const keys = Object.keys(obj);
  const values = Object.values(obj);
  const newArray = [];
  for (let i = 0; i < keys.length; i++) {
    newArray.push({
      _id: keys[i],
      ...values[i]
    })
  }
  return newArray;
}

export const isArabic = (str) => {
  // var arRegEx = /[\u0600-\u06FF]/;
  // return str.replace(arRegEx,"@");
};

export const clearSpace = (str) => str.replace(/ +(?= )/g, '').trim();

export const clearSpaceWithoutTrim = (str) => {
  if(str === " ") return str.trim();
  return str.replace(/ +(?= )/g, '')
};

export function isIphoneX() {
  const dimension = Dimensions.get('window');

  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimension.height > 800 || dimension.width > 800)
  );
}
