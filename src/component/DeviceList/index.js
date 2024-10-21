import { Container, Table } from "react-bootstrap";
import Header from "../Header";
import { DevicesListMaster } from "../../common/AppConstant";

const DeviceList = () => {
    const deviceList = DevicesListMaster;
    return (
        <>
            <Header />
            <Container className="mt-4">
                <Table className="table" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Sr no</th>
                            <th>Device Name</th>
                            <th>MAC AAddress</th>
                            <th>IP AAddress</th>
                            <th>PUBLIC IP ADDRESS</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deviceList.map((device, i) => (
                            <tr>
                                <td>{i + 1}</td>
                                <td>{device["DEVICE NAME"]}</td>
                                <td>{device["MAC ADDRESS"]}</td>
                                <td>{device["IP ADDRESS"]}</td>
                                <td>{device["PUBLIC IP ADDRESS"]}</td>
                                <td>{device["STATUS"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default DeviceList;