const list = document.getElementById('scroller');

list.scrollTop = 1000;

const onScroll = function (e) {
  // console.log(e);
  console.log(list.clientHeight, list.offsetHeight);
};

list.addEventListener('scroll', onScroll.bind(this));

class Element {
  _top = 0;

  constructor(element, index, top = 0) {
    this._top = top;
    this.index = index;
    this.element = element;

    // top
  }

  set top(top) {
    this._top = top;
    console.log('设置顶部');
  }

  get top() {
    return this._top;
  }

  get height() {
    return this.element.offsetHeight;
  }
}

class Elements {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  nextTailIndex(top, height) {
    if (!this.tail) return 0;
    console.log(this.tail.top, top + height);
    if (this.tail.top < top + height) {
      return this.tail.index + 1;
    }
    return -1;
  }

  push(element) {
    if (this.head === null) {
      this.tail = this.head = element;
      return;
    }
    element.top = this.tail.top + this.tail.height;
    this.tail.next = element;
    this.tail = element;
  }
}

class Scroller {
  _scrollTop = 0;

  constructor(view, adapter) {
    this.view = view;
    view.addEventListener('scroll', this.onScroll.bind(this));
    this.adapter = adapter;
    this.elements = new Elements();
    this.checkTail();
  }

  onScroll() {
    const delta = this.view.scrollTop - this._scrollTop;
    this._scrollTop = this.view.scrollTop;
    console.log(delta);
    if (delta > 0) {
      this.checkTail();
    }
  }

  checkTail() {
    const { view, adapter, elements } = this;
    let { scrollTop: top, clientHeight: height } = view;
    let index = elements.nextTailIndex(top, height);
    console.log(index);
    while (index >= 0 && index < adapter.count()) {
      const item = adapter.item(index);
      const e = adapter.create(adapter.type(index));
      adapter.bind(e, item, index);
      elements.push(new Element(e, index));
      this.view.appendChild(e);
      index = elements.nextTailIndex(top, height);
    }
  }
}

class Adapter {
  constructor() {}

  count() {
    return 100;
  }

  item(index) {
    return {
      content: '哈哈',
    };
  }

  type(index) {
    return 0;
  }

  create(type) {
    const v = document.createElement('div');
    v.style.zIndex = 100;
    v.style.border = '1px solid red';
    return v;
  }

  bind(element, item, index) {
    element.textContent = `${index}: ${item.content}`;
  }
}

new Scroller(list, new Adapter());
