# input data collector
A program for collecting data about the user's keyboard usage, created for Engineering Thesis purposes

## usage

before the first usage:
```
npm install
```
to run dev server:

```
npm run dev
```
application is available at [http://localhost:3000](http://localhost:3000)


## database initialization

Before the first usage one has to init the storage system. To do so make a http `GET` request to `127.0.0.1:3000/api/admin/init`