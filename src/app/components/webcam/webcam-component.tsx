'use client'

import { useRef, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'

export default function WebcamComponent(props: { maxFaces: number }) {

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [numFaces, setNumFaces] = useState<number>(0);
  
    useEffect(() => {
      const loadModels = async () => {
        // Load the face-api.js models
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      };
  
    const startWebcam = async () => {
      try {
        // First attempt: try to get the back camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: 'environment' } }, // Request the back camera
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'OverconstrainedError') {
          console.warn('Back camera not available. Falling back to front camera.');
          // Second attempt: fall back to any available camera
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true, // Fall back to any available camera
            });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (fallbackError) {
            console.error('Error accessing webcam after fallback: ', fallbackError);
          }
        } else {
          console.error('Error accessing webcam: ', err);
        }
      }
    };
  
      const detectFaces = async () => {
        if (videoRef.current) {
          const options = new faceapi.TinyFaceDetectorOptions();
          const detections = await faceapi.detectAllFaces(videoRef.current, options);
          setNumFaces(detections.length); // Update the number of faces detected
        }
      };
  
      const initialize = async () => {
        await loadModels();
        startWebcam();
  
        const interval = setInterval(() => {
          detectFaces(); 
        }, 250); // Adjust the interval as needed
  
        return () => clearInterval(interval);
      };
  
      initialize();
  
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
    }, []);
  
    return (
      <div>
        <div className="z-[9999] md:text-2xl font-bold absolute top-0 left-0 p-6 text-white w-full">
            <h1 className="md:text-4xl font-bold ">Innovation sociale P.O.C</h1>
            <h3 className="md:text-2xl font-bold   text-white">Nombre de visages détectés: {numFaces}</h3>
            
        </div>
        <p className='absolute bottom-0 right-0 text-xs p-2'>Pour mon cher Olivier Ross</p>

        <div className={`text-4xl font-bold absolute h-full w-full z-[1000] flex justify-center items-center transition-all duration-200 bg-black ${numFaces >= props.maxFaces ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className={`${numFaces >= 1 ? 'text-opacity-100' : 'text-opacity-0'}`}>C'est le temps d'aller parler à quelqu'un</h1>
        </div>
        
        <video ref={videoRef} autoPlay playsInline className='object-cover'/>
      </div>
    );
}