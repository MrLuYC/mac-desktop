function Calculator() {
  this.number = 0;
  this.operator = 0;
  this.preResult = 0;
  this.isPoint = false;
  
  this.init = function () {
    let input = $('.app-calculator input');
    //  把输入框的显示设为0
    input.val(0)
    //  禁止用户直接输入数字
    input.attr('readOnly', 'readonly');
    console.log('gg');
  };
  
  this.inputNumber = function (value) {
    let input = $('.app-calculator input');

    let inputNumber = null;

    if (!osx.calculator.isPoint) {
      inputNumber = parseFloat(input.val());
    } else {
      inputNumber = input.val();
    }

    if (osx.calculator.preResult !== 0) {
      osx.calculator.preResult = 0;
      input.val(0);
      inputNumber = 0;
    }

    if (inputNumber === 0) {
      input.val(value);
    } else {
      input.val('' + inputNumber + value);
    }
  };

  this.operaing = function(op) {
    let input = $('.app-calculator input');
    let inputNumber = parseFloat(input.val());

    osx.calculator.number = inputNumber;
    input.val(0);
    osx.calculator.operator = op;
    osx.calculator.isPoint = false;
  };

  this.compute = function() {

    let input = $('.app-calculator input');
    let inputNumber = parseFloat(input.val());

    switch (osx.calculator.operator) {
      case 1:
        osx.calculator.preResult = osx.calculator.number + inputNumber;
        input.val(osx.calculator.preResult);
        break;
      case 2:
        osx.calculator.preResult = osx.calculator.number - inputNumber;
        input.val(osx.calculator.preResult);
        break;
      case 3:
        osx.calculator.preResult = osx.calculator.number * inputNumber;
        input.val(osx.calculator.preResult);
        break;
      case 4:
        osx.calculator.preResult = osx.calculator.number / inputNumber;
        input.val(osx.calculator.preResult);
        break;
    }

    osx.calculator.operator = 0;
    osx.calculator.isPoint = false;
  };

  /**
   * 归零
   */
  this.zero = function() {
    let input = $('.app-calculator input');
    input.val(0);
    osx.calculator.number = 0;
    osx.calculator.preResult = 0;
    osx.calculator.operator = 0;
  };

  /**
   * 小数点
   */
  this.point = function() {

    if (!osx.calculator.isPoint) {
      let input = $('.app-calculator input');
      let inputNumber = parseFloat(input.val());

      input.val('' + inputNumber + '.');
      osx.calculator.isPoint = true;
    }

  }
}

window.osx.calculator = new Calculator();



