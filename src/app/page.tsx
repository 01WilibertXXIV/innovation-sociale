import WebcamComponent from "./components/webcam/webcam-component";

export default function Page() {
    return (
        <div>
            <WebcamComponent maxFaces={4} />
        </div>
    )
}