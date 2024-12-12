'use strict';

const current = document.querySelector('.current');
const history = document.querySelector('.history');
const buttons = document.querySelector('.buttons');
const delBtn = document.querySelector('.delete');

let state = {
  operator: null,
  num1: '',
  num2: '',
  recent: 'C',
  history: '',

  // = 반복시에만 필요 (과제에 없음)
  // repeatOp: null,
  // repeatSecond: 0,
};

// 이벤트리스너
buttons.addEventListener('click', (e) => {
  if (e.target.className !== 'buttons') {
    clickBtn(e);
    console.log(`${state.num1} ${state.operator} ${state.num2}`); // 추적!
  }
});

delBtn.addEventListener('click', (e) => {
  clickBtn(e);
});

// 클릭 (리턴값X .1)
function clickBtn(event) {
  const { btnType, clickedContent, current } = getData(event.target);
  state = updateState(state, btnType, clickedContent, current);
  display(state);
}

// 돔 읽기 (돔 접근)
function getData(targetElement) {
  return {
    btnType: getBtnType(targetElement),
    clickedContent: targetElement.textContent,
    current: current.textContent,
  };
}

// 화면 표시 (돔 접근) (리턴값X .2)
function display(state) {
  current.textContent = state.num2;
  history.textContent = state.history;
}

// state 관리
function updateState(state, btnType, clickedContent, current) {
  switch (btnType) {
    case 'number':
      return { ...inputNumber(state, clickedContent, current) };
    case 'operator':
      return { ...inputOperator(state, clickedContent, current) };
    case 'calculate':
      return { ...inputCalculate(state) };
    case 'function':
      return { ...inputFunc(state, clickedContent, current) };
    case 'dot':
      return { ...inputDot(state, clickedContent, current) };
    case 'delete':
      return { ...inputDel(state, current) };
  }
}

// 버튼 타입
function getBtnType(btn) {
  if (btn.classList.contains('number')) {
    return 'number';
  }
  if (btn.classList.contains('operator')) {
    return 'operator';
  }
  if (btn.classList.contains('calculate')) {
    return 'calculate';
  }
  if (btn.classList.contains('function')) {
    return 'function';
  }
  if (btn.classList.contains('dot')) {
    return 'dot';
  }
  if (btn.classList.contains('delete')) {
    return 'delete';
  }
}

// Recent 타입 (C, operator, caculate 필요)
function getRecentType(state) {
  switch (state.recent) {
    case 'C':
      return 'C';
    case '+':
    case '-':
    case '*':
    case '/':
      return 'operator';
    case '=':
      return 'calculate';
    default:
      return 'others';
  }
}

// 숫자
function inputNumber(state, clickedContent, current) {
  if (getRecentType(state) === 'operator') {
    return {
      ...state,
      history: `${state.num1} ${state.operator}`,
      num2: clickedContent,
      recent: clickedContent,
    };
  }
  if (current === '0') {
    return { ...state, num2: clickedContent, recent: clickedContent };
  }
  return {
    ...state,
    num2: current + clickedContent,
    recent: clickedContent,
  };
}

// 사칙연산
function inputOperator(state, clickedContent, current) {
  if (getRecentType(state) === 'operator') {
    return { ...state };
  }
  if (state.num1) {
    return {
      ...state,
      operator: clickedContent,
      num1: caculate(state.num1, state.operator, state.num2),
      history: `${caculate(state.num1, state.operator, state.num2)}`,
      recent: clickedContent,
    };
  }
  return {
    ...state,
    operator: clickedContent,
    num1: current,
    recent: clickedContent,
  };
}

// =
function inputCalculate(state) {
  return {
    ...state,
    history: `${state.num1} ${state.operator} ${state.num2}`,
    num2: caculate(state.num1, state.operator, state.num2),
    operator: null,
    num1: '',
    recent: 'C',
  };
}

// func
function inputFunc(state, clickedContent, current) {
  switch (clickedContent) {
    case 'C':
      return {
        ...state,
        history: '',
        num2: '0',
        num1: '',
        operator: null,
        recent: clickedContent,
      };
    case '±':
      return { ...state, num2: current * -1 };
    case '%':
      return { ...state, num2: current / 100 };
  }
}

// .
function inputDot(state, clickedContent, current) {
  if (current.includes('.')) {
    return state;
  }
  return { ...state, num2: current + clickedContent };
}

// Del
function inputDel(state, current) {
  if (current.length === 1) {
    return { ...state, num2: '0' };
  }
  return { ...state, num2: current.toString().slice(0, -1) };
}

// calculate
function caculate(num1, operator, num2) {
  num1 = Number(num1);
  num2 = Number(num2);

  switch (operator) {
    case '+':
      return Number((num1 + num2).toFixed(5));
    case '-':
      return Number((num1 - num2).toFixed(5));
    case '*':
      return Number((num1 * num2).toFixed(5));
    case '/':
      return Number((num1 / num2).toFixed(5));
  }
}
