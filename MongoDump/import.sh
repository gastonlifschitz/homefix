#! /bin/bash

mongoimport --host database --db homefix --collection admins --type json --file /MongoDump/admins.json --jsonArray
mongoimport --host database --db homefix --collection employees --type json --file /MongoDump/employees.json --jsonArray
mongoimport --host database --db homefix --collection users --type json --file /MongoDump/users.json --jsonArray
mongoimport --host database --db homefix --collection chatinfos --type json --file /MongoDump/chatinfos.json --jsonArray
mongoimport --host database --db homefix --collection chatmessages --type json --file /MongoDump/chatmessages.json --jsonArray
mongoimport --host database --db homefix --collection neighbourhoods --type json --file /MongoDump/neighbourhoods.json --jsonArray
mongoimport --host database --db homefix --collection neighbours --type json --file /MongoDump/neighbours.json --jsonArray
mongoimport --host database --db homefix --collection proposals --type json --file /MongoDump/proposals.json --jsonArray
mongoimport --host database --db homefix --collection reviews --type json --file /MongoDump/reviews.json --jsonArray
mongoimport --host database --db homefix --collection rubros --type json --file /MongoDump/rubros.json --jsonArray
mongoimport --host database --db homefix --collection usergalleries --type json --file /MongoDump/usergalleries.json --jsonArray
mongoimport --host database --db homefix --collection superadmins --type json --file /MongoDump/superadmins.json --jsonArray
