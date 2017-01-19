'use strict'

const Database = use('Database')
const GymClass = use('App/Model/GymClass')
const Timetable = use('App/Model/Timetable')
const User = use('App/Model/User')
const Day = use('App/Model/Day')
const Validator = use('Validator')

class TimetableController {

  * index(request, response) {
    const days = yield Day.all()
    const gymClasses =  yield GymClass.all()

    for(let day of days) {
      const timetables = yield day.timetable().orderBy('hour','asc').fetch()
      for(let timetable of timetables) {
        const gymClassObject = yield GymClass.find(timetable.gym_clas_id)
        timetable.className = gymClassObject.className
      }
      day.timetables = timetables.toJSON()
      day.gymClasses = gymClasses.toJSON()
    }

    yield response.sendView('main', {
      name: '',
      days: days.toJSON()
    })  
  }

  * create (request, response) {
    const days =  yield Day.all()
    const gymClasses = yield GymClass.all()
    yield response.sendView('timetableCreate', {
      days: days.toJSON(),
      gymClasses: gymClasses.toJSON()
    })
  }

  * doCreate (request, response) {
    const timetableData = request.except('_csrf')

    const rules = {
      day_id: 'required',
      hour: 'required',
      gym_clas_id: 'required'
    }

    const validation = yield Validator.validateAll(timetableData, rules)

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
      response.redirect('back')
      return
    }

    timetableData.user_id = request.currentUser.id
    const timetable = yield Timetable.create(timetableData)
    response.redirect('/')
  }

  * edit (request, response) {
    const id = request.param('id')
    const timetable = yield Timetable.find(id)
    const days = yield Day.all()
    const gymClasses = yield GymClass.all()
    
    if (request.currentUser.id !== timetable.user_id) {
      response.unauthorized('Access denied.')
      return
    }

    yield response.sendView('timetableEdit', {
      timetable: timetable.toJSON(),
      gymClasses: gymClasses.toJSON(),
      days: days.toJSON()
    })
  }

  * doEdit (request, response) {
    const timetableData = request.except('_csrf')

    const rules = {
      day_id: 'required',
      hour: 'required',
      gym_clas_id: 'required'
    }

    const validation = yield Validator.validateAll(timetableData, rules)

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
      response.redirect('back')
      return
    }

    const id = request.param('id');
    const timetable = yield Timetable.find(id)
    
    timetable.day_id = timetableData.day_id
    timetable.hour = timetableData.hour
    timetable.gym_clas_id = timetableData.gym_clas_id

    yield timetable.save()
    
    response.redirect('/')
  }

  * show (request, response) {
    const id = request.param('id')
    const timetable = yield Timetable.find(id)
    const gymClass = yield GymClass.find(timetable.gym_clas_id)
    const day = yield Day.find(timetable.day_id)
    const trainer = yield User.find(timetable.user_id)

    yield gymClass.related('timetable').load()

    timetable.gymClass = gymClass.toJSON()
    timetable.day = day.toJSON()
    timetable.trainer = trainer.toJSON()

    yield response.sendView('timetableShow', {
      timetable: timetable.toJSON(),
      day: day.toJSON()
    })
  }

  * doDelete (request, response) {
    const id = request.param('id');
    const timetable = yield Timetable.find(id)

    if (request.currentUser.id !== timetable.user_id) {
      response.unauthorized('Access denied.')
      return
    }

    yield timetable.delete()
    response.redirect('/')
  }

  * ajaxDelete(request, response) {
    const id = request.param('id');
    const timetable = yield Timetable.find(id);
    if(timetable){
      if(request.currentUser.id !== timetable.user_id){
        response.ok({
           succes:false 
        })
        return;
      }
      yield timetable.delete()
      
    response.ok({
      succes: true
    })
  }
  
}
}

module.exports = TimetableController