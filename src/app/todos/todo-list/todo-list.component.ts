import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Todo } from '../todo.model';
import { TodoService } from '../todo.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  todos: Todo[] = [];
  isLoading = false;
  totaltodos = 0;
  todosPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private todosSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public todosService: TodoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.todosService.getTodos(this.todosPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    console.log(this.userId);
    this.todosSub = this.todosService
      .getTodoUpdateListener()
      .subscribe((todoData: { todos: Todo[]; todoCount: number }) => {
        this.isLoading = false;
        this.totaltodos = todoData.todoCount;
        this.todos = todoData.todos;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        console.log(this.userIsAuthenticated);
        this.userId = this.authService.getUserId();
        console.log(this.userId);
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.todosPerPage = pageData.pageSize;
    this.todosService.getTodos(this.todosPerPage, this.currentPage);
  }

  onDelete(todoId: string) {
    this.isLoading = true;
    this.todosService.deleteTodo(todoId).subscribe(() => {
      this.todosService.getTodos(this.todosPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.todosSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
