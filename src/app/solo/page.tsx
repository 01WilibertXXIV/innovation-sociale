import WebcamComponent from "../components/webcam/webcam-component";

export default function Solo() {
    return (
        <div>
            <WebcamComponent maxFaces={1} />
        </div>
    )
}