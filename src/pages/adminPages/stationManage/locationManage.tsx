import { useEffect, useState } from "react";
import { Tabs, Modal, Form, Input, Select } from "antd";
import {
  getAllProvinces,
  createProvince,
  deleteProvince,
  getAllLocations,
  createLocation,
  deleteLocation,
} from "../../../services/stationServices/locationServices.ts";
import "./locationManage.scss";

import BaseTable from "../../../components/ui/Table/Table";
import CreateButton from "../../../components/ui/Button/Create";
import DeleteButton from "../../../components/ui/Button/Delete";
import Pagination from "../../../components/ui/Pagination/Pagination";

export default function ProvinceLocationManager() {
  // ----------------- Province -----------------
  const [provinces, setProvinces] = useState<any[]>([]);
  const [openProvince, setOpenProvince] = useState(false);
  const [provinceForm] = Form.useForm();
  const [provincePage, setProvincePage] = useState(1);
  const provincePageSize = 6;

  const loadProvinces = async () => {
    const res = await getAllProvinces();
    if (res.data && Array.isArray(res.data.data)) {
      const arr = res.data.data;
      const unique = Object.values(
        arr.reduce((acc: any, cur: any) => {
          if (!acc[cur.id]) {
            acc[cur.id] = {
              id: cur.id,
              nameProvince: cur.nameProvince,
              locations: [],
            };
          }
          if (cur.locations && cur.locations.id) {
            acc[cur.id].locations.push(cur.locations);
          }
          return acc;
        }, {})
      );

      setProvinces(unique);
    } else {
      setProvinces([]);
    }
  };

  const handleCreateProvince = async () => {
    const values = await provinceForm.validateFields();
    await createProvince(values);
    setOpenProvince(false);
    provinceForm.resetFields();
    loadProvinces();
  };

  const handleDeleteProvince = async (id: number) => {
    await deleteProvince(id);
    loadProvinces();
  };

  const paginatedProvinces = provinces.slice(
    (provincePage - 1) * provincePageSize,
    provincePage * provincePageSize
  );

  // ----------------- Location -----------------
  const [locations, setLocations] = useState<any[]>([]);
  const [openLocation, setOpenLocation] = useState(false);
  const [locationForm] = Form.useForm();
  const [locationPage, setLocationPage] = useState(1);
  const locationPageSize = 6;

  const loadLocations = async () => {
    const res = await getAllLocations();
    if (res.data && Array.isArray(res.data.data)) {
      setLocations(res.data.data);
    } else {
      setLocations([]);
    }
  };

  const handleCreateLocation = async () => {
    const values = await locationForm.validateFields();
    await createLocation(values);
    setOpenLocation(false);
    locationForm.resetFields();
    loadLocations();
  };

  const handleDeleteLocation = async (id: number) => {
    await deleteLocation(id);
    loadLocations();
  };

  const paginatedLocations = locations.slice(
    (locationPage - 1) * locationPageSize,
    locationPage * locationPageSize
  );

  // ----------------- Tabs -----------------
  const items = [
    {
      key: "1",
      label: "Tỉnh/Thành phố",
      children: (
        <div>
          <CreateButton onClick={() => setOpenProvince(true)}>
            + Thêm tỉnh
          </CreateButton>

          <BaseTable>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên tỉnh/thành phố</th>
                <th style={{ width: "150px" }}>Số điểm dừng</th>
                <th style={{ width: "150px" }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProvinces.map((p, index) => (
                <tr key={p.id}>
                  <td>{(provincePage - 1) * provincePageSize + index + 1}</td>
                  <td>{p.nameProvince}</td>
                  <td>{p.locations?.length || 0}</td>
                  <td>
                    <DeleteButton onClick={() => handleDeleteProvince(p.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </BaseTable>

          <Pagination
            totalItems={provinces.length}
            itemsPerPage={provincePageSize}
            currentPage={provincePage}
            onPageChange={setProvincePage}
          />

          <Modal
            title="Thêm tỉnh"
            open={openProvince}
            onCancel={() => setOpenProvince(false)}
            onOk={handleCreateProvince}
          >
            <Form form={provinceForm} layout="vertical">
              <Form.Item
                name="nameProvince"
                label="Tên tỉnh"
                rules={[{ required: true, message: "Nhập tên tỉnh!" }]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      ),
    },
    {
      key: "2",
      label: "Điểm dừng",
      children: (
        <div>
          <CreateButton onClick={() => setOpenLocation(true)}>
            + Thêm điểm dừng
          </CreateButton>

          <BaseTable>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên điểm dừng</th>
                <th style={{ width: "250px" }}>Thuộc tỉnh</th>
                <th style={{ width: "200px" }}>Loại</th>
                <th style={{ width: "150px" }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLocations.map((l, index) => (
                <tr key={l.id}>
                  <td>{(locationPage - 1) * locationPageSize + index + 1}</td>
                  <td>{l.nameLocations}</td>
                  <td>{l.province?.nameProvince}</td>
                  <td>
                    {l.type === "station"
                      ? "Bến xe"
                      : l.type === "stopPoint"
                      ? "Điểm dừng"
                      : ""}
                  </td>
                  <td>
                    <DeleteButton onClick={() => handleDeleteLocation(l.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </BaseTable>

          <Pagination
            totalItems={locations.length}
            itemsPerPage={locationPageSize}
            currentPage={locationPage}
            onPageChange={setLocationPage}
          />

          <Modal
            title="Thêm điểm dừng"
            open={openLocation}
            onCancel={() => setOpenLocation(false)}
            onOk={handleCreateLocation}
          >
            <Form form={locationForm} layout="vertical">
              <Form.Item
                name="provinceId"
                label="Thuộc tỉnh"
                rules={[{ required: true, message: "Chọn tỉnh!" }]}
              >
                <Select
                  options={provinces.map((p) => ({
                    label: p.nameProvince,
                    value: p.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="nameLocations"
                label="Tên điểm dừng"
                rules={[{ required: true, message: "Nhập tên điểm dừng!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="type"
                label="Loại điểm"
                rules={[{ required: true, message: "Chọn loại!" }]}
              >
                <Select
                  options={[
                    { label: "Bến xe", value: "station" },
                    { label: "Điểm dừng", value: "stopPoint" },
                  ]}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      ),
    },
  ];

  useEffect(() => {
    loadProvinces();
    loadLocations();
  }, []);

  return (
    <div className="panel-location-admin">
      <Tabs defaultActiveKey="1" type="card" items={items} />
    </div>
  );
}
