import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetchByParam,
  useQueryParams,
  useResetState,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { warehouseActions } from "./redux/reducer";
const MODULE = "warehouse";
const MODULE_VI = "kho";

const {
  loadingSelector,
  listSelector,
  getListFailedSelector,
  getByIdLoadingSelector,
  getByIdSelector,
  getByIdFailedSelector,
  deleteSuccessSelector,
  deleteFailedSelector,
  isSubmitLoadingSelector,
  createSuccessSelector,
  createFailedSelector,
  updateSuccessSelector,
  updateFailedSelector,
  pagingSelector,
} = getSelectors(MODULE);

export const useWarehousePaging = () => useSelector(pagingSelector);
const getSelector = (key: any) => (state: any) => state.warehouse[key];
const updateManagementWarehouseSuccessSelector = getSelector('updateManagementWarehouseSuccess');
const updateManagementWarehouseFailedSelector = getSelector('updateManagementWarehouseFailed'); 

const checkWarehouseSuccessSelector = getSelector('checkWarehouseSuccess');
const checkWarehouseFailedSelector = getSelector('checkWarehouseFailed'); 

export const useGetWarehouses = (param: any) => {
  return useFetchByParam({
    action: warehouseActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param,
  });
};
export const useGetWarehouse = (id: any) => {
  return useFetchByParam({
    action: warehouseActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateWarehouse = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: warehouseActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useCheckWarehouse = (callback?: any) => {
  const mess = useSelector(checkWarehouseSuccessSelector);
  useSuccess(
    checkWarehouseSuccessSelector,
    useSelector(checkWarehouseSuccessSelector)?.message,
    callback
  );
  useFailed(checkWarehouseFailedSelector);
  return useSubmit({
    action: warehouseActions.checkWarehouseRequest,
    loadingSelector: loadingSelector,
  });
};

export const useUpdateWarehouse = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: warehouseActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateManagementWarehouse = (callback?: any) => {
  useSuccess(
    updateManagementWarehouseSuccessSelector,
    `Cập nhật ${MODULE_VI} mặc định thành công`,
    callback
  );
  useFailed(updateManagementWarehouseFailedSelector);

  return useSubmit({
    action: warehouseActions.updateManagementWarehouseRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteWarehouse = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: warehouseActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useWarehouseQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess]);
};

export const useUpdateWarehouseParams = (
  query: any,
  listOptionSearch?: any[]
) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [keyword, setKeyword] = useState(get(query, "keyword"));
  useEffect(() => {
    setKeyword(get(query, "keyword"));
  }, [query]);
  const onParamChange = (param: any) => {
    // Clear Search Query when change Params
    clearQuerySearch(listOptionSearch, query, param);

    if (!param.page) {
      query.page = 1;
    }

    // Convert Query and Params to Search Url Param
    const searchString = new URLSearchParams(
      getExistProp({
        ...query,
        ...param,
      })
    ).toString();

    // Navigate
    navigate(`${pathname}?${searchString}`);
  };

  return [keyword, { setKeyword, onParamChange }];
};

export const convertDataByManagementArea = (data: any) => {
  return data.warehouses?.map((item: any) => {
    return {
      ...item,
      managementArea: item.managementArea.map((area: any) => ({
        path: area.value,
        fullAddress: area.label,
      })),
    };
  });
};

export const useResetAction = () => {
  return useResetState(warehouseActions.resetAction);
};
 
export const useInitWarehouse = (values: any) => {
 return ({warehouses:values?.map((item: any) => ({
    ...item,
    managementArea: item.managementArea.map((area: any) => ({
      value: area.path,
      label: area.fullAddress,
    })),
  }))})
};
