import { Container, Form } from 'react-bootstrap';
import mapImage from '../../assets/images/map.jpg';
import { useMutation } from '@tanstack/react-query';
import { GetDeviceApi } from '../../api/deviceApi';
import { useEffect, useState, useRef } from 'react';
import { selectSessionId, selectToken } from '../../utils/redux/authSlice';
import store from '../../utils/redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faTimesCircle, faMobile, faTowerBroadcast, faTowerObservation, faLocationPin } from '@fortawesome/free-solid-svg-icons';

// Blinker component with tooltip
const Blinker = ({ x, y, icon, color, device }) => {
    const [isHovered, setIsHovered] = useState(false);

    const blinkerStyle = {
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        animation: color === 'red' ? 'blink 1s infinite' : 'none', // Apply animation only for red icons
        cursor: 'pointer',
    };

    return (
        <>
            <FontAwesomeIcon
                icon={icon}
                color={color}
                style={blinkerStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
            {isHovered && (
                <div style={{
                    position: 'absolute',
                    top: `${y - 40}px`,  // Position tooltip above the icon
                    left: `${x + 15}px`,  // Position tooltip to the right of the icon
                    padding: '5px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    zIndex: 1000,
                    pointerEvents: 'none',
                }}>
                    {/* <div>Device ID: {device.id}</div> */}
                    <div>Device Name: {device.name}</div>
                    <div>Type: {device.type}</div>
                    <div>IP: {device.ip}</div>
                    <div>MAC: {device.mac}</div>
                    <div>Status: {device.status === 1 ? 'Connected' : 'Disconnected'}</div>
                </div>
            )}
        </>
    );
};

// Add CSS for the blink animation
const styles = `
@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}
`;
const BlinkAnimationStyles = () => <style>{styles}</style>;

const Home = () => {
    const [deviceList, setDeviceList] = useState([]);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const token = selectToken(store.getState());
    const sessionId = selectSessionId(store.getState());
    const imageRef = useRef(null);
    const [filteredDeviceList, setFilteredDeviceList] = useState([]);
    const [type, setType] = useState("0");
    const [connectedCount, setConnectedCount] = useState(0);
    const [apiCall, setApiCall] = useState(0);

    const getMutation = useMutation({
        mutationFn: () => GetDeviceApi(token, sessionId),
        onSuccess: (data) => {
            setDeviceList(data.data);
            let count = data.data.filter(d => d.status === 1);
            setConnectedCount(count.length);
            setFilteredDeviceList(data.data);
        },
        onError: (error) => {
            console.error("Api failed:", error.response?.data || error.message);
        }
    });

    const handleFilter = () => {
        if (type === -1) {
            setFilteredDeviceList(deviceList);
            return;
        }
        let filteredList = deviceList.filter(d => d?.status === type);
        setFilteredDeviceList(filteredList);
    }

    useEffect(() => {
        handleFilter();
    }, [type]);

    useEffect(() => {
        const imageElement = imageRef.current;

        if (imageElement) {
            setImageDimensions({
                width: imageElement.clientWidth,
                height: imageElement.clientHeight,
            });
        }

        if (apiCall === 0) {
            getMutation.mutate();
            setApiCall(1);
        }

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

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setCursorPos({ x, y });
    };

    const handleClick = () => {
        setSelectedCoordinates(cursorPos);
        console.log('Selected Coordinates:', cursorPos);
    };

    return (
        <Container style={{ marginTop: '100px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ color: 'white' }}>Filter : </label>
                <Form.Select style={{ width: '170px' }} aria-label="Filter" value={type} onChange={e => setType(e.target.value)}>
                    <option value="-1">All ({deviceList.length})</option>
                    <option value="1">Connected ({connectedCount})</option>
                    <option value="0">Disconnected ({deviceList.length - connectedCount})</option>
                </Form.Select>
            </div>
            <BlinkAnimationStyles />
            <div style={{ position: 'relative' }}>
                <img
                    ref={imageRef}
                    height={'80%'}
                    width={'100%'}
                    src={mapImage}
                    alt="Map"
                    onMouseMove={handleMouseMove}
                    onClick={handleClick}
                />

                <div style={{ position: 'fixed', top: '10px', left: '10px', color: 'black', zIndex: 9999999 }}>
                    X: {cursorPos.x.toFixed(2)}%, Y: {cursorPos.y.toFixed(2)}%
                </div>

                {selectedCoordinates && (
                    <div style={{ position: 'absolute', top: '30px', left: '10px', color: 'blue' }}>
                        Selected - X: {selectedCoordinates.x.toFixed(2)}%, Y: {selectedCoordinates.y.toFixed(2)}%
                    </div>
                )}

                {filteredDeviceList && filteredDeviceList.length > 0 && filteredDeviceList.map((device, index) => (
                    <Blinker
                        key={index}
                        x={device.xAxis}
                        y={device.yAxis}
                        icon={device.type === 'switch' ? faTowerBroadcast : faLocationPin}
                        color={device.status === 1 ? '#09ab09' : 'red'}
                        device={device} // Pass device data to the Blinker for the tooltip
                    />
                ))}
            </div>
        </Container>
    );
}

export default Home;
