import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [videoFile, setVideoFile] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoMetadata, setVideoMetadata] = useState({});
    // eslint-disable-next-line
    const [waveSurfer, setWaveSurfer] = useState(null);
    const [hasAudio, setHasAudio] = useState(true);

    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const videoUrl = URL.createObjectURL(file);

            setVideoFile(videoUrl);

            // Initialize WaveSurfer
            const ws = WaveSurfer.create({
                container: '#waveform',
                waveColor: 'violet',
                progressColor: 'purple'
            });
            ws.load(videoUrl);
            setWaveSurfer(ws);
        }
    };

    const togglePlay = () => {
        if (isPlaying) {

            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const updateCanvas = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        if (!isPlaying) return;
        requestAnimationFrame(updateCanvas);
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        console.log('Video element set up', videoElement);
        const handleMetadata = (e) => {
            console.log('Metadata loaded', e);
            setVideoMetadata({
                duration: e.target.duration,
                videoWidth: e.target.videoWidth,
                videoHeight: e.target.videoHeight,
            });
            // Check if the video has audio tracks
            setHasAudio(e.target.mozHasAudio || Boolean(e.target.webkitAudioDecodedByteCount) || Boolean(e.target.audioTracks && e.target.audioTracks.length > 0));
        };

        if (videoFile) {
            videoElement.src = videoFile;
            videoElement.addEventListener('loadedmetadata', handleMetadata);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('loadedmetadata', handleMetadata);
            }
        };
    }, [videoFile]);

    return (
        <>
            <br />

            <div className='w-1/3 h-screen p-5 float-right text-left flex flex-col justify-center items-center'>
                <strong>Video Metadata:</strong>
                <ul>
                    <li>Duration: {videoMetadata.duration ? videoMetadata.duration.toFixed(2) : 'N/A'} seconds</li>
                    <li>Width: {videoMetadata.videoWidth || 'N/A'} pixels</li>
                    <li>Height: {videoMetadata.videoHeight || 'N/A'} pixels</li>
                </ul>
            </div>
            <div className='p-5 h-screen flex flex-col items-center justify-center w-2/3'>
                <div className="flex flex-row justify-center items-center w-2/3">

                    <div className=" flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                        <div className="text-center">
                            <div className=" flex text-sm leading-6 text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                    <span>Video Input</span>
                                    <input id="file-upload" name="file-upload" type="file" accept="video/*" onChange={handleFileChange} className="sr-only" />
                                </label>
                                
                            </div>
                        </div>
                    </div>
                </div>

                <canvas className='border-2 border-gray-400 w-2/3 m-5 rounded-sm' ref={canvasRef} width="640" height="360" onClick={togglePlay} />
                {videoFile && (
                    <video
                        ref={videoRef}
                        src={videoFile}
                        onPlay={updateCanvas}
                        style={{ display: 'none' }}
                    />
                )}
                <div className='border-2 border-gray-400 w-2/3 m-5 rounded-sm' id="waveform"></div>
                <button className='bg-blue-600 text-white px-4 rounded py-1' onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
                <br />
            </div>
        </>
    );
};

export default VideoPlayer;
