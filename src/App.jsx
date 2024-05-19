import { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  // const [activeTodos, setActiveTodos] = useState([]);
  const [checkedTodos, setCheckedTodos] = useState([]);
  const [allFilteredTodos, setallFilteredTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  console.log("COMPLETED TODOS ==> ", completedTodos);
  console.log("FILTERED TODOS ==> ", allFilteredTodos);

  const handleSubmit = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newTodos = [...todos, form.get("todo")];
    setTodos(newTodos);
    setallFilteredTodos(newTodos);
  };

  // Remove todo from the list
  const handleRemove = todo => {
    // Remove from all todo list
    const newTodos = todos.filter(item => item !== todo);
    setTodos(newTodos);

    // Remove from filtered todo list
    const newFilteredTodos = allFilteredTodos.filter(item => item !== todo);
    setallFilteredTodos(newFilteredTodos);

    // remove from checked or active tood list
    if (checkedTodos.length > 0) {
      const filteredCheckList = checkedTodos.filter(list => list !== todo);
      setCheckedTodos(filteredCheckList);
    }

    // remove from completed todo list
    if (completedTodos.length > 0) {
      const filteredCheckList = completedTodos.filter(list => list !== todo);
      setCompletedTodos(filteredCheckList);
    }

    if (completedTodos.length === 1) {
      setallFilteredTodos(newTodos);
    }
  };

  // handle checkbox for active todos
  const handleCheck = (event, todo) => {
    if (event.target.checked) {
      setCheckedTodos([...checkedTodos, todo]);
    } else {
      const filteredTodos = checkedTodos.filter(
        checkedTodo => checkedTodo !== todo
      );
      setCheckedTodos(filteredTodos);
    }
  };

  // Handle active todos
  const handleActive = () => {
    if (checkedTodos.length > 0) {
      setallFilteredTodos(checkedTodos);
    }
  };

  // handleAllTodos
  const handleAllTodos = () => {
    setallFilteredTodos(todos);
  };

  // Handle completed todos
  const handleCompletedTodos = () => {
    const todoCompleted = [...completedTodos, ...checkedTodos];
    if (checkedTodos.length > 0) {
      setCompletedTodos(todoCompleted);
      setallFilteredTodos(todoCompleted);
      setCheckedTodos([]);
    } else {
      if (todoCompleted.length > 0) {
        setallFilteredTodos(todoCompleted);
      }
    }
  };

  // Clear all completed todos
  const handleClearCompleted = () => {
    console.log("ALL FILTERED TODOS", todos);

    const completedFilteredTodos = todos.filter(
      item => !completedTodos.includes(item)
    );

    setallFilteredTodos(completedFilteredTodos);
    setTodos(completedFilteredTodos);
    if (completedTodos.length > 0) {
      setCompletedTodos([]);
    }
  };

  return (
    <div className="w-[480px]">
      <header className="flex justify-between">
        <h1>todo</h1>
        <button type="button">
          <img src="/images/icon-moon.svg" alt="moon icon" />
        </button>
      </header>
      <main>
        <form
          onSubmit={handleSubmit}
          className="bg-white py-3 px-4 flex items-center rounded-sm shadow-sm"
        >
          <input
            type="text"
            name="todo"
            className="w-full outline-none border-none bg-transparent"
            placeholder="Create a new todo..."
          />
          <button
            type="submit"
            className="ml-4 py-1 px-2 rounded-sm bg-gray-100 hover:bg-bright-blue-lth hover:text-gray-50 transition-all text-sm"
          >
            Add
          </button>
        </form>

        {/* To do list */}
        {Array.isArray(allFilteredTodos) && allFilteredTodos.length > 0 ? (
          <div className="my-5 bg-white shadow-lg rounded-md">
            {allFilteredTodos.map(todo => (
              <div
                key={todo}
                className="flex justify-between items-center p-4 border-b-gray-200 border-b-[0.03em]"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="bg-green-500 ..."
                    onChange={event => handleCheck(event, todo)}
                    checked={
                      checkedTodos.length > 0
                        ? checkedTodos.includes(todo)
                        : completedTodos.includes(todo)
                    }
                  />
                  <span
                    className={`pl-4 pr-3 ${
                      completedTodos.includes(todo) ? "line-through" : ""
                    }`}
                  >
                    {todo}
                  </span>
                </div>
                <button
                  className="w-4 h-4 min-w-4"
                  type="button"
                  onClick={() => handleRemove(todo)}
                >
                  <img
                    src="/images/icon-cross.svg"
                    alt={todo}
                    className="w-full"
                  />
                </button>
              </div>
            ))}
            {/* Bottom settings button */}
            <div className="flex items-center justify-between p-3 text-sm text-gray-700 font-lg">
              <span>5 minutes left</span>
              <div className="flex item-center justify-center">
                <button type="button" onClick={() => handleAllTodos()}>
                  All
                </button>
                <button
                  type="button"
                  className="px-3"
                  onClick={() => handleActive()}
                >
                  Active
                </button>
                <button type="button" onClick={() => handleCompletedTodos()}>
                  Completed
                </button>
              </div>
              <button type="button" onClick={() => handleClearCompleted()}>
                Clear completed
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center p-4 border-b-gray-200 border-b-[0.03em] text-gray-600">
            No todo list added yet.
          </div>
        )}
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
