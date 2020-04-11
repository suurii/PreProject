
function modelLoaded() {
    console.log('Model Loaded!');
}

function gotPose(poses) {
    console.log(poses);
}
let capture;
let tmp;

function setup() {
    createCanvas(480, 480);
    capture = createCapture(VIDEO);
    capture.hide();
    poseNet = ml5.poseNet(capture, modelLoaded);
    poseNet.on('pose', (poses) => {
        tmp = poses[0].pose.keypoints;        
        // console.log(tmp);
    });

}

function draw() {
    image(capture, 0, 0);
    fill(255, 0, 0);

    if (tmp) {
        console.log(tmp);
        for (let i = 0; i < 17; i++) {
            ellipse(tmp[i].position.x, tmp[i].position.y, 10);
        }
    }

}