import { useEffect, useState } from "react";
import { Form } from "antd";
import {
  getAllRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../services/stationServices/routesServices.ts";
import { getAllLocations } from "../services/stationServices/locationServices.ts";
import { toBase64 } from "../utils/base64";

interface Province {
  id: number;
  nameProvince: string;
}

interface Location {
  id: number;
  nameLocations: string;
  province?: Province;
}

interface Route {
  id: number;
  fromLocation: Location;
  toLocation: Location;
  imageRouteCoach?: string;
}

export function useRoute() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [fromProvinceId, setFromProvinceId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Routes hiển thị theo trang
  const paginatedRoutes = routes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Load routes
  const loadRoutes = async () => {
    try {
      const res = await getAllRoutes();
      if (res.data && Array.isArray(res.data.data)) {
        setRoutes(res.data.data);
      } else {
        setRoutes([]);
      }
    } catch {}
  };

  // Load locations
  const loadLocations = async () => {
    try {
      const res = await getAllLocations();
      if (res.data && Array.isArray(res.data.data)) {
        setLocations(res.data.data);
      } else {
        setLocations([]);
      }
    } catch {}
  };

  useEffect(() => {
    loadRoutes();
    loadLocations();
  }, []);

  // Xử lý ảnh (convert base64 hoặc giữ ảnh cũ)
  const processImage = async (values: any, oldImage?: string) => {
    if (values.image && values.image.length > 0) {
      const fileObj = values.image[0].originFileObj;
      if (fileObj) {
        const base64WithPrefix = await toBase64(fileObj as File);
        return base64WithPrefix.split(",")[1];
      } else {
        if (!oldImage) return undefined;
        return oldImage.startsWith("data:image")
          ? oldImage.split(",")[1]
          : oldImage;
      }
    }
    return undefined;
  };

  // Create
  const handleCreate = async (values: any) => {
    try {
      const imageBase64 = await processImage(values);
      const payload = {
        fromLocationId: Number(values.fromLocationId),
        toLocationId: Number(values.toLocationId),
        imageRouteCoach: imageBase64,
      };
      await createRoute(payload);
      form.resetFields();
      setOpen(false);
      setFromProvinceId(null);
      loadRoutes();
    } catch {}
  };

  // Update
  const handleUpdate = async (values: any) => {
    try {
      const imageBase64 = await processImage(
        values,
        editingRoute?.imageRouteCoach
      );
      const payload = {
        fromLocationId: Number(values.fromLocationId),
        toLocationId: Number(values.toLocationId),
        imageRouteCoach: imageBase64,
      };
      await updateRoute(editingRoute?.id!, payload);
      form.resetFields();
      setOpen(false);
      setEditingRoute(null);
      setFromProvinceId(null);
      loadRoutes();
    } catch {}
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await deleteRoute(id);
      loadRoutes();
    } catch {}
  };

  // Edit
  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setOpen(true);
    form.setFieldsValue({
      fromLocationId: String(route.fromLocation.id),
      toLocationId: String(route.toLocation.id),
    });
    setFromProvinceId(route.fromLocation?.province?.id ?? null);
  };

  // Build options
  const locationOptions = locations.map((loc) => ({
    label: `${loc.nameLocations} (${loc.province?.nameProvince})`,
    value: String(loc.id),
    provinceId: loc.province?.id,
  }));

  const fromOptions = locationOptions;

  const toOptions =
    fromProvinceId !== null
      ? locationOptions.filter((opt) => opt.provinceId !== fromProvinceId)
      : locationOptions;

  return {
    routes,
    paginatedRoutes,
    locations,
    open,
    setOpen,
    editingRoute,
    setEditingRoute,
    fromProvinceId,
    setFromProvinceId,
    form,
    currentPage,
    setCurrentPage,
    pageSize,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    fromOptions,
    toOptions,
  };
}
