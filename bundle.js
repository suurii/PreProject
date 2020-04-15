
function distance(A, B) {
    return sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2);
}

function average2point(A, B) {
    return {
        x: (A.x + B.x) / 2,
        y: (A.y + B.y) / 2
    };
}
function modelLoaded() {
    console.log('Model Loaded!');
}
// Listen to new 'pose' events
let loaded = false
let res = []
let out = []
let final = []
let size = {width : 801 , height : 801}
let videoName = ''
video = document.createElement('video')
document.body.appendChild(video)

let option ={
    architecture: 'MobileNetV1',
    imageScaleFactor: 0.3,
    outputStride: 16,
    flipHorizontal: false,
    minConfidence: 0.0,
    maxPoseDetections: 5,
    scoreThreshold: 0.0,
    nmsRadius: 20,
    detectionType: 'single',
    inputResolution: 801,
    multiplier: 1.0,
    quantBytes: 2,
  };

const poseNet = ml5.poseNet(video,option, modelLoaded);
poseNet.on('pose', (results) => {
    while(results.length > 0 && !video.ended){
        let r = results.shift()
        res.push(r)
        out.push(r)
    }
});


const input = document.querySelector('input[type="file"]')
input.addEventListener('change', function (e) {
    console.log(input.files)
    videoName = input.files[0].name
    const reader = new FileReader()
    reader.onload = function(){
        
        
        video.src = reader.result
        video.width = size.width
        video.height = size.height
        video.defaultPlaybackRate = 2
        video.muted = true
        video.play()
    
        
    }
  


    // poseNet.video = input.files[0]
    reader.readAsDataURL(input.files[0])
}, false)


function setup(){
    createCanvas(size.width,size.height);
}
let waitTime = 50000 //ms
function draw(){
    
    if(res.length>0){
        background(20, 20, 20);
        let pose = res.shift()
        pose = pose.pose
        fill(255, 0, 0);
        for (let i = 0; i < pose.keypoints.length; i++) {
            if (pose.keypoints[i].score >= .1) {
                ellipse(pose.keypoints[i].position.x, pose.keypoints[i].position.y, 10);
            }
        }

        let midpose = average2point(pose.leftShoulder, pose.rightShoulder);
        fill(0, 0, 255);
        ellipse(midpose.x, midpose.y, 10);
    }
    if(video.ended && !loaded && res.length <= 0){
        
        for(let i = 0 ; i < out.length ; i++){
            let tmp = out[i].pose
            //mid point
            let midpose = average2point(tmp.leftShoulder, tmp.rightShoulder);

            // shoulder lenght
            let shoulderLenght = distance(tmp.leftShoulder, tmp.rightShoulder);

            let list = {}

            for(let j = 0 ; j < tmp.keypoints.length ;j++){
                let dist = distance(tmp.keypoints[j].position, midpose);

                list[tmp.keypoints[j].part] =  dist / shoulderLenght;
                list[tmp.keypoints[j].part + '_score'] = tmp.keypoints[j].score;
            }
            final.push(list)
        }

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
        loaded = true
        videoName = videoName.replace('.mp4','.json')
        console.log('size = '+ final.length )
        // saveData(final,videoName);
    }
}
