import iconNameList from './iconNameList.js';


let internalList = [...iconNameList];

//function to randomly a non-repeated pick icon name from icon list.
const iconSelect = () => {
  let index = Math.round(Math.random() * (internalList.length - 1));
  let iconName = internalList[index];
  internalList.splice(internalList.indexOf(iconName), 1);
  return iconName;
};


//final icon list used to fill the game board
let iconList = [];

//fill the icon list with randomly picked icon names
const dispIconListGen = (size) => {
  internalList = [...iconNameList];
  size /= 2;
  for(let i = 0; i < size; i++){
    iconList.push(iconSelect());
  }
  iconList = [...iconList, ...iconList];
};

//return a icon name from icon list
const dispIconSelect = () => {
  let index = Math.round(Math.random() * (iconList.length - 1));
  //console.log(iconList);
  let iconName = iconList[index];
  iconList.splice(iconList.indexOf(iconName), 1);
  return iconName;
};

export  {
  dispIconListGen as gameInit,
  dispIconSelect,
};
