const createwebhook = (req,res)=>{
    
    console.log("GitHub webhook received");
    const event = req.headers["x-github-event"]  //main line where the github web hook calls the post aip and the body contains the activities of the repo
    // const body = req.body;
    // // console.log("Event:", req.headers["x-github-event"]);
    // console.log("Event",event)
    // // console.log("Delivery ID:", req.headers["x-github-delivery"]);

    // if(event === 'ping'){
    //         console.log("Ping Received")
    // }
    // if(event === 'push'){
    //     console.log("Push Event Received")
    // }
    // if(event === 'pull_request'){
    //     console.log("Pull request")
    // }

    // // console.log("Payload:", req.body);

    // if(event === 'push'){
    //         console.log("Pusher Name :",body.pusher.name)
    //         console.log("Pushed Repo :",body.repository.full_name)
    //         console.log("Commit Details :",body.commits)
    // }

    

    res.status(200).json({
        message: "Webhook received",
    });

}

module.exports = {createwebhook};