import { Container, Table } from "react-bootstrap";
import Header from "../Header";
import { DevicesListMaster } from "../../common/AppConstant";
import { selectSessionId, selectToken } from "../../utils/redux/authSlice";
import store from "../../utils/redux/store";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GetDeviceApi } from "../../api/deviceApi";

const DeviceList = () => {
    const [deviceList, setDeviceList] = useState([]);
    const token = selectToken(store.getState()); // Get accessToken from Redux
    const sessionId = selectSessionId(store.getState()); // Get accessToken from Redux

    const getMutation = useMutation({
        mutationFn: () => GetDeviceApi(token, sessionId, true),
        onSuccess: (data) => {
            setDeviceList(data.data);
            console.log(deviceList);
            console.log(data.data)
        },
        onError: (error) => {
            console.error("Api failed:", error.response?.data || error.message);
        }
    });

    useEffect(() => {
        getMutation.mutate();
    }, [])

    return (
        <>
            <Container className="mt-4">
                <Table className="table" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Sr no</th>
                            <th>Device Name</th>
                            <th>MAC AAddress</th>
                            <th>IP AAddress</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deviceList.map((device, i) => (
                            <tr>
                                <td style={{ color: (device["status"] === 1) ? 'green' : 'red' }}>{i + 1}</td>
                                <td style={{ color: (device["status"] === 1) ? 'green' : 'red' }}>{device["name"]}</td>
                                <td style={{ color: (device["status"] === 1) ? 'green' : 'red' }}>{device["mac"]}</td>
                                <td style={{ color: (device["status"] === 1) ? 'green' : 'red' }}>{device["ip"]}</td>
                                <td style={{ color: (device["status"] === 1) ? 'green' : 'red' }}>{device["status"] === 1 ? "Connected" : "Disconnected"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default DeviceList;