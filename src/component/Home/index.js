import { Button, Col, Container, Form, Modal, Toast, ToastContainer } from 'react-bootstrap';
import mapImage from '../../assets/images/map.jpg';
import { useMutation } from '@tanstack/react-query';
import { GetDeviceApi, SaveCoordinates } from '../../api/deviceApi';
import { useEffect, useState, useRef } from 'react';
import { selectSessionId, selectToken, selectUserData } from '../../utils/redux/authSlice';
import store from '../../utils/redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faTimesCircle, faMobile, faTowerBroadcast, faTowerObservation, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

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
    const userData = selectUserData(store.getState());
    const [deviceList, setDeviceList] = useState([]);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const token = selectToken(store.getState());
    const sessionId = selectSessionId(store.getState());
    const imageRef = useRef(null);
    const [filteredDeviceList, setFilteredDeviceList] = useState([]);
    const [type, setType] = useState("all");
    const [deviceType, setDeviceType] = useState("all");
    const [connectedCount, setConnectedCount] = useState(0);
    const [apiCalled, setApiCalled] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false); // Popup visibility
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [selectedDeviceId, setSelectedDeviceId] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [bgColor, setBgColor] = useState('primary');
    const [searchTerm, setSearchTerm] = useState(""); // Search term for dropdown
    const [selectedDevice, setSelectedDevice] = useState(null); // Selected device
    const [inputActive, setInputActive] = useState(false);

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
        },
        options: {
            staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
        }
    });

    const postMutation = useMutation({
        mutationFn: () => SaveCoordinates(selectedDeviceId, popupPosition.x, popupPosition.y),
        onSuccess: (data) => {
            setSnackbarVisible(true);
            setSearchTerm("");
            setSnackbarMessage('Coordinates saved successfully!');
            setBgColor('success');
            setPopupVisible(false);
            setSelectedDeviceId(null);
            getMutation.mutate();
        },
        onError: (error) => {
            setSnackbarMessage('Failed to save the Coordinates!');
            setSnackbarVisible(true);
            setSearchTerm("");
            setBgColor('danger');
            setPopupVisible(false);
            setSelectedDeviceId(null);
            console.error("Api failed:", error.response?.data || error.message);
        }
    });

    const applyFilters = (devices) => {
        let filteredList = devices.filter(d =>
            (type === "all" || d.status === Number(type)) &&
            (deviceType === "all" || d.type === deviceType)
        );
        setFilteredDeviceList(filteredList);
    };

    useEffect(() => {
        applyFilters(deviceList);
    }, [type, deviceType]);

    useEffect(() => {
        if (!apiCalled) {  // Check if the API has been called
            getMutation.mutate();
            setApiCalled(true); // Set the flag to true after calling the API
        }
    }, [apiCalled]);

    useEffect(() => {
        const imageElement = imageRef.current;

        if (imageElement) {
            setImageDimensions({
                width: imageElement.clientWidth,
                height: imageElement.clientHeight,
            });
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

    const handleDoubleClick = (event) => {
        if (userData.user_type === 'admin') {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            setPopupPosition({ x, y });
            setPopupVisible(true);
        }
    };

    const handleClosePopup = () => {
        setPopupVisible(false);
    };

    const handleSaveCoordinates = () => {
        postMutation.mutate();
    }
    const filteredOptions = filteredDeviceList.filter(device =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <Container style={{ marginTop: '100px' }}>
            <ToastContainer position="top-end" className="p-3 toaster" style={{ zIndex: 1000 }}>
                <Toast onClose={() => setSnackbarVisible(false)} show={snackbarVisible} delay={3000} autohide bg={bgColor}>
                    <Toast.Body className="text-white">{snackbarMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ color: 'white' }}>Status : </label>
                <Form.Select className="custom-select" style={{ width: '170px !important' }} aria-label="Filter" value={type} onChange={e => setType(e.target.value)}>
                    <option value="all">All ({deviceList.length})</option>
                    <option value="1" style={{ color: 'green' }}>Connected ({connectedCount})</option>
                    <option value="0" style={{ color: 'red' }}>Disconnected ({deviceList.length - connectedCount})</option>
                </Form.Select>

                <label style={{ color: 'white' }}>Device Type : </label>
                <Form.Select style={{ width: '170px' }} aria-label="Filter" value={deviceType} onChange={e => setDeviceType(e.target.value)}>
                    <option value="all">All ({deviceList.length})</option>
                    <option value="ap">AP ({deviceList.filter(d => d.type === 'ap')?.length || 0})</option>
                    <option value="switch">Switch ({deviceList.filter(d => d.type === 'switch')?.length || 0})</option>
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
                    onDoubleClick={handleDoubleClick}
                />

                {userData?.user_type === 'admin' && popupVisible && (
                    <Modal show={popupVisible} onHide={handleClosePopup} top>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Co-ordinates</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className='title-bold'>Selected Coordinates:</p>
                            <p className='title-bold'>X: {popupPosition.x}px, Y: {popupPosition.y}px</p>
                            <Form>
                                <label>Select Device: </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search device by name"
                                        className='full-width'
                                        style={{ padding: '8px', width: '100%', marginBottom: '5px' }}
                                        onFocus={() => setInputActive(true)}
                                        onBlur={() => setTimeout(() => setInputActive(false), 200)} // Delay to allow click on option
                                    />
                                    {inputActive && filteredOptions.length > 0 && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                zIndex: 1000,
                                                width: '100%',
                                                maxHeight: '300px',
                                                overflowY: 'auto',
                                                backgroundColor: 'white',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            {filteredOptions.map((device) => (
                                                <div
                                                    key={device.id}
                                                    onClick={() => {
                                                        setSelectedDevice(device);
                                                        setSearchTerm(device.name);
                                                    }}
                                                    style={{
                                                        padding: '8px',
                                                        cursor: 'pointer',
                                                        backgroundColor: selectedDevice?.id === device.id ? '#f0f0f0' : 'white'
                                                    }}
                                                >
                                                    {device.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* <Form.Select aria-label="deviceId" className='full-width'
                                    value={selectedDeviceId} onChange={(e) => setSelectedDeviceId(e.target.value)}>
                                    <option>Select device</option>
                                    <input type='text' />
                                    {filteredDeviceList && filteredDeviceList.map((device, index) => (
                                        <option value={device.id}>{device.name}</option>
                                    ))}
                                </Form.Select> */}
                                <div className='action-container'>
                                    <Button style={{ marginTop: '20px' }} color="primary" onClick={handleSaveCoordinates}> Save</Button>
                                </div>
                            </Form>

                        </Modal.Body>
                    </Modal>
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
