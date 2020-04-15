

function modelLoaded() {
    console.log('Model Loaded!');
}

function gotPose(poses) {
    console.log(poses);
}
let capture;
let poses_;
let out = [];
function setup() {
    createCanvas(650, 600);
    capture = createCapture(VIDEO);
    capture.hide();
    poseNet = ml5.poseNet(capture, modelLoaded);
    poseNet.on('pose', (poses) => {
        for (let i = 0; i < poses.length; i++) {
            poses_ = poses[i];
            // console.log(poses_)
            if (poses_) {
                let pose = poses_.pose;

                //mid point
                let midpose = average2point(pose.leftShoulder, pose.rightShoulder);

                // shoulder lenght
                let shoulderLenght = distance(pose.leftShoulder, pose.rightShoulder);

                let list_ = {};

                for (let i = 0; i < pose.keypoints.length; i++) {
                    let dist = distance(pose.keypoints[i].position, midpose);

                    list_[pose.keypoints[i].part] =  dist / shoulderLenght;
                    list_[pose.keypoints[i].part + '_score'] = pose.keypoints[i].score;
                }
                // console.log(list_);
                out = [...out, list_];
            }
        }
    });

}


function distance(A, B) {
    return sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2);
}

function average2point(A, B) {
    return {
        x: (A.x + B.x) / 2,
        y: (A.y + B.y) / 2
    };
}





function draw() {
    background(20, 20, 20);
    image(capture, 0, 0);

    if (poses_) {
        let pose = poses_.pose;
        fill(255, 0, 0);
        for (let i = 0; i < pose.keypoints.length; i++) {
            if (pose.keypoints[i].score >= .50) {
                ellipse(pose.keypoints[i].position.x, pose.keypoints[i].position.y, 10);
            }
        }

        let midpose = average2point(pose.leftShoulder, pose.rightShoulder);
        fill(0, 0, 255);
        ellipse(midpose.x, midpose.y, 10);
    }


    if (out.length >= 50) {
        // console.table(out);
        // console.table(out);
        // let jsonObj = JSON.stringify(out);

        var saveData = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            return function (data, fileName) {
                var json = JSON.stringify(data),
                    blob = new Blob([json], {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                // window.URL.revokeObjectURL(url);
            };
        }());
        // saveData(out,'a.json');
        out = [];
        
    };

    // document.getElementById("a").innerHTML = jsonObj;

    
}




