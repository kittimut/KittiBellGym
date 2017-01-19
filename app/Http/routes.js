'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.get('/', 'TimetableController.index')
Route.get('/timetable/create', 'TimetableController.create').middleware('auth')
Route.post('/timetable/create', 'TimetableController.doCreate').middleware('auth')
Route.get('/timetable/:id/edit', 'TimetableController.edit').middleware('auth')
Route.post('/timetable/:id/edit', 'TimetableController.doEdit').middleware('auth')
Route.get('/timetable/:id', 'TimetableController.show')
Route.get('/timetable/:id/delete', 'TimetableController.doDelete').middleware('auth')

Route.get('/register', 'UserController.register')
Route.get('/login', 'UserController.login')
Route.post('/register', 'UserController.doRegister')
Route.post('/login', 'UserController.doLogin')
Route.get('/logout', 'UserController.doLogout')

Route.group('ajax', function () {
  Route.delete('/timetable/:id/delete', 'TimetableController.ajaxDelete').middleware('auth')
  Route.post('/login', 'UserController.ajaxLogin')
}).prefix('/ajax')