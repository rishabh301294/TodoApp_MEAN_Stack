import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Todo } from './todo.model';
import { FormGroup } from '@angular/forms';

const BACKEND_URL = environment.apiURL + '/todos/';

@Injectable({ providedIn: 'root' })
export class TodoService {

  todoData: FormGroup;
  private todos: Todo[] = [];
  private todosUpdated = new Subject<{ todos: Todo[]; todoCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getTodos(todosPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${todosPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; todos: any; maxTodos: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(todoData => {
          return {
            todos: todoData.todos.map( todo => {
              return {
                todo: todo.todo,
                status: todo.status,
                creator: todo.creator,
                subtodo: todo.subtodo,
                id: todo._id
              };
            }),
            maxTodos: todoData.maxTodos
          };
        })
      )
      .subscribe(transformedTodoData => {
        this.todos = transformedTodoData.todos;
        this.todosUpdated.next({
          todos: [...this.todos],
          todoCount: transformedTodoData.maxTodos
        });
      });
  }

  getTodoUpdateListener() {
    return this.todosUpdated.asObservable();
  }

  getTodo(id: string) {
    return this.http.get<{
      _id: string;
      todo: string;
      status: string;
      subtodo: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addTodo(todo: string, status: string, subtodo: string) {
    const todoData = {
        todo: todo,
        status: status,
        subtodo: subtodo,
      };
    this.http
      .post<{ message: string; todo: Todo }>(
        BACKEND_URL,
        todoData
      )
      .subscribe(responseData => {
        this.router.navigate(['/list']);
      });
      // console.log(todoData);
  }

  updateTodo(id: string, todo: string, status: string, subtodo: string) {
    let todoData: Todo | FormData;
    todoData = {
        id: id,
        todo: todo,
        status: status,
        subtodo: subtodo,
        creator: null
      };
    this.http
      .put(BACKEND_URL + id, todoData)
      .subscribe(response => {
        this.router.navigate(['/list']);
      });
  }

  deleteTodo(todoId: string) {
    return this.http.delete(BACKEND_URL + todoId);
  }
}
