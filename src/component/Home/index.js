import { Container } from 'react-bootstrap';
import mapImage from '../../assets/images/map.jpg';
import { useMutation } from '@tanstack/react-query';
import { GetDeviceApi } from '../../api/deviceApi';
import { useEffect, useState } from 'react';
import { selectSessionId, selectToken } from '../../utils/redux/authSlice';
import store from '../../utils/redux/store';

const Blinker = ({ x, y }) => {
    const blinkerStyle = {
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
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
    const [selectedCoordinates, setSelectedCoordinates] = useState(null); // State for storing selected coordinates
    const token = selectToken(store.getState());
    const sessionId = selectSessionId(store.getState());

    const getMutation = useMutation({
        mutationFn: () => GetDeviceApi(token, sessionId),
        onSuccess: (data) => {
            setDeviceList(data.data);
        },
        onError: (error) => {
            console.error("Api failed:", error.response?.data || error.message);
        }
    });

    useEffect(() => {
        getMutation.mutate();
    }, []);

    // Function to handle mouse move event
    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left; // Get x position relative to the image
        const y = event.clientY - rect.top; // Get y position relative to the image
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
                    height={'80%'}
                    width={'100%'}
                    src={mapImage}
                    alt="Map"
                    onMouseMove={handleMouseMove} // Attach the mouse move handler
                    onClick={handleClick} // Attach the click handler to the image
                />

                {/* Display the coordinates of the cursor */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'black' }}>
                    X: {cursorPos.x}, Y: {cursorPos.y}
                </div>

                {/* Display selected coordinates */}
                {selectedCoordinates && (
                    <div style={{ position: 'absolute', top: '30px', left: '10px', color: 'blue' }}>
                        Selected - X: {selectedCoordinates.x}, Y: {selectedCoordinates.y}
                    </div>
                )}

                {/* Render device blinkers based on device list */}
                {deviceList && deviceList.length > 0 && deviceList.map((device, index) => (
                    <Blinker key={index} x={device.xAxis} y={device.yAxis} />
                ))}
            </div>
        </Container>
    );
}

export default Home;
