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
  const [draggedIndex, setDraggedIndex] = useState(null);

  /**
   * chenge the background images based on the device viewport width
   * set teh background image in th body
   */
  const handleResponsiveImage = () => {
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    if (viewportWidth < 576 && localStorage.theme === "dark") {
      document.body.style.backgroundImage = `url("/images/bg-mobile-dark.jpg")`;
    }

    if (viewportWidth < 576 && localStorage.theme === "light") {
      document.body.style.backgroundImage = `url("/images/bg-mobile-light.jpg")`;
    }
    if (viewportWidth >= 576 && localStorage.theme === "dark") {
      document.body.style.backgroundImage = `url("/images/bg-desktop-dark.jpg")`;
    }

    if (viewportWidth >= 576 && localStorage.theme === "light") {
      document.body.style.backgroundImage = `url("/images/bg-desktop-light.jpg")`;
    }
  };

  const handleInputChange = e => {
    setInputValue(e.target.value);
    if (e.target.value.length > 0) {
      setErrorMsg("");
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    // const form = new FormData(event.currentTarget);
    // Check a user is inserting any value or not
    if (inputValue.length > 0) {
      console.log("INPUT VALUE ==> ", inputValue);

      // If an user inserted any value then check the value
      // is already in the todo list or not
      if (!todos.includes(inputValue)) {
        const newTodos = [...todos, inputValue];
        setTodos(newTodos);
        setallFilteredTodos(newTodos);
        setInputValue("");
        // Set todo, and filtered values to local storage
        localStorage.setItem("todos", JSON.stringify(newTodos));
        localStorage.setItem("allFilteredTodos", JSON.stringify(newTodos));
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
    const newTodos =
      todos.length > 0 ? todos.filter(item => item !== todo) : [];
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));

    // Remove a single todo from all todo list of local storage

    // Remove from filtered todo list
    const newFilteredTodos =
      allFilteredTodos.length > 0 &&
      allFilteredTodos.filter(item => item !== todo);
    setallFilteredTodos(newFilteredTodos);
    localStorage.setItem("allFilteredTodos", JSON.stringify(newFilteredTodos));

    // remove from checked or active tood list
    if (checkedTodos.length > 0) {
      const filteredCheckList =
        checkedTodos.length > 0 && checkedTodos.filter(list => list !== todo);
      setCheckedTodos(filteredCheckList);
      localStorage.setItem("checkedTodos", JSON.stringify(filteredCheckList));
    }

    // remove from completed todo list
    if (completedTodos.length > 0) {
      const filteredCheckList =
        completedTodos.length > 0 &&
        completedTodos.filter(list => list !== todo);
      setCompletedTodos(filteredCheckList);
      localStorage.setItem("completedTodos", JSON.stringify(filteredCheckList));
    }

    // Move to all todo list when the last item is removed
    if (completedTodos.length === 1) {
      setallFilteredTodos(newTodos);
      localStorage.setItem("filteredTodos", JSON.stringify(newTodos));
    }
  };

  // handle checkbox for active todos
  const handleCheck = (event, todo) => {
    // if any todo is checked
    if (event.target.checked) {
      setCheckedTodos([...checkedTodos, todo]);

      // Update checked/active todos in localStorage
      const checkedLocalStg = localStorage.getItem("checkedTodos");
      const checkedTodosLocalStg = checkedLocalStg
        ? JSON.parse(checkedLocalStg)
        : [];
      const modifiedTodo = [...checkedTodosLocalStg, todo];
      localStorage.setItem("checkedTodos", JSON.stringify(modifiedTodo));
    } else {
      // If any todo is unchecked
      const filteredTodos =
        checkedTodos.length > 0
          ? checkedTodos.filter(checkedTodo => checkedTodo !== todo)
          : [];

      // If any completed todo in unchecked
      const filteredCompletedTodos =
        completedTodos.length > 0
          ? completedTodos.filter(compTodo => compTodo !== todo)
          : [];

      setCheckedTodos(filteredTodos);
      setCompletedTodos(filteredCompletedTodos);

      /**
       * Save checked/active todos in localStorage
       */
      localStorage.setItem("checkedTodos", JSON.stringify(filteredTodos));
      localStorage.setItem(
        "completedTodos",
        JSON.stringify(filteredCompletedTodos)
      );
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
    console.log("todo completed = => ", completedTodos);

    const todoCompleted = [...completedTodos, ...checkedTodos];
    console.log("completed todo inside an handler ==> ", todoCompleted);

    if (checkedTodos.length > 0) {
      setCompletedTodos(todoCompleted);
      setallFilteredTodos(todoCompleted);
      setCheckedTodos([]);

      /**
       * set completed todos to localStorage
       * set filtered todos to localStorage
       * set checked todos to local storage
       */

      localStorage.setItem("completedTodos", JSON.stringify(todoCompleted));
      localStorage.setItem("allFilteredTodos", JSON.stringify(todoCompleted));
      localStorage.setItem("checkedTodos", JSON.stringify([]));
    } else {
      if (todoCompleted.length > 0) {
        setallFilteredTodos(todoCompleted);
      }
    }
    setActiveFilter("completed");
  };

  // Clear all completed todos
  const handleClearCompleted = () => {
    // Remove completed todos from local state
    const completedFilteredTodos =
      todos.length > 0 && todos.filter(item => !completedTodos.includes(item));

    setallFilteredTodos(completedFilteredTodos);
    setTodos(completedFilteredTodos);

    // Remove from completedTodos, todos,  local storage
    localStorage.setItem(
      "allFilteredTodos",
      JSON.stringify(completedFilteredTodos)
    );
    localStorage.setItem("todos", JSON.stringify(completedFilteredTodos));

    if (completedTodos.length > 0) {
      setCompletedTodos([]);
      localStorage.setItem("compltedTodos", JSON.stringify([]));
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
    // Toggle the dark mode images
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

    /**
     * Change background images based on device viewport width
     */
    handleResponsiveImage();
  };

  /**
   * Drag and drop features to the todo lists with HTML drap and drp API
   * handleDragStart: event handler is used to set the index
   * of the item to the draggedIndex state that we want to drag
   * HandleDragOver: event handler is used to prevent the default behavior
   * to allow the drop functionality
   * HandleDrop: event handler is used to insert the todo list item into
   * new position and remove it from the original position
   */

  const handleDragStart = index => {
    setDraggedIndex(index);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    const newFilteredTodos = [...allFilteredTodos];
    const [draggedTodo] = newFilteredTodos.splice(draggedIndex, 1);
    newFilteredTodos.splice(index, 0, draggedTodo);

    setallFilteredTodos(newFilteredTodos);
    localStorage.setItem("allFilteredTodos", JSON.stringify(newFilteredTodos));
    localStorage.setItem("todos", JSON.stringify(newFilteredTodos));
    setDraggedIndex(null);
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

  useEffect(() => {
    // For changing the background image according to viewport width
    handleResponsiveImage();

    // change the background image when resize browser window
    window.addEventListener("resize", handleResponsiveImage);
    return () => {
      window.removeEventListener("resize", handleResponsiveImage);
    };
  }, []);

  // Fetch data from the local storage
  useEffect(() => {
    /**
     * Fetch todos from the local storage
     * update the local state with setTodos
     */
    const todoLocalStorage = localStorage.getItem("todos");
    const todoData = todoLocalStorage ? JSON.parse(todoLocalStorage) : [];

    console.log("TODO DATA => ", todoData);

    if (todoData) {
      setTodos(todoData);
      setallFilteredTodos(todoData);
    }

    /**
     * Fetch filtered todos from the local storage
     * update the local state with setallFilteredTodos
     */
    // const filteredTodosLocalStorage = localStorage.getItem("allFilteredTodos");
    // const filteredTodos = filteredTodosLocalStorage
    //   ? JSON.parse(filteredTodosLocalStorage)
    //   : [];

    // if (filteredTodos) {
    //   setallFilteredTodos(filteredTodos);
    // }

    /**
     * Fetch checked todos from the local storage
     * update the local state with setCheckedTodos
     */
    const checkedTodosLocalStg = localStorage.getItem("checkedTodos");
    const checkedTodosParsed = checkedTodosLocalStg
      ? JSON.parse(checkedTodosLocalStg)
      : [];
    setCheckedTodos(checkedTodosParsed);

    /**
     * Fetch completed todos from the local storage
     * update the local state with setallFilteredTodos
     */
    const checkedCompTodosLocalStg = localStorage.getItem("completedTodos");
    const checkedCompTodosParsed = checkedCompTodosLocalStg
      ? JSON.parse(checkedCompTodosLocalStg)
      : [];
    setCompletedTodos(checkedCompTodosParsed);
  }, []);

  return (
    <div className="px-4 mt-8 w-[320px] sm:w-[480px]">
      {/* Header section */}
      <header className="flex justify-between mb-10">
        <h1 className="text-2xl sm:text-4xl uppercase font-bold text-gray-50 tracking-[12px]">
          todo
        </h1>
        <button type="button" onClick={() => handleToggleTheme()}>
          <img ref={imgRef} src="/images/icon-moon.svg" alt="moon icon" />
        </button>
      </header>

      {/* Main content section */}
      <main>
        {errorMsg.length > 0 ? (
          <div className="w-full text-center p-2 tracking-wider font-semibold bg-gray-300 mb-2 rounded-sm text-sm text-red-600">
            {errorMsg}
          </div>
        ) : (
          ""
        )}

        {/* Todo submit form */}
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

        {/* Show message if no active todo, and completed todo exist */}

        {/* To do list */}
        {Array.isArray(allFilteredTodos) && allFilteredTodos.length > 0 ? (
          <div className="my-5 bg-white shadow-lg rounded-md dark:bg-dark-desaturated-blue-dth border-[1px] border-solid border-gray-50 dark:border-none">
            {allFilteredTodos.map((todo, index) => (
              <div
                key={todo}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={event => handleDragOver(event)}
                onDrop={event => handleDrop(event, index)}
                className={`flex justify-between items-center p-3 border-b-gray-200 border-b-[1px] dark:border-b-dark-grayish-blue-two-dth cursor-move group hover:bg-transparent transition duration-500`}
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
                        : completedTodos.length > 0
                        ? completedTodos.includes(todo)
                        : false
                    }
                  />
                  {/* Custom checkbox */}
                  <span className="after:content-[''] checkmark"></span>
                  <span
                    className={`pl-10 pr-3 cursor-pointer dark:text-gray-200 ${
                      completedTodos.length > 0 && completedTodos.includes(todo)
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
            <div className="flex items-center flex-wrap justify-between p-3 text-sm text-dark-grayish-blue-dth font-lg dark:text-gray-200">
              <span className="order-1">{`${handleItemsLeft()} items left`}</span>
              <div className="flex item-center justify-center order-3 sm:order-2  flex-grow mt-3 sm:mt-0 pt-2 sm:pt-0 border-t-[1px] border-solid dark:border-t-dark-grayish-blue-two-dth sm:border-none">
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
                  disabled={checkedTodos.length < 1}
                  className={`${
                    checkedTodos.length < 1 ? "cursor-not-allowed" : ""
                  } px-3 ${
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
                  completedTodos.length < 1 ? "cursor-not-allowed" : ""
                } order-2 sm:order-3 ${
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
