import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {gql} from "graphql-tag";


//add todos
//toogle todos
//delete todos
//list todos

const GET_TODOS=gql`query getTodos {
  react_insta_Schema_todos {
    done
    id
    text
  }
}
`;

const TOGGLE_TODO=gql`
mutation toggleTodo($id:uuid!,$done: Boolean!) {
  update_react_insta_Schema_todos(where: {id: {_eq: $id }}, _set: {done: $done}) {
    returning {
      done
      id
      text
    }
  }
}
`;

const ADD_TODO=gql`
mutation addTodo($text:String!) {
  insert_react_insta_Schema_todos(objects: {text: $text}) {
    returning {
      done
      id
      text
    }
  }
}
`;
const DELETE_TODO=gql`
mutation deleteTodo($id:uuid!) {
  delete_react_insta_Schema_todos(where: {id: {_eq: $id}}) {
    returning {
      done
      id
      text
    }
  }
}
`;

function App() {
  const [todoText,setTodoText]= React.useState('');
  const {data,loading,error}=useQuery(GET_TODOS);
  const [toggleTodo]=useMutation(TOGGLE_TODO);
  const [addTodo]=useMutation(ADD_TODO,{
    onCompleted: () => setTodoText("")
  });
  const [deleteTodo]=useMutation(DELETE_TODO);
  
  async function handleToggleTodo({id,done}) {
    const data = await toggleTodo({variables:{id,done:!done}})
    console.log('toggled todo',data);
  }
  async function handleAddTodo(event){
    event.preventDefault();
    if(!todoText.trim)return;
    const data=await addTodo({
      variables:{text: todoText},
      refetchQueries:[
        { query: GET_TODOS }
      ]
    });
    console.log('added todo',data);
    //setTodoText('');
  }

  async function handleDeleteTodo({id}){
    const isConfirmed=window.confirm('Do You Want To Delete this Todo?');
    if(isConfirmed){
      const data=await deleteTodo({
        variables:{id},
        update: cache => {
          const prevData=cache.readQuery({query : GET_TODOS})
          const newTodos=prevData.react_insta_Schema_todos.filter(todo => todo.id !== id);
          cache.writeQuery({query:GET_TODOS,data:{react_insta_Schema_todos:newTodos}});
        }
      });
      console.log('deleted todo',data);
    }
  }

  if(loading) return <div>Loading Todos...</div>
  if(error)return <div>Error Fetching todos!</div>


  return (
    <div className="vh-100 code flex flex-column
     items-center bg-purple white pa4 fl-1">
      <h1 className="f2-l">GraphQl CheckList<span role="img" aria-label="Checkmark">✅</span></h1>
      {/*Todos Form*/}
      <form onSubmit={handleAddTodo} className="mb3">
        <input className="pa2 f4 b--dashed" type="text"
        placeholder="Write your Todo" onChange={event => setTodoText(event.target.value)} value={todoText} />
        <button className="pa2 f4 bg-green" type="submit">Create</button>
      </form>
      {/* Todos List*/}
      <div className="flex items-center justify-center flex-column">
      {data.react_insta_Schema_todos.map(todo =>(
        <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
          <span className={`pointer list pa1 f3 ${todo.done && 'strike'}`}>
            {todo.text}
          </span>
          <button className="bg-transparent bn f4" onClick={() => handleDeleteTodo(todo)}><span className=" red">&times;</span></button>
        </p>
      ))}
      </div>
    </div>
  );
}

export default App;
