import { Container } from 'react-bootstrap';
import mapImage from '../../assets/images/map.jpg';
import { useMutation } from '@tanstack/react-query';
import { GetDeviceApi } from '../../api/deviceApi';
import { useEffect, useState, useRef } from 'react';
import { selectSessionId, selectToken } from '../../utils/redux/authSlice';
import store from '../../utils/redux/store';

const Blinker = ({ xPercentage, yPercentage }) => {
    const blinkerStyle = {
        position: 'absolute',
        top: `${yPercentage}%`,  // Use percentage for Y position
        left: `${xPercentage}%`, // Use percentage for X position
        width: '10px',
        height: '10px',
        backgroundColor: 'green',
        borderRadius: '50%',
        animation: 'blink 1s infinite',
    };

    return <div style={blinkerStyle}></div>;
};

const Home = () => {
    const [deviceList, setDeviceList] = useState([]);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const token = selectToken(store.getState());
    const sessionId = selectSessionId(store.getState());
    const imageRef = useRef(null);

    const getMutation = useMutation({
        mutationFn: () => GetDeviceApi(token, sessionId),
        onSuccess: (data) => {
            // Convert device coordinates to percentage based on image size
            const devicesWithPercentage = data.data.map(device => ({
                ...device,
                xAxis: (device.xAxis / imageDimensions.width) * 100,
                yAxis: (device.yAxis / imageDimensions.height) * 100
            }));
            setDeviceList(devicesWithPercentage);
        },
        onError: (error) => {
            console.error("Api failed:", error.response?.data || error.message);
        }
    });

    useEffect(() => {
        const imageElement = imageRef.current;

        // Set the image dimensions once the component mounts
        if (imageElement) {
            setImageDimensions({
                width: imageElement.clientWidth,
                height: imageElement.clientHeight,
            });
        }

        // Fetch the devices
        getMutation.mutate();

        // Add a resize event listener to update the dimensions on resize
        const handleResize = () => {
            if (imageElement) {
                setImageDimensions({
                    width: imageElement.clientWidth,
                    height: imageElement.clientHeight,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [imageRef]);

    // Function to handle mouse move event
    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100; // Calculate relative X as a percentage
        const y = ((event.clientY - rect.top) / rect.height) * 100; // Calculate relative Y as a percentage
        setCursorPos({ x, y });
    };

    // Function to handle click event on the map
    const handleClick = () => {
        // Store the selected coordinates when clicking on the map
        setSelectedCoordinates(cursorPos);
        console.log('Selected Coordinates:', cursorPos); // For debugging
    };

    return (
        <Container>
            <div className='mt-4' style={{ position: 'relative' }}>
                <img
                    ref={imageRef}
                    height={'80%'}
                    width={'100%'}
                    src={mapImage}
                    alt="Map"
                    onMouseMove={handleMouseMove} // Attach the mouse move handler
                    onClick={handleClick} // Attach the click handler to the image
                />

                {/* Display the coordinates of the cursor */}
                <div style={{ position: 'fixed', top: '10px', left: '10px', color: 'black', zIndex: 9999999 }}>
                    X: {cursorPos.x.toFixed(2)}%, Y: {cursorPos.y.toFixed(2)}%
                </div>

                {/* Display selected coordinates */}
                {selectedCoordinates && (
                    <div style={{ position: 'absolute', top: '30px', left: '10px', color: 'blue' }}>
                        Selected - X: {selectedCoordinates.x.toFixed(2)}%, Y: {selectedCoordinates.y.toFixed(2)}%
                    </div>
                )}

                {/* Render device blinkers based on device list */}
                {deviceList && deviceList.length > 0 && deviceList.map((device, index) => (
                    <Blinker
                        key={index}
                        xPercentage={device.xAxis} // Use percentage for X position
                        yPercentage={device.yAxis} // Use percentage for Y position
                    />
                ))}
            </div>
        </Container>
    );
}

export default Home;
