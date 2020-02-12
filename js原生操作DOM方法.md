# js 原生操作 DOM 方法

## 节点查找

1.  document.getElementById：根据 ID 查找元素，大小写敏感，如果有多个结果，只返回第一个；
2.  document.getElementsByClassName：根据类名查找元素，多个类名用空格分隔，返回一个 HTMLCollection；
3.  document.getElementsByTagName：根据标签查找元素，\*表示查询所有标签，返回一个 HTMLCollection；
4.  document.getElementsByName：根据元素的 name 属性查找，返回一个 NodeList；
5.  document.querySelector：返回单个 Node，如果匹配到多个结果，只返回第一个；
6.  document.querySelectorAll：返回一个 NodeList
7.  document.forms：获取当前页面所有 form，返回一个 HTMLCollection

## 节点操作

### 节点创建

1.  createElement：创建元素；
2.  createTextNode：创建文本节点；
3.  cloneNode：克隆一个节点；
4.  createDocumentFragment：本方法用来创建一个 DocumentFragment，也就是文档碎片，它表示一种轻量级的文档，主要是用来存储临时节点，大量操作 DOM 时用它可以大大提升性能

### 节点修改

1.  appendChild：向节点的子节点列表的末尾添加新的子节点
2.  insertBefore：在已有的子节点前插入一个新的子节点
3.  insertAdjacentHTML：将指定的文本解析为 HTML 或 XML，并将结果节点插入到 DOM 树中的指定位置
4.  Element.insertAdjacentElement()：将指定的元素插入指定的位置
5.  removeChild：删除指定的子节点并返回子节点
6.  replaceChild：将一个节点替换另一个节点

## 节点关系

1.  parentNode：每个节点都有一个 parentNode 属性，它表示元素的父节点。Element 的父节点可能是 Element，Document 或 DocumentFragment
2.  children：返回一个实时的 HTMLCollection，子节点都是 Element
3.  childNodes：返回一个实时的 NodeList，表示元素的子节点列表，注意子节点可能包含文本节点、注释节点等
4.  firstChild：返回第一个子节点，不存在返回 null，与之相对应的还有一个 firstElementChild
5.  lastChild：返回最后一个子节点，不存在返回 null，与之相对应的还有一个 lastElementChild
6.  previousSibling：节点的前一个节点，如果不存在则返回 null。注意有可能拿到的节点是文本节点或注释节点，与预期的不符，要进行处理一下
7.  nextSibling：节点的后一个节点，如果不存在则返回 null。注意有可能拿到的节点是文本节点，与预期的不符，要进行处理一下
8.  previousElementSibling：返回前一个元素节点，前一个节点必须是 Element
9.  nextElementSibling：返回后一个元素节点，后一个节点必须是 Element

## 元素属性

1.  setAttribute：给元素设置属性
2.  getAttribute：返回指定的特性名相应的特性值，如果不存在，则返回 null
3.  hasAttribute：如果存在指定属性，则 hasAttribute() 方法返回 true，否则返回 false

## 样式操作

1.  直接修改元素的样式

```
  elem.style.color = 'red';
  elem.style.setProperty('font-size', '16px');
  elem.style.removeProperty('color');
```

2.  动态添加样式规则

```
  var style = document.createElement('style');
  style.innerHTML = 'body{color:red} #top:hover{background-color:      red;color: white;}';
  document.head.appendChild(style);
```

3.  classList 获取样式 class

```
  //移除元素中一个或多个类名。移除不存在的类名，不会报错
  div.classList.remove(class);

  //在元素中添加一个或多个类名。如果指定的类名已存在，则不会添加
  div.classList.add(class);

  //在元素中切换类名。
  div.classList.toggle(class, true|false);

    第一个参数为要在元素中移除的类名，并返回 false。
    如果该类名不存在则会在元素中添加类名，并返回 true。

    第二个是可选参数，是个布尔值用于设置元素是否强制添加或移除类，不管该类名是否存在。例如：

    移除一个 class: element.classList.toggle("classToRemove", false);
    添加一个 class: element.classList.toggle("classToAdd", true);

   //返回布尔值，判断指定的类名是否存在。
  div.classList.contains(class);
```
