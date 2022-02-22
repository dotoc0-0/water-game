'use strict'; {
  const Figures = document.querySelectorAll('.figure');
  const Amounts = document.querySelectorAll('.amount');
  const Capacitys = document.querySelectorAll('.capacity');
  const Waters = document.querySelectorAll('.water');
  const Question = document.getElementById('question');
  const QuizList = document.getElementById('quiz-list');
  const Caption = document.getElementById('caption');
  const Share = document.getElementById('share');
  const Tweet = document.getElementById('tweet');
  const Count = document.getElementById('count');
  const Undo = document.getElementById('undo');
  const Records = document.getElementById('records');
  
  let amounts;
  let capacitys;
  let goal;
  let selected = false;
  let pouring = false;
  let a; //注ぐ側のamount
  let b; //注がれる側のamount
  let c; //注がれる側のcapacity
  let firstIndex;
  let secondIndex; //クリックされたFigureのインデックス
  let records = []; //水かさが変わるたびに記録
  
  function ClickedAction(target) {
    target.addEventListener('click', () => {
      if (pouring === true) { //注ぎ中は他のをクリックしても何も起きない
        return;
      }
      if (target.classList.contains('selected')) { //同じものをもう一回クリックした時は操作取り消し
        target.classList.remove('selected');
        selected = false;
      } else if (selected === true) { //違うやつをクリックした時、二つとも1秒後に元に戻る
        target.classList.add('selected');
        selected = false;
        pouring = true;
        secondIndex = [].slice.call(Figures).indexOf(target);
        b = amounts[secondIndex];
        c = capacitys[secondIndex];
        if (c - b > a) {
          amounts[firstIndex] = amounts[firstIndex] - a;
          amounts[secondIndex] = amounts[secondIndex] + a;
        } else {
          amounts[firstIndex] = amounts[firstIndex] - (c - b);
          amounts[secondIndex] = amounts[secondIndex] + (c - b);
        }
        setAmount(amounts);
        records.push([...amounts]);
        showRecords();
        setTimeout(function () {
          Figures.forEach(figure => {
            figure.classList.remove('selected');
          });
          if (amounts.toString() === `${goal},${goal},0`) {
            Caption.innerHTML = `<p>おめでとう！<br>${records.length - 1}手でクリアしました。</p>`;
            Share.style.display = 'inline-block';
            Share.innerHTML = `<a href="https://twitter.com/share?url=https://dotoc0-0.github.io/water-game/&via=dotoc0_0&text=水ゲーム ${Question.textContent}を『${records.length - 1}手』でクリアしました！" rel="nofollow" target="_blank" id="tweet">結果をツイート</a>`;
          }
          pouring = false;
        }, 700);
      } else {
        //まだ何も選択されてない時は普通に選択される効果のみ
        target.classList.add('selected');
        selected = true;
        firstIndex = [].slice.call(Figures).indexOf(target);
        a = amounts[firstIndex];
      }
    });
  }
  Figures.forEach(figure => {
    ClickedAction(figure);
  });
  
  //記録の追加
  function showRecords() {
    Records.innerHTML = '';
    records.forEach(record => {
      const p = document.createElement('p');
      p.textContent = record;
      Records.appendChild(p);
      p.classList.add('record');
    });
    Count.innerHTML = `現在 ${records.length - 1}手`;
  }
  
  //水かさの視覚化
  function setWater() {
    for (let i = 0; i < 3; i++) {
      Waters[i].style.top = 100 * (capacitys[i] - amounts[i]) / capacitys[i] + "%";
    }
}

  //水の量を変える
  function setAmount(array) {
    amounts = array;
    for (let i = 0; i < 3; i++) {
      Amounts[i].innerHTML = amounts[i];
    }
    setWater();
  }
  
    Undo.addEventListener('click', () => {
    if (records.length < 2) {
      return;
    } else {
      records.splice(records.length - 1);
      setAmount([...records[records.length - 1]]);
      showRecords();
    }
　　});

  let questions = [];
  questions[0] = {
    capacitys: [8, 5, 3],
    amounts: [8, 0, 0],
    goal: 4
  }
  questions[1] = {
    capacitys: [10, 7, 3],
    amounts: [10, 0, 0],
    goal: 5
  }
  questions[2] = {
    capacitys: [12, 7, 5],
    amounts: [12, 0, 0],
    goal: 6
  }
  questions[3] = {
    capacitys: [16, 9, 7],
    amounts: [16, 0, 0],
    goal: 8
  }

  function setQuestion(number) {
    capacitys = questions[number - 1].capacitys;
    goal = questions[number - 1].goal;
    setAmount([...questions[number - 1].amounts]);
    setWater();
    records = [[...questions[number - 1].amounts]];
    showRecords();
    //コップの大きさ設定
    for (let i = 0; i < 3; i++) {
      Capacitys[i].innerHTML = capacitys[i];
      if (capacitys[i] / capacitys[0] > 0.5) {
        Figures[i].style.height = 80 * (capacitys[i] / capacitys[0]) + "px";
      } else {
        Figures[i].style.height = 110 * (capacitys[i] / capacitys[0]) + "px";
        Figures[i].style.width = "46%";
      }
    }
    Share.style.display = "none";
    Question.innerHTML = `Q${number}`;
    Caption.innerHTML = `${Figures.length}つの容器を使って${goal}Lを計ろう！`;
  }
  
  //問題切り替えリンク
  for (let i = 1; i < questions.length + 1; i++) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = 'Q' + i;
    li.appendChild(p);
    QuizList.appendChild(li);
    p.addEventListener('click', () => {
      setQuestion(i);
    });
  }
  
    setQuestion(1);
  }
