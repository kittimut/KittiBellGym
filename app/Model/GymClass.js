'use strict'

const Lucid = use('Lucid')

class GymClass extends Lucid {
  timetable () {
    return this.hasMany('App/Model/Timetable')
  }
}

module.exports = GymClass
