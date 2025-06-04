"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PlusCircle,
  Trash2,
  Edit3,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Tag,
} from "lucide-react";
import { useClerk, useSession } from "@clerk/clerk-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClerkSupabaseClient } from "@/utils/supabaseClient";
import type { TodoItem } from "@/types/supabase";
import {
  getTodoItemsByUserId,
  createTodoItem,
  updateTodoItem,
  deleteTodoItem,
} from "@/services/todoItemService";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TodoPage = () => {
  const { user } = useClerk();
  const { session } = useSession();

  const [tasks, setTasks] = useState<TodoItem[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate] = useState(new Date()); // Keep for header display

  const activeSupabaseClient: SupabaseClient | null = useMemo(() => {
    if (session) {
      return createClerkSupabaseClient(() => session.getToken());
    }
    return null;
  }, [session]);

  useEffect(() => {
    if (user?.id && activeSupabaseClient) {
      setIsLoading(true);
      getTodoItemsByUserId(activeSupabaseClient, user.id)
        .then((data) => {
          setTasks(data || []);
        })
        .catch((error) => {
          console.error("Error fetching todo items:", error);
          setTasks([]); // Set to empty array on error
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user?.id, activeSupabaseClient]);

  const handleAddTask = async () => {
    if (newTaskText.trim() === "" || !user?.id || !activeSupabaseClient) return;
    try {
      const newItem = await createTodoItem(activeSupabaseClient, {
        user_id: user.id,
        task_description: newTaskText,
        is_completed: false,
      });
      if (newItem) {
        setTasks((prevTasks) => [...prevTasks, newItem]);
      }
      setNewTaskText("");
    } catch (error) {
      console.error("Error creating todo item:", error);
      // Optionally, show a toast notification to the user
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    if (!user?.id || !activeSupabaseClient) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const updatedTask = await updateTodoItem(activeSupabaseClient, taskId, {
        is_completed: !task.is_completed,
        completed_at: !task.is_completed ? new Date().toISOString() : undefined,
      });
      if (updatedTask) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === taskId ? updatedTask : t))
        );
      }
    } catch (error) {
      console.error("Error updating todo item:", error);
    }
  };

  const removeTask = async (taskId: string) => {
    if (!user?.id || !activeSupabaseClient) return;
    try {
      await deleteTodoItem(activeSupabaseClient, taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting todo item:", error);
    }
  };

  // Calendar related state (basic for now)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentMonthName = selectedDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();

  const getDaysArrayForMonth = () => {
    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) { daysArray.push(null); }
    for (let i = 1; i <= daysInMonth; i++) { daysArray.push(i); }
    return daysArray;
  };
  const calendarDays = getDaysArrayForMonth();

  if (!user && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        Please log in to view your ToDo list.
      </div>
    );
  }

  if (!activeSupabaseClient && session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        Initializing...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      {/* Main Content (No Sidebar) */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#2F2569] dark:text-green-400">ToDo List</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="relative">
              <Input type="search" placeholder="Search tasks..." className="pl-10 w-64 bg-white/70 dark:bg-slate-700/70 border-gray-300 dark:border-slate-600" />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <Bell size={18} className="mr-2" />
              Notifications
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task List Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add New Task Input */}
            <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-xl shadow-lg flex items-center space-x-3">
              <PlusCircle size={24} className="text-green-500" />
              <Input
                type="text"
                placeholder="Add a new task..."
                className="flex-grow border-0 focus:ring-0 bg-transparent dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                disabled={isLoading || !activeSupabaseClient}
              />
              <Button onClick={handleAddTask} className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2" disabled={isLoading || !activeSupabaseClient}>
                Add Task
              </Button>
            </div>

            {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Loading tasks...</p>}
            {!isLoading && tasks.filter(task => !task.is_completed).length === 0 && (
                 <p className="text-gray-500 dark:text-gray-400 text-center py-4">No pending tasks. Add some!</p>
            )}

            {/* Pending Tasks */}
            {!isLoading && tasks.filter(task => !task.is_completed).length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#2F2569] dark:text-green-300">Today's Tasks</h3>
                <ul className="space-y-3">
                  {tasks.filter(task => !task.is_completed).map((task) => (
                    <li
                      key={task.id}
                      className="bg-white/90 dark:bg-slate-800/90 p-4 rounded-xl shadow-md flex items-start space-x-4 transition-all hover:shadow-lg"
                    >
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.is_completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id!)}
                        className="mt-1 border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                        disabled={!activeSupabaseClient}
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <div>
                                <label
                                htmlFor={`task-${task.id}`}
                                className={`font-medium ${
                                    task.is_completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-100"
                                } cursor-pointer`}
                                >
                                {task.task_description}
                                </label>
                                {/* Details removed as not in TodoItem by default */}
                            </div>
                            {task.due_date && (
                                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-700/50 dark:text-green-300 px-2 py-1 rounded-full">
                                    {new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    {/* Or use: {new Date(task.due_date).toLocaleDateString()} if it's a date only */}
                                </span>
                            )}
                        </div>
                        {/* Image removed as not in TodoItem */}
                      </div>
                      <div className="flex items-center space-x-1 opacity-50 hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400" disabled={!activeSupabaseClient}>
                            <Edit3 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-500 hover:text-red-500 dark:hover:text-red-400" onClick={() => removeTask(task.id!)} disabled={!activeSupabaseClient}>
                            <Trash2 size={16} />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Completed Tasks */}
            {!isLoading && tasks.filter(task => task.is_completed).length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4 mt-8 text-[#2F2569] dark:text-green-300">Completed</h3>
                    <ul className="space-y-3">
                    {tasks.filter(task => task.is_completed).map((task) => (
                        <li
                        key={task.id}
                        className="bg-white/60 dark:bg-slate-700/60 p-4 rounded-xl shadow-sm flex items-start space-x-4 opacity-70"
                        >
                        <Checkbox
                            id={`task-${task.id}`}
                            checked={task.is_completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id!)}
                            className="mt-1 border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                            disabled={!activeSupabaseClient}
                        />
                        <div className="flex-grow">
                            <label
                            htmlFor={`task-${task.id}`}
                            className="font-medium line-through text-gray-500 dark:text-gray-400 cursor-pointer"
                            >
                            {task.task_description}
                            </label>
                            {/* Details removed */}
                        </div>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-500 hover:text-red-500 dark:hover:text-red-400" onClick={() => removeTask(task.id!)} disabled={!activeSupabaseClient}>
                            <Trash2 size={16} />
                        </Button>
                        </li>
                    ))}
                    </ul>
                </div>
            )}
          </div>

          {/* Calendar Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/70 dark:bg-slate-800/70 p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-semibold text-[#2F2569] dark:text-green-300">{currentMonthName} {selectedDate.getFullYear()}</h4>
                <div className="flex space-x-1">
                  <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}>
                    <ChevronLeft size={18} />
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}>
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    className={`p-2 rounded-full w-9 h-9 flex items-center justify-center text-sm transition-colors
                      ${!day ? "bg-transparent" : "hover:bg-green-100 dark:hover:bg-slate-700"}
                      ${day && new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day).toDateString() === new Date().toDateString()
                        ? "bg-green-500 text-white font-semibold"
                        : day && new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day).toDateString() === selectedDate.toDateString()
                        ? "bg-green-200 dark:bg-green-600/50 text-green-700 dark:text-white ring-2 ring-green-500"
                        : "text-gray-700 dark:text-gray-300"
                      }
                      ${!day ? "cursor-default" : ""}
                    `}
                    onClick={() => day && setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                    disabled={!day}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold mb-3 text-[#2F2569] dark:text-green-300">Quick Actions</h4>
                <Button variant="outline" className="w-full justify-start mb-2" disabled={!activeSupabaseClient}>
                    <Paperclip size={16} className="mr-2"/> Attach File to Task
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled={!activeSupabaseClient}>
                    <Tag size={16} className="mr-2"/> Manage Tags
                </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodoPage;
