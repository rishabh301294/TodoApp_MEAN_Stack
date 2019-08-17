import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { TodoService } from '../todo.service';
import { Todo } from '../todo.model';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit {
  enteredTodo = '';
  enteredStatus = '';
  todo: Todo;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private todoId: string;
  constructor(
    public todosService: TodoService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      todo: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      status: new FormControl(null, { validators: [Validators.required] }),
      subtodo: new FormControl(null, {
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.todoId = paramMap.get('todoId');
        if (paramMap.has('todoId')) {
        this.mode = 'edit';
        this.todoId = paramMap.get('todoId');
        this.isLoading = true;
        this.todosService.getTodo(this.todoId).subscribe(todoData => {
          this.isLoading = false;
          this.todo = {
            id: todoData._id,
            todo: todoData.todo,
            status: todoData.status,
            subtodo: todoData.subtodo,
            creator: todoData.creator
         };
          this.form.setValue({
            todo: this.todo.todo,
            status: this.todo.status,
            subtodo: this.todo.subtodo
          });
        });
      } else {
        this.mode = 'create';
        this.todoId = null;
      }
    });
  }


  onSaveTodo() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    // debugger;
    if (this.mode === 'create') {
      console.log(this.form.value.todo);
      this.todosService.addTodo(
        this.form.value.todo,
        this.form.value.status,
        this.form.value.subtodo
      );
    } else {
      this.todosService.updateTodo(
        this.todoId,
        this.form.value.todo,
        this.form.value.status,
        this.form.value.subtodo
      );
    }
    this.form.reset();
  }
}
