'use strict'

const Lucid = use('Lucid')

class Day extends Lucid {
  timetable () {
    return this.hasMany('App/Model/Timetable')
  }
}

module.exports = Day
