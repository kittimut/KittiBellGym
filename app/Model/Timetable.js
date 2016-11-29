'use strict'

const Lucid = use('Lucid')

class Timetable extends Lucid {
  day() {
    return this.belongsTo('App/Model/Day')
  }

   gymClasses() {
    return this.belongsTo('App/Model/GymClass')
  }

   user() {
    return this.belongsTo('App/Model/User')
  }

}

module.exports = Timetable
