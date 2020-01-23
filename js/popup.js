const addForm = document.addForm;
const pickForm = document.pickForm;
const pickListItems = [];

/** LocalStorage */
const saveToLocalStorage = str => {
  if (!str) return;
  localStorage.setItem(str, str);
};

const deleteFromLocalStorage = str => {
  localStorage.removeItem(str);
};

/** pick list */
const pickList = document.getElementById("pickList");

const addString = event => {
  event.preventDefault();
  const inputStr = addForm.addInput.value.trim();
  if (inputStr === "") return;
  appendAddHtml(inputStr);
  addForm.reset();
};

const appendAddHtml = str => {
  const html = createAddHtml(str);
  pickList.innerHTML += html;
  pickListItems.push(str);
  saveToLocalStorage(str);
};

const createAddHtml = str => {
  return `
  <div class="control">
    <div class="tags has-addons">
      <a class="tag is-success del">${str}</a>
      <a class="tag is-delete del"></a>
    </div>
  </div>`;
};

const deleteString = event => {
  if (!event.target.classList.contains("del")) return;
  const parent = event.target.parentElement.parentElement;
  parent.remove();
  const str = parent.textContent.trim();
  pickListItems.forEach((item, index) => {
    if (item === str) pickListItems.splice(index, 1);
  });
  deleteFromLocalStorage(str);
};

const clearStr = () => {
  pickListItems.length = 0;
  pickList.innerHTML = "";
  localStorage.clear();
};

/** picked list */
const pickedList = document.getElementById("pickedList");

const createPickedListHtml = strs => {
  let pickedListHtml = `<div class="list">`;
  strs.forEach(str => (pickedListHtml += `<a class="list-item">${str}</a>`));
  pickedListHtml += "</div>";
  return pickedListHtml;
};

const randomPick = event => {
  event.preventDefault();
  let length = pickListItems.length;
  if (length <= 0) return;
  const pickedStrs = [];
  const pickListItemsCpy = pickListItems.concat();
  const pickInputVal = pickForm.pickInput.value;
  const pickCount = pickInputVal > length ? length : pickInputVal;
  for (let i = pickCount; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * length);
    pickedStrs.push(pickListItemsCpy[randomIndex]);
    pickListItemsCpy.splice(randomIndex, 1);
    length--;
  }
  pickedList.innerHTML = createPickedListHtml(pickedStrs);
};

addForm.addEventListener("submit", e => addString(e));
pickList.addEventListener("click", e => deleteString(e));
pickForm.addEventListener("submit", e => randomPick(e));
document.getElementById("clearBtn").addEventListener("click", _ => clearStr());

// init
(() => {
  addForm.addInput.focus();
  Object.keys(localStorage).forEach(key => {
    const str = localStorage.getItem(key);
    if (!str) return;
    appendAddHtml(str);
  });
})();
