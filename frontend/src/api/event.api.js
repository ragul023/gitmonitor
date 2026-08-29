import { get,post,put,patch,del } from "./api"

const getEvents = (data)=> get("/getEvents",data)


module.exports = {
    getEvents,
}