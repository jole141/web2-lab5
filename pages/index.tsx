import React, {
  LegacyRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const WIDTH = 800;
const HEIGHT = 600;

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const [items, setItems] = useState(["jedan", "tri", "deset", "dvadeset"]);
  const [sorted, setSorted] = useState(false);

  const initCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: WIDTH, height: HEIGHT } })
      .then((stream) => {
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function sortItems() {
    const col = new Intl.Collator("hr");
    const sorted = items.sort(col.compare);
    console.log(sorted);
    setItems(sorted);
    setSorted(true);
  }

  const captureImage = () => {
    if (
      videoRef.current &&
      photoRef.current &&
      canvasRef.current &&
      downloadRef.current
    ) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, WIDTH, HEIGHT);
        let data = canvasRef.current.toDataURL("image/png");
        photoRef.current.setAttribute("src", data);
        downloadRef.current.href = photoRef.current.src;
      }
    }
  };

  const setupPushSubscription = useCallback(async (): Promise<void> => {
    try {
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (sub === null) {
        const publicKey =
          "BMLeXMRXNrG4ESa31NbsWrGaRznHYyND8vAgVr-XfdNixLHqA_CT_ozVF6WtuPcaYewDdDJcjPJpgIqXF29stIc";
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
        await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ sub }),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const pushPermission = useCallback(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      Notification.requestPermission(async function (res) {
        if (res === "granted") {
          await setupPushSubscription();
        } else {
          console.log("User denied push notifs:", res);
        }
      });
    }
  }, [setupPushSubscription]);

  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const pushNotification = async () => {
    await fetch("/api/push-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  };

  useEffect(() => {
    initCamera();
  }, [videoRef]);

  useEffect(() => {
    pushPermission();
  });

  return (
    <>
      <div className="container">
        <h1>Camera PWA</h1>
        <video className="video-container" ref={videoRef} />
        <button className="capture-button" onClick={captureImage}>
          Capture
        </button>
        <button className="capture-button" onClick={pushNotification}>
          Push Notification
        </button>
        <button className="capture-button" onClick={sortItems}>
          Test progressive enhancement
        </button>
        <div>
          <h1>Test progressive enhancement</h1>
          <p>Imamo listu [jedan, tri, deset, dvadeset] i sortiramo ju</p>
          {sorted && (
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          style={{ display: "none" }}
        />
        <div className="download">
          <img ref={photoRef} />
          <a ref={downloadRef} download="capture.png">
            Download
          </a>
        </div>
      </div>
    </>
  );
}
