import {useEffect, useState} from 'react';
import './App.css';

function App() {
    const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
    const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);

    const [reload, setReload] = useState<boolean>(false);
    const [isRotating, setIsRotating] = useState(false);

    useEffect(() => {
        (async () => {
           await measureUploadSpeed();
           await measureDownloadSpeed();
           setTimeout(() => setIsRotating(false), 500)
        })()
    }, [reload])

    const measureDownloadSpeed = async () => {
        const startTime = Date.now();
        const response = await fetch('https://api.ifbx.ru/api/v1/check-speed-by-download');
        const data = await response.blob();
        const endTime = Date.now();

        const duration = (endTime - startTime) / 1000; // время в секундах
        const bitsLoaded = data.size * 8; // размер файла в битах
        const speedMbps = (bitsLoaded / duration) / (1024 * 1024); // скорость в Мбит/с
        setDownloadSpeed(speedMbps);
    };

    const measureUploadSpeed = async () => {
        const blob = new Blob(['a'.repeat(1000000)], {type: 'text/plain'}); // создаем тестовый файл размером 1MB
        const startTime = Date.now();
        await fetch('https://api.ifbx.ru/api/v1/check-speed-by-upload', {
            method: 'POST',
            body: blob,
        });
        const endTime = Date.now();

        const duration = (endTime - startTime) / 1000;
        const bitsUploaded = blob.size * 8;
        const speedMbps = (bitsUploaded / duration) / (1024 * 1024);
        setUploadSpeed(speedMbps);
    };


    return (
        <div className="wrapper">
            <div className="container">
                <h1>Проверить скорость интернета.</h1>
                <div className="result">
                    <div className="resultOutput">
                        <span className="resultOutputSubtext">Скорость входящих:</span>
                        <span className="resultOutputText">{downloadSpeed?.toFixed(2)} Mbps</span>
                    </div>
                    <div className="resultOutput">
                        <span className="resultOutputSubtext">Скорость исходящих:</span>
                        <span className="resultOutputText">{uploadSpeed?.toFixed(2)} Mbps</span>
                    </div>
                    <button className={`reload ${isRotating ? 'rotate' : ''}`} onClick={() => {
                        setReload(!reload)
                        setIsRotating(true);
                    }}>
                        <svg fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1"
                             viewBox="0 0 489.533 489.533" xmlSpace="preserve">
                                <g>
                                    <path d="M268.175,488.161c98.2-11,176.9-89.5,188.1-187.7c14.7-128.4-85.1-237.7-210.2-239.1v-57.6c0-3.2-4-4.9-6.7-2.9
                                        l-118.6,87.1c-2,1.5-2,4.4,0,5.9l118.6,87.1c2.7,2,6.7,0.2,6.7-2.9v-57.5c87.9,1.4,158.3,76.2,152.3,165.6
                                        c-5.1,76.9-67.8,139.3-144.7,144.2c-81.5,5.2-150.8-53-163.2-130c-2.3-14.3-14.8-24.7-29.2-24.7c-17.9,0-31.9,15.9-29.1,33.6
                                        C49.575,418.961,150.875,501.261,268.175,488.161z"/>
                                </g>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="bg"/>
        </div>
    );
}

export default App;
