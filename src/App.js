import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

//사용자정의태그(컴포넌트) 만드는 것은 함수를 만드는 것이다. 
//사용자정의태그(컴포넌트)를 만들 때는 반드시 대문자를 사용한다.
function Header(props){ //Header 컴포넌트의 title="REACT" 내용이 오브젝트로 들어온다.
  return <header>
     <h1><a href='/' onClick={function(event){
       event.preventDefault();
       props.onChangeMode(); 
     }}>{props.title}</a></h1>
   </header>
}

function Nav(props){
  const lis = []

  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    // react가 찾아야할 때 필요한 key
    lis.push(<li key={t.id}>
      <a id = {t.id} href={'/read/' + t.id} onClick={event=>{ event.preventDefault(); props.onChangeMode(Number(event.target.id)); }}>{t.title}</a>
      </li>)
  }
  return <nav>
      <ol>
       {lis}
      </ol>
   </nav>
}

function Article(props){
  return <article>
     <h2>{props.title}</h2>
     {props.body}
   </article>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name='title' placeholder='title'/></p>
      <p><textarea name='body' placeholder='body'/></p>
      <p><input type='submit' value="Create"/></p>
    </form>
  </article>
}

function Update(props){
  const[title, setTitle] = useState(props.title);
  const[body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name='title' placeholder='title' value={title} onChange={event=>{
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name='body' placeholder='body' value={body}onChange={event=>{
        setBody(event.target.value);
        }}/></p>
      <p><input type='submit' value="Update"/></p>
    </form>
  </article>
}




function App() {
  //const _mode = useState('WELCOME');//배열을 리턴한다. 0번째는 값을 가지고 있다. 그 중 1번은 상태를 변경하는 함수
 //const mode = mode[0];
 //const mode = _mode[1];
  
  const [mode, setMode] = useState('WELCOME'); //함수를 다시 실행하게 해준다.

  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);

  const [topics, setTopics] = useState([
    { id:1, title: 'html', body: 'html is...'},
    { id:2, title: 'css', body: 'css is...'},
    { id:3, title: 'js', body: 'js is...'}
  ]);

  let content = null;

  let contextControl = null;

  if(mode === 'WELCOME'){
    content =  <Article title="Welcome" body="hello my Welcome"></Article>
  }else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }

    content =  <Article title={title} body={body}></Article>

    contextControl =  <>
    <li>
    <a href={'/update/'+id} onClick={event=>{
      event.preventDefault();
      setMode('UPDATE');
    }}>글 수정</a>
  </li>
  <li>
    <input type='button' value='Delete' onClick={()=>{
      const newTopics = []
      for(let i = 0; i<topics.length; i++){
        if(topics[i].id !== id){
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
      setMode('WELCOME');
    }}/>
  </li>
  </>

  }else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      // 오브젝트와 어레이를 복제하는 방법 newValue={...value}
      const newTopic = {id:nextId, title:_title, body:_body }
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ'); //상세페이지 이동
      setId(nextId);
      setNextId(nextId+1);//다음의 글을 추가할 때를 대비하여

    }}></Create>
  }else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title,body)=>{
      const newTopics = [...topics]
        const updatedTopic = {id:id, title:title, body:body}
        for(let i=0; i<newTopics.length; i++){
          if(newTopics[i].id === id){
            newTopics[i] = updatedTopic;
            break;
          }
        }
        setTopics(newTopics);
        setMode('READ');
    }}></Update>

  }

  return (
    <div>
      <Header title="REACT" onChangeMode={function(){ setMode('WELCOME');}}></Header> 
      <Nav topics= {topics} onChangeMode={(_id)=>{ setMode('READ'); setId(_id);}}></Nav>
      {/* <Article title="Welcome" body="hello my web"></Article>
      <Article title="hey" body="hello e"></Article> */}
      {content}
  <ul>
    <li>
      <a href='/create' onClick={event=>{
          event.preventDefault();
          setMode('CREATE');
        }}>글 생성</a>
    </li>
   {contextControl}
  </ul>
    </div>
  );
}

export default App;

//PROP은 컴포넌트를 사용하는 외부자를 위한 데이터
//STATE 컴포넌트를 만드는 내부자를 위한 데이터

