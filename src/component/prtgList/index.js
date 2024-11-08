import { useMutation } from '@tanstack/react-query';
import { useEffect, useState, useRef } from 'react';
import { Container, Table } from 'react-bootstrap';
import { GetDeviceApi, GetPrtgList } from '../../api/deviceApi';

const PrtgList = () => {
    const [devices, setDevices] = useState([]);

    const getMutation = useMutation({
        mutationFn: () => GetPrtgList(),
        onSuccess: (data) => {
            console.log(data)
            setDevices(data.devices);
        },
        onError: (error) => {
            console.error("Api failed:", error.response?.data || error.message);
        },
        options: {
            staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
        }
    });


    useEffect(() => {
        getMutation.mutate();
    }, []);

    return (
        <Container style={{ marginTop: '100px' }}>
            <h2>PRTG Device List</h2>
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
                    {devices?.map((device, index) => (
                        <tr key={index}>
                            <td style={{color: device.status === 'Up' ? 'green' : 'red'}}>{device.objid}</td>
                            {/* <td style={{color: device.status === 'Up' ? 'green' : 'red'}}>{device.probe}</td> */}
                            <td style={{color: device.status === 'Up' ? 'green' : 'red'}}>{device.device}</td>
                            <td style={{color: device.status === 'Up' ? 'green' : 'red'}}>{device.group}</td>
                            <td style={{color: device.status === 'Up' ? 'green' : 'red'}}>{device.host}</td>
                            <td style={{color: device.status === 'Up' ? 'green' : 'red'}}>{device.status === 'Up' ? 'Connected' : 'Disconnected'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
};

export default PrtgList;