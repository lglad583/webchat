
"use strict";
const mongodb = require('mongodb');
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;
class Db{

  constructor(){
    this.mongoClient = mongodb.MongoClient;
    this.ObjectID = mongodb.ObjectID;
    this.mongoURL ="mongodb://leeglad:spanky730@webchat-shard-00-00-jso7f.mongodb.net:27017,webchat-shard-00-01-jso7f.mongodb.net:27017,webchat-shard-00-02-jso7f.mongodb.net:27017/test?ssl=true&replicaSet=webchat-shard-0&authSource=admin";
  }

  onConnect(callback){
    this.mongoClient.connect(this.mongoURL, function(err, db){
      assert.equal(null, err);
    callback(db,ObjectID);
  });
  }
}
module.exports = new Db();
