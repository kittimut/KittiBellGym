'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  timetables(){
    return this.hasMany('App/Model/Timetable')
  }
}

module.exports = User
