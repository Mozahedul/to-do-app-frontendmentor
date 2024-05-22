import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const imgRef = useRef(null);
  const [todos, setTodos] = useState([]);
  // const [activeTodos, setActiveTodos] = useState([]);
  const [checkedTodos, setCheckedTodos] = useState([]);
  const [allFilteredTodos, setallFilteredTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  console.log("ACTIVE FILTER ==> ", activeFilter);

  const handleInputChange = e => {
    setInputValue(e.target.value);
    if (e.target.value.length > 0) {
      setErrorMsg("");
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (inputValue.length > 0) {
      if (!todos.includes(inputValue)) {
        const newTodos = [...todos, form.get("todo")];
        setTodos(newTodos);
        setallFilteredTodos(newTodos);
        setInputValue("");
      } else {
        setErrorMsg("Your entered todo already exists");
      }
    } else {
      setErrorMsg("Please enter a valid todo!");
    }
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
    setActiveFilter("active");
  };

  // handleAllTodos
  const handleAllTodos = () => {
    setallFilteredTodos(todos);
    setActiveFilter("all");
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
    setActiveFilter("completed");
  };

  // Clear all completed todos
  const handleClearCompleted = () => {
    const completedFilteredTodos = todos.filter(
      item => !completedTodos.includes(item)
    );

    setallFilteredTodos(completedFilteredTodos);
    setTodos(completedFilteredTodos);
    if (completedTodos.length > 0) {
      setCompletedTodos([]);
    }

    setActiveFilter("clearCompleted");
  };

  /**
   * select the items dynamically that lefts after calculation with
   * total number of todo list and the todos completed
   */
  const handleItemsLeft = () => {
    const itemsLeft = todos.length > 0 && todos.length - completedTodos.length;
    return itemsLeft;
  };

  /**
   * To handle manual theme toggling
   * From light to dark mode and vice versa
   * Add a custom property named 'theme' in localStorage
   * Add and remove dark and light mode according to button toggling
   *
   */
  const handleToggleTheme = () => {
    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      imgRef.current.src = "/images/icon-moon.svg";
    } else {
      localStorage.theme = "dark";
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      imgRef.current.src = "/images/icon-sun.svg";
    }
  };

  /**
   * dark mode selection according to user's
   * system or browser's preferences
   * window.matchMedia API has been used to
   * select the user's system dark mode
   */
  useEffect(() => {
    if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
      localStorage.theme = "dark";
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      imgRef.current.src = "/images/icon-sun.svg";
    }
    setActiveFilter("all");
  }, []);

  return (
    <div className="w-[480px]">
      <header className="flex justify-between mb-10">
        <h1 className="text-4xl uppercase font-bold text-gray-50 tracking-[12px]">
          todo
        </h1>
        <button type="button" onClick={() => handleToggleTheme()}>
          <img ref={imgRef} src="/images/icon-moon.svg" alt="moon icon" />
        </button>
      </header>
      <main>
        {errorMsg.length > 0 ? (
          <div className="w-full text-center p-2 tracking-wider font-semibold bg-gray-300 mb-2 rounded-sm text-sm text-red-600">
            {errorMsg}
          </div>
        ) : (
          ""
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white py-3 px-4 flex items-center rounded-md shadow-sm dark:bg-dark-desaturated-blue-dth"
        >
          <input
            type="text"
            name="todo"
            value={inputValue}
            onChange={e => handleInputChange(e)}
            className="w-full outline-none border-none bg-transparent dark:text-gray-50"
            placeholder="Create a new todo..."
          />
          <button
            type="submit"
            className="ml-4 py-1 px-2 rounded-sm bg-gray-100 dark:bg-dark-grayish-blue-ultra-dth dark:text-gray-50 dark:hover:bright-blue-lth dark:hover:text-light-gray-lth hover:bg-bright-blue-lth hover:text-gray-50 transition-all text-sm focus:ring-2 focus:ring-gradient-color-2"
          >
            Add
          </button>
        </form>

        {/* To do list */}
        {Array.isArray(allFilteredTodos) && allFilteredTodos.length > 0 ? (
          <div className="my-5 bg-white shadow-lg rounded-md dark:bg-dark-desaturated-blue-dth border-[1px] border-solid border-gray-50 dark:border-none">
            {allFilteredTodos.map(todo => (
              <div
                key={todo}
                className="flex justify-between items-center p-3 border-b-gray-200 border-b-[1px] dark:border-b-dark-grayish-blue-two-dth cursor-pointer group hover:bg-transparent transition duration-500"
              >
                <label className="flex items-center custom-checkbox">
                  {/* Default checkbox */}
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    onChange={event => handleCheck(event, todo)}
                    checked={
                      checkedTodos.length > 0
                        ? checkedTodos.includes(todo)
                        : completedTodos.includes(todo)
                    }
                  />
                  {/* Custom checkbox */}
                  <span className="after:content-[''] checkmark"></span>
                  <span
                    className={`pl-10 pr-3 cursor-pointer dark:text-gray-200 ${
                      completedTodos.includes(todo)
                        ? "line-through text-gray-500 font-normal"
                        : ""
                    }`}
                  >
                    {todo}
                  </span>
                </label>
                <button
                  className="w-4 h-4 min-w-4 hidden group-hover:block"
                  type="button"
                  onClick={() => handleRemove(todo)}
                >
                  <img
                    src="/images/icon-cross.svg"
                    alt={todo}
                    className="w-full img-close"
                  />
                </button>
              </div>
            ))}
            {/* Bottom settings button */}
            <div className="flex items-center justify-between p-3 text-sm text-gray-700 font-lg dark:text-gray-200">
              <span>{`${handleItemsLeft()} items left`}</span>
              <div className="flex item-center justify-center">
                <button
                  className={` ${
                    activeFilter === "all"
                      ? "text-bright-blue-lth font-bold"
                      : ""
                  }`}
                  type="button"
                  onClick={() => handleAllTodos()}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`px-3 ${
                    activeFilter === "active"
                      ? "text-bright-blue-lth font-bold"
                      : ""
                  }`}
                  onClick={() => handleActive()}
                >
                  Active
                </button>
                <button
                  className={`${
                    activeFilter === "completed"
                      ? "text-bright-blue-lth font-bold"
                      : ""
                  }`}
                  type="button"
                  onClick={() => handleCompletedTodos()}
                >
                  Completed
                </button>
              </div>
              <button
                className={`${
                  activeFilter === "clearCompleted"
                    ? "text-bright-blue-lth"
                    : ""
                }`}
                type="button"
                onClick={() => handleClearCompleted()}
              >
                Clear completed
              </button>
            </div>
          </div>
        ) : (
          <div className="flex mt-4 justify-between items-center p-4 bg-white shadow-sm dark:bg-dark-desaturated-blue-dth rounded-md text-gray-600 dark:text-gray-50 border-[1px] border-solid border-gray-50 dark:border-none">
            No todo list added yet.
          </div>
        )}
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
