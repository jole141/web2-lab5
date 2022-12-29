import React, {LegacyRef, useEffect, useRef} from "react";

const WIDTH = 800;
const HEIGHT = 600;

export default function Home() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const photoRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const downloadRef = useRef<HTMLAnchorElement>(null);

    const initCamera = () => {
        navigator.mediaDevices.getUserMedia({video: {width: WIDTH, height: HEIGHT}}).then(
            stream => {
                let video = videoRef.current;
                if (video) {
                    video.srcObject = stream;
                    video.play();
                }
            }).catch(
            error => {
                console.log(error);
            });
    }

    const captureImage = () => {
        if(videoRef.current && photoRef.current && canvasRef.current && downloadRef.current) {
            const context = canvasRef.current.getContext('2d');
            if(context) {
                context.drawImage(videoRef.current, 0, 0, WIDTH, HEIGHT);
                let data = canvasRef.current.toDataURL('image/png');
                photoRef.current.setAttribute('src', data);
                downloadRef.current.href = photoRef.current.src;
            }
        }
    }

    useEffect(() => {
        initCamera();
    }, [videoRef]);

  return (
    <>
      <div className="container">
          <h1>Camera PWA</h1>
          <video className="video-container" ref={videoRef} />
          <button className="capture-button" onClick={captureImage}>Capture</button>
          <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{display: "none"}} />
          <div className="download"> <
              img ref={photoRef} />
              <a ref={downloadRef} download="capture.png">Download</a>
          </div>
      </div>
    </>
  )
}
