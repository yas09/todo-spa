$('#new-todo-form').submit(function(e) {
    e.preventDefault();
    var todoItem = $(this).serialize(); // serializes form to string to be sent to the server through ajax request
    $.post('/todos', todoItem, function(data){
        $('#todo-list').append(
            `
            <li class="list-group-item">
				<form action="/todos/${data._id}" method="POST" class="edit-todo-form">
					<div class="form-group input-group">
						<input type="text" value="${data.text}" name="todo[text]" class="form-control">
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
    })
});

$('#todo-list').on('click', '.edit-button', function() {
    $(this).parent().siblings('.edit-todo-form').toggle();

});

$('#todo-list').on('submit', '.edit-todo-form', function(e) {
    e.preventDefault();
    var todoItem = $(this).serialize();
    var actionUrl = $(this).attr('action');
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
                    <input type="text" value="${data.text}" name="todo[text]" class="form-control">
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

$('#todo-list').on('submit', '.delete-form', function(e) {
    e.preventDefault();
    var confirmResponse = confirm('Are you sure?');
    if (confirmResponse) {
        var actionUrl = $(this).attr('action');
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
