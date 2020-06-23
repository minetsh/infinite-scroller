const list = document.getElementById('scroller');

class Element {
  _top = 0;

  constructor(view, index, top = 0) {
    this._top = top;
    this.index = index;
    this.view = view;
  }

  set top(top) {
    this._top = top;
    console.log('设置顶部');
    this.view.style.transform = `translateY(${top}px)`;
  }

  get top() {
    return this._top;
  }

  get height() {
    return this.view.offsetHeight;
  }
}

class Elements {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  index(down, top, height) {
    if (down) {
      if (!this.tail) return 0;
      if (this.tail.top < top + height) {
        return this.tail.index + 1;
      }
    } else {
      if (!this.head) return 0;
      if (this.head.top > top - height) {
        return this.head.index - 1;
      }
    }
    return -1;
  }

  push(down, view, index) {
    if (this.tail === null || this.head === null) {
      this.tail = this.head = new Element(view, index);
      return true;
    }
    const element = new Element(view, index);
    if (down) {
      element.top = this.tail.top + this.tail.height;
      this.tail.next = element;
      this.tail = element;
    } else {
      // 这里要斟酌下
      element.top = this.head.top - view.offsetHeight;
      this.head.previous = element;
      this.head = element;
    }
    return true;
  }
}

class Adapter {
  constructor(scroller) {
    this.scroller = scroller;
    this.scroller.addEventListener('scroll', this.onScroll.bind(this));
    this.elements = new Elements();
    this.scrollTop = 0;
    this.check(true);
  }

  onScroll() {
    const { scrollTop } = this.scroller;
    const delta = scrollTop - this.scrollTop;
    console.log(delta, scrollTop, this.scrollTop);
    this.check(delta > 0);
    this.scrollTop = scrollTop;
  }

  check(down) {
    const { scroller, elements } = this;
    const { scrollTop: top, clientHeight: height } = scroller;
    let index = elements.index(down, top, height);
    console.log('下一个位置：', index);
    while (index >= 0 && index < this.count()) {
      const item = this.item(index);
      const view = this.create(this.type(index));
      this.bind(view, item, index);
      if (elements.push(down, view, index)) {
        scroller.appendChild(view);
      }
      index = elements.index(down, top, height);
    }
  }

  attach() {}

  count() {
    return 0;
  }

  item(index) {}

  type(index) {
    return 0;
  }

  create(type) {}

  bind(view, item, index) {}
}

class ScrollAdapter extends Adapter {
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
    v.style.position = 'absolute';
    return v;
  }

  bind(element, item, index) {
    element.textContent = `${index}: ${item.content}`;
  }
}

new ScrollAdapter(list);
