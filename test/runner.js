var Acl = require('../')
  , tests = require('./tests')

describe('MongoDB', function () {
  before(function (done) {
    var self = this
      , mongodb = require('mongodb')

    mongodb.connect('mongodb://localhost:27017/acltest',function(error, db) {
      db.dropDatabase(function () {
        self.backend = new Acl.mongodbBackend(db, "acl")
        done()
      })
    })
  })

  run()
})


describe('Mongoose ODM', function () {
  before(function (done) {
    var self = this
      , mongoose = require('mongoose')

    mongoose.connect('mongodb://localhost:27017/aclMongooseTest')
    var db = mongoose.connection;
    db.once('open',function() {
      db.db.dropDatabase(function () {
        self.backend = new Acl.mongooseBackend(mongoose, "acl")
        done()
      })
    })
  })

  run()
})


describe('Redis', function () {
  before(function (done) {
    var self = this
      , options = {
          host: '127.0.0.1',
          port: 6379,
          password: null
        }
      , Redis = require('redis')


    var redis = Redis.createClient(options.port, options.host,  {no_ready_check: true} )

    function start(){
      self.backend = new Acl.redisBackend(redis)
      done()
    }

    if (options.password) {
      redis.auth(options.password, start)
    } else {
      start()
    }
  })

  run()
})


describe('Memory', function () {
  before(function () {
    var self = this
      self.backend = new Acl.memoryBackend()
  })

  run()
})

function run() {
  Object.keys(tests).forEach(function (test) {
    tests[test]()
  })
}
