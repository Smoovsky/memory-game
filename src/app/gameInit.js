import iconNameList from './iconNameList.js';

const iconSelect = () => {
  let index = Math.round(Math.random() * (iconNameList.length - 1));
  let iconName = iconNameList[index];
  iconNameList.splice(iconNameList.indexOf(iconName), 1);
  return iconName;
};

let iconList = [];

const dispIconListGen = (size) => {
  size /= 2;
  for(let i = 0; i < size; i++){
    iconList.push(iconSelect());
  }
  iconList = [...iconList, ...iconList];
};

const dispIconSelect = () => {
  let index = Math.round(Math.random() * (iconList.length - 1));
  let iconName = iconList[index];
  iconList.splice(iconList.indexOf(iconName), 1);
  return iconName;
};

export  {
  dispIconListGen as gameInit,
  dispIconSelect,
};
