import { useMutation } from '@tanstack/react-query';
import { useEffect, useState, useRef } from 'react';
import { Container, Form, Table } from 'react-bootstrap';
import { GetDeviceApi, GetPrtgList } from '../../api/deviceApi';

const PrtgList = () => {
    const [devices, setDevices] = useState([]);
    const [connectedCount, setConnectedCount] = useState(0);
    const [type, setType] = useState("all");
    const [filteredDeviceList, setFilteredDeviceList] = useState([]);

    const getMutation = useMutation({
        mutationFn: () => GetPrtgList(),
        onSuccess: (data) => {
            setDevices(data.devices);
            setFilteredDeviceList(data.devices);
            let count = data.devices.filter(d => d.status === 'Up');
            setConnectedCount(count.length);
        },
        onError: (error) => {
            console.error("Api failed:", error.response?.data || error.message);
        },
        options: {
            staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
        }
    });

    const applyFilters = (devices) => {
        let filteredList = devices.filter(d =>
            type === "all" || d.status === type
        );
        setFilteredDeviceList(filteredList);
    };

    useEffect(() => {
        applyFilters(devices);
    }, [type]);


    useEffect(() => {
        getMutation.mutate();
    }, []);

    return (
        <Container style={{ marginTop: '100px' }}>
            <h2>PRTG Device List</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ color: 'white' }}>Filter : </label>
                <Form.Select className="custom-select" style={{ width: '170px' }} aria-label="Filter" value={type} onChange={e => setType(e.target.value)}>
                    <option value="all">All ({devices.length})</option>
                    <option value="Up" style={{ color: 'green' }}>Connected ({connectedCount})</option>
                    <option value="Paused" style={{ color: 'red' }}>Disconnected ({devices.length - connectedCount})</option>
                </Form.Select>

                {/* <label style={{ color: 'white' }}>Device Type : </label> */}
                {/* <Form.Select style={{ width: '170px' }} aria-label="Filter" value={deviceType} onChange={e => setDeviceType(e.target.value)}>
                    <option value="all">All ({devices.length})</option>
                    <option value="ap">AP ({devices.filter(d => d.type === 'ap')?.length || 0})</option>
                    <option value="switch">Switch ({devices.filter(d => d.type === 'switch')?.length || 0})</option>
                </Form.Select> */}
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Object ID</th>
                        {/* <th>Probe</th> */}
                        <th>Device</th>
                        <th>Group</th>
                        <th>Host</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDeviceList?.map((device, index) => (
                        <tr key={index}>
                            <td style={{ color: device.status === 'Up' ? 'green' : 'red' }}>{device.objid}</td>
                            {/* <td style={{color: device.status === 'Up' ? 'green' : 'red'}}>{device.probe}</td> */}
                            <td style={{ color: device.status === 'Up' ? 'green' : 'red' }}>{device.device}</td>
                            <td style={{ color: device.status === 'Up' ? 'green' : 'red' }}>{device.group}</td>
                            <td style={{ color: device.status === 'Up' ? 'green' : 'red' }}>{device.host}</td>
                            <td style={{ color: device.status === 'Up' ? 'green' : 'red' }}>{device.status === 'Up' ? 'Connected' : 'Disconnected'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
};

export default PrtgList;