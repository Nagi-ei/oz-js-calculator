'use strict';

let operator = null;
let firstOperand = '';
let secondOperand = '';

let recent = 'C';
let repeatOp = null;
let repeatSecond = '';

const history = document.querySelector('.history');
const current = document.querySelector('.current');
const buttons = document.querySelector('.buttons');
const delBtn = document.querySelector('.delete');

// 계산 함수
const calculate = (num1, operator, num2) => {
  num1 = convertToNumber(num1);
  num2 = convertToNumber(num2);

  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return num1 / num2;
  }
};

// 숫자 변환 (%는 비율로, 문자열은 숫자로)
const convertToNumber = (input) => {
  if (input.includes('%')) {
    input = Number(input.slice(0, -1)) / 100;
  }
  return Number(input);
};

// 초기화
const init = (firstOp = '') => {
  firstOperand = firstOp;
  secondOperand = '';
  operator = null;
};

// 숫자에 추가
const update = (text) => {
  recent = text;
  current.textContent += text;
  if (operator === null) {
    firstOperand += text;
  } else {
    secondOperand += text;
  }
};

// 타입 구하기
function getType(btn) {
  if (
    btn === '+' ||
    btn === '-' ||
    btn === '*' ||
    btn === '/' ||
    btn.classList.contains('operator')
  ) {
    return 'operator';
  }
  if (btn.classList.contains('calculate')) {
    return 'calculate';
  }
  if (btn.classList.contains('function')) {
    return 'function';
  }
  if (btn.classList.contains('number')) {
    return 'number';
  }
  if (btn.classList.contains('dot')) {
    return 'dot';
  }
}

// 입력 이벤트리스너
buttons.addEventListener('click', (e) => {
  // =
  if (getType(e.target) === 'calculate') {
    if (recent === '=') {
      history.textContent = `${current.textContent} ${repeatOp} ${repeatSecond}`;
      current.textContent = calculate(firstOperand, repeatOp, repeatSecond);
      init(current.textContent);
    } else {
      repeatOp = operator;
      repeatSecond = secondOperand;
      history.textContent = `${firstOperand} ${operator} ${secondOperand}`;
      current.textContent = calculate(firstOperand, operator, secondOperand);
      recent = e.target.textContent;
      init(current.textContent);
    }
  }

  // 숫자
  if (getType(e.target) === 'number') {
    if (recent === 'C' || recent === '=') {
      current.textContent = '';
      init();
    }
    if (recent === operator) {
      current.textContent = '';
      history.textContent = `${firstOperand} ${operator}`;
    }
    update(e.target.textContent);
  }

  // 소수점
  if (getType(e.target) === 'dot' && !current.textContent.includes('.')) {
    update(e.target.textContent);
  }

  // 연산
  if (getType(e.target) === 'operator') {
    if (operator) {
      current.textContent = calculate(firstOperand, operator, secondOperand);
      firstOperand = current.textContent;
      secondOperand = '';
      console.log(`${firstOperand} ${operator} ${secondOperand}`);
    }

    operator = e.target.textContent;
    console.log(`First Operand: ${firstOperand}\nOperator: ${operator}`); // 4-1 요구사항
    recent = e.target.textContent;
    // current.textContent += ` ${e.target.textContent} `; // 연산기호 디스플레이에 표시 안함
  }

  // 기능
  if (getType(e.target) === 'function') {
    if (e.target.textContent === 'C') {
      init();
      recent = e.target.textContent;
      current.textContent = '0';
      history.textContent = '';
    }

    // 로직 다시 점검 (여러번 누를시 문제)
    if (e.target.textContent === '+/-') {
      if (firstOperand === '') {
        current.textContent = '-';
        firstOperand = '-';
      } else if (firstOperand === '-') {
        current.textContent = '';
      } else if (getType(recent) === 'operator') {
        current.textContent = '-';
        secondOperand = '-';
      } else if (operator) {
        console.log(recent); //
        secondOperand = Number(secondOperand) * -1;
        current.textContent = secondOperand;
      } else {
        firstOperand = Number(firstOperand) * -1;
        current.textContent = firstOperand;
      }
      recent = e.target.textContent;
    }

    if (e.target.textContent === '%' && recent !== '%') {
      update(e.target.textContent);
    }
  }
  console.log(`${firstOperand} : ${operator} : ${secondOperand}`); //
});

// Delete
delBtn.addEventListener('click', () => {
  current.textContent = current.textContent.slice(0, -1);
  if (operator) {
    secondOperand = current.textContent;
  } else {
    firstOperand = current.textContent;
  }
  console.log(`${firstOperand} : ${operator} : ${secondOperand}`); //
});

// 버그
// +/- % 에서 여기저기 연타시 NaN
// 정확히 어떤 순간에 이러는지부터 파악하기
