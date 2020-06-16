$(document).ready(function() {

    // Get all todos
    $.get('http://localhost:3000/todos', function(todos) {
        todos.forEach(function(todo){
            $('#todo-list').append(
                `
                <li class="list-group-item">
                    <form action="/todos/${todo._id}" method="POST" class="edit-todo-form">
                        <div class="form-group input-group">
                            <input type="text" value="${todo.text}" name="todo[text]" class="form-control" id="${todo._id}">
                            <span class="input-group-btn"><button class="btn btn-primary pull-right">Update Todo</button></span>
                        </div>
                    </form>
                    <span class="todo-content">
                        ${todo.text}
                    </span>
                    <div class="pull-right">
                        <button class="btn btn-sm btn-warning edit-button">Edit</button>
                        <form style="display: inline" method="POST" action="/todos/${todo._id}" class="delete-form">
                            <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                        </form>
                    </div>
                    <div class="clearfix"></div>
                </li>
                `
                )
        })
    });

    // Creates new todo 
    $('#new-todo-form').submit(function(e) {
        e.preventDefault();
        var todoItem = $(this).serialize(); // serializes form to string to be sent to the server through ajax request
        $.post('http://localhost:3000/todos', todoItem, function(data){
            if(!data.error) {
                $('#todo-list').append(
                    `
                    <li class="list-group-item">
                        <form action="/todos/${data._id}" method="POST" class="edit-todo-form">
                            <div class="form-group input-group">
                                <input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}>
                                <span class="input-group-btn"> <button class="btn btn-primary pull-right">Update Todo</button> </span>
                            </div>
                        </form>
                        <span class="todo-content">
                            ${data.text}
                        </span>
                        <div class="pull-right">
                            <button class="btn btn-sm btn-warning edit-button">Edit</button>
                            <form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-form">
                                <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                            </form>
                        </div>
                        <div class="clearfix"></div>
                    </li>
                    `
                );
                $('#new-todo-form').find('.form-control').val('');
            } else {
                $('#new-todo-form').prepend(`
						<div class="alert alert-danger">
						  <strong>${data.error}</strong> 
						</div>
					`);
                $('.alert-danger').delay(2000).fadeOut();
            }
        });
    });

    // Toggles edit button 
    $('#todo-list').on('click', '.edit-button', function() {
        $(this).parent().siblings('.edit-todo-form').toggle();
		$(this).blur();

    });

    // Renders update form when edit button is clicked, makes ajax call to update todo
    $('#todo-list').on('submit', '.edit-todo-form', function(e) {
        e.preventDefault();
        var todoItem = $(this).serialize();
        var actionUrl = 'http://localhost:3000' + $(this).attr('action');
        var $originalItem = $(this).parent('.list-group-item');
        $.ajax({
            url: actionUrl,
            data: todoItem,
            type: 'PUT',
            originalItem: $originalItem,
            success:  function(data) {
                this.originalItem.html(
                `
                <form action="/todos/${data._id}" method="POST" class="edit-todo-form">
                    <div class="form-group input-group">
                        <input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}>
                        <span class="input-group-btn"> <button class="btn btn-primary pull-right">Update Todo</button> </span>
                    </div>
                </form>
                <span class="todo-content">
                    ${data.text}
                </span>
                <div class="pull-right todo-buttons">
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                    <form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-form">
                        <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                    </form>
                </div>
                <div class="clearfix"></div>
                `
                )
            }
        });
    });

    // Makes ajax call to delete item, deletes element from page
    $('#todo-list').on('submit', '.delete-form', function(e) {
        e.preventDefault();
        var confirmResponse = confirm('Are you sure?');
        if (confirmResponse) {
            var actionUrl = 'http://localhost:3000' + $(this).attr('action');
            var $itemToDelete = $(this).closest('.list-group-item');
            $.ajax({
                url: actionUrl,
                type: 'DELETE',
                itemToDelete: $itemToDelete,
                success:  function(data) {
                    this.itemToDelete.remove();
                }
            });
        } else {
            $(this).find('button').blur();
        } 
            
    });

    // Search functionality on input 
    $('#search').on('input', function(e) {
        e.preventDefault();

        $.get(`http://localhost:3000/todos?keyword=${encodeURIComponent(e.target.value)}`, function(data) {
            $('#todo-list').html('');

            data.forEach(function(todo){
                $('#todo-list').append(
                    `
                    <li class="list-group-item">
                        <form action="/todos/${todo._id}" method="POST" class="edit-todo-form">
                            <div class="form-group input-group">
                                <input type="text" value="${todo.text}" name="todo[text]" class="form-control" id="${todo._id}">
                                <span class="input-group-btn"> <button class="btn btn-primary pull-right">Update Todo</button> </span>		
                            </div>			
                        </form>
                        <span class="todo-content">
                            ${todo.text}
                        </span>
                        <div class="pull-right">
                            <button class="btn btn-sm btn-warning edit-button">Edit</button>
                            <form style="display: inline" method="POST" action="/todos/${todo._id}" class="delete-form">
                                <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                            </form>
                        </div>
                        <div class="clearfix"></div>
                    </li>
                    `
                    );
            });
        });
    });
});
