import Datastore from "nedb";
import path from "path";
import { remote } from "electron";

export var db = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath("userData"), "/data.db"),
});

export function insertDeployRecord(record) {
  db.insert(record, function (err, newDoc) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(record);
  });
}

export function updateDeployRecord(record) {}

export function deleteDeployRecord(record) {}

export function findDeployRecord() {
  console.log("find");
  return new Promise(function (resolve, reject) {
    db.find({
      tablename: "deploy_record",
    })
      .sort({
        date: -1,
      })
      .exec((err, ret) => {
        resolve(ret);
      });
  });
}

export function insertProject(project) {
  db.insert(project, function (err, newDoc) {
    if (err) {
      console.log(err);
      return false;
    }
    console.log(project);
    return true;
  });
}

export function findAllProjects() {
  console.log("findAllProjects");
  return new Promise(function (resolve, reject) {
    db.find({
      tablename: "projects",
    })
      .sort({
        date: -1,
      })
      .exec((err, ret) => {
        resolve(ret);
      });
  });
}
