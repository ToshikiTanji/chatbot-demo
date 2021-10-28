import React, {useState, useEffect, useCallback} from 'react';
import './assets/styles/style.css';
import {AnswersList, Chats, FormDialog} from './components/index';
import {db} from './firebase/index';


//テスト
const App = () => {
  const [answers, setAnswers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState(["init"]);
  const [dataset, setDataset] = useState({});
  const [open, setOpen] = useState(false);

  const displayNextQuestion = (nextQuestionId, nextDataset) => {
    addChats({
      text: nextDataset.question,
      type: 'question'
    });

    setAnswers(nextDataset.answers);
    setCurrentId(nextQuestionId);
  }

  const selectAnswer = (selectedAnswers, nextQuestionId) => {

    switch(true){
      case (nextQuestionId === 'contact') :
        handleClickOpen();
        break;
      case (/^https:*/.test(nextQuestionId)) : 
        const a = document.createElement('a');
        a.href = nextQuestionId;
        a.target = '_blank';
        a.click();
        //window.location.href = nextQuestionId;
        break;
      default :
        addChats({
          text: selectedAnswers,
          type: 'answer'
        });

        setTimeout(() => displayNextQuestion(nextQuestionId, dataset[nextQuestionId]), 1000);
        break;
    }
  }

  const addChats = (chat) => {
    setChats(prevChats => {
      return [...prevChats, chat];
    })
  }

  const initChats = () => {
    const initDataset = this.state.dataset[this.state.currentId];
    const chat = {
      text: initDataset.question,
      type: 'question'
    }

    const chats = this.state.chats;
    chats.push(chat);

    this.setState({
      chats: chats
    })
  }

  const initAnswer = () => {
    const initDataset = this.state.dataset[this.state.currentId];
    const initAnswers = initDataset.answers;

    this.setState({
      answers: initAnswers
    })
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    // async付きの即時関数
    (async() => {
      // 非同期処理
      const initDataset = {};
      await db.collection('questions').get().then(snapshots => {
        snapshots.forEach(doc => {
          const id = doc.id;
          const data = doc.data();
          initDataset[id] = data;
        })
      })

      setDataset(initDataset);
      displayNextQuestion(currentId, initDataset[currentId]);
    })();
  }, []);

  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area');
    if(scrollArea){
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  });

  return (
    <section class="c-section">
      <div class="c-box">
        <Chats chats={chats}/>
        <AnswersList answers={answers} select={selectAnswer}/>
        <FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  );
}

export default App;
