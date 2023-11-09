import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function WarningMessage({ message, onClose }) {
  return (
    <div className="fullscreen-warning">
      <p>{message}</p>
      <button className="btn btn-primary" onClick={onClose}>
        Ok
      </button>
    </div>
  );
}

function FaceDetection() {
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [noFaceDetected, setNoFaceDetected] = useState(false);
  const [multipleFacesDetected, setMultipleFacesDetected] = useState(false);

  const captureAndUploadImage = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      // Create a new FormData and append the captured image as a Blob
      const formData = new FormData();
      formData.append("file", dataURLtoBlob(imageSrc), "screenshot.png");

      setImageSrc(imageSrc); // Display the captured image in your component
      uploadImage(formData); // Upload the captured image as a PNG Blob
    }
  };

  const uploadImage = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/upload",
        formData
      );

      console.log("Image upload response:", response);

      if (response.status === 200) {
        console.log("Image uploaded successfully");

        if (response.data && response.data.imageUrl) {
          callFaceDetectionAPI(response.data.imageUrl);
        } else {
          console.error("Image upload response does not contain imageUrl");
        }
      }
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  const callFaceDetectionAPI = async (imageUrl) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/face-detection",
        { imageUrl }
      );

      console.log("Face detection response:", response);

      if (response.data && response.data.faces) {
        const detectedFaces = response.data.faces;

        if (detectedFaces.length > 1) {
          setMultipleFacesDetected(true);
        }else {
          setMultipleFacesDetected(false);
        }

        if (detectedFaces.length === 0) {
          setNoFaceDetected(true);
        } else {
          setNoFaceDetected(false);
        }
      } else {
        console.error("No face data found in the response.");
      }
    } catch (error) {
      console.error("Face detection error:", error);
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const BASE64_MARKER = ";base64,";
    const parts = dataURL.split(BASE64_MARKER);

    if (parts.length !== 2) {
      throw new Error("Invalid data URL format");
    }

    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; i++) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  const handleOkClick = () => {
    setNoFaceDetected(false);
  };

  useEffect(() => {
    const interval = setInterval(captureAndUploadImage, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
     <div>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/png" />
      {noFaceDetected && (
        <WarningMessage message="If Your Face is not detected more than 5 times, your exam will be submitted automatically" onClose={handleOkClick} />
      )}
      {multipleFacesDetected && (
        <WarningMessage message="Multiple persons detected" onClose={handleOkClick} />
      )}
    </div>
  );
}

export default FaceDetection;
