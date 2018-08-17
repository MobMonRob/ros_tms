const express = require("express");
const setTimeout =  require("timers").setTimeout;
const roslib = require("roslib");
const http = require("http");
const url = require('url');
const ipware = require('ipware');
const bodyParser = require("body-parser");
const app = express();
const ipw = ipware();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.post("/rp", (req, res) => {
    const request_from = ((ipw.get_ip(req).clientIp).split(":")).pop();
    const local_ip = req.headers.host.split(":")[0]
    if(request_from != local_ip){
        res.json({
            "message":"This host has no authority to access this server"
        });
        return;
    }

    const remote_url = req.body.url;
    const room_name = req.body.name;
    const command = req.body.command;
    if(command == "robot_task"){
        let req_service = req.body.service;
        let req_service_type = req.body.service_type;
    }


    const ros_remote = new roslib.Ros({
        url: "ws://" + remote_url + ":9090"
    });
    ros_remote.on('connection', () => {
        console.log('Connected to websocket server');
    });
    
    ros_remote.on('error', error =>{
        console.log('Erro connecting to websocket server: ', error);
    });
    
    ros_remote.on('close', () => {
        console.log("Connection to websocket server was closed");
    });
    
    const get_id = new roslib.Service({
        ros: ros_remote,
        name: "get_id",
        serviceType: tms_nw_api/get_id
    });

    let get_id_req = new roslib.ServiceRequest({
        url: "http://" + local_ip
    });

    get_id_req.callService(get_id_req, id_res => {
        console.log(id_res);
        let anc_list = id_res.task_announce.split("$");
        let announce = "";
        let room_flag = 1;
        for(let anc in anc_list){
            if(anc == "object"){
                announce += id_res.object_announce;
            }else if(anc == "robot"){
                announce += id_res.robot_announce;
            }else if(anc == "place"){
                announce += id_res.place_announce;
            }else if(anc == "user"){
                announce += id_res.user_announce;
            }else{
                announce += anc;
                if(command == "search_object" || command == "robot_task"){
                    announce += room_name + "の"
                }
            }
        }

        if(command =="robot_task"){
            const remote_task = new roslib.Service({
                ros: ros_remote,
                name: req_service,
                serviceType: req_service_type
            });

            const remote_req = new roslib.ServiceRequest({
                "task_id": id_res.task_id,
                "robot_id": id_res.robot_id,
                "object_id":id_res.object_id,
                "user_id": id_res.user_id,
                "place_id": id_res.place_id,
                "priority": 0
            });

            remote_task.callService(remote_req, service_res =>{
                res.json = ({
                    "message":"OK",
                    "announce":announce
                });
            })


        }
        ros_remote.close();



});





            

    });

app.listen(5000);