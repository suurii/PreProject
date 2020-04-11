
function modelLoaded() {
    console.log('Model Loaded!');
}

function gotPose(poses) {
    console.log(poses);
}
let capture;
let poses_;

function setup() {
    createCanvas(650, 600);
    capture = createCapture(VIDEO);
    capture.hide();
    poseNet = ml5.poseNet(capture, modelLoaded);
    poseNet.on('pose', (poses) => {
        // tmp = poses[0].pose.keypoints;   

        for(let i = 0 ; i < poses.length ;i++){
            poses_ = poses[i];
            // console.log(poses_);
            if (poses_) {

                let pose = poses_.pose;
              
                //mid point
                let midpose = average2point(pose.leftShoulder,pose.rightShoulder); 
    
                // shoulder lenght
                let shoulderLenght = distance(pose.leftShoulder,pose.rightShoulder);
        
                let list_ = [];
        
                for(let i = 0 ; i < pose.keypoints.length ;i++){
                    let point = pose.keypoints[i].position;
                    let dist = distance(point,midpose);
                    list_.push({
                        dist : dist/shoulderLenght,
                        score : pose.keypoints[i].score
                    });
                    // console.log("point of "+ pose.keypoints[i].part + " " + dist)
            
                }
        
                for(let i = 0 ; i < list_.length ;i++){
                    if(list_[i].score >= .50){
                        console.log(pose.keypoints[i].part + " " + list_[i].dist.toFixed(3) + " " + list_[i].score.toFixed(3));
                    }
                }
            }

        }
    
    });

}


function distance(A,B){
    return sqrt((A.x-B.x)**2 + (A.y-B.y)**2);
}

function average2point(A,B){
    return {
        x : (A.x+B.x)/2,
        y : (A.y+B.y)/2
    };
}


function draw() {
    background(20,20,20);
    image(capture, 0, 0);
   
    if (poses_) {
        let pose = poses_.pose;
        fill(255, 0, 0);
        for (let i = 0; i < pose.keypoints.length; i++) {
            if(pose.keypoints[i].score >= .50){
                ellipse(pose.keypoints[i].position.x, pose.keypoints[i].position.y, 10);
            }
        }

        let midpose = average2point(pose.leftShoulder,pose.rightShoulder);
        fill(0,0,255);
        ellipse(midpose.x,midpose.y,10);
    }
}