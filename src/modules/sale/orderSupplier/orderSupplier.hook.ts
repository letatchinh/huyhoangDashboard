import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { get } from "lodash";
import { orderSupplierActions } from "./redux/reducer";
const MODULE = "orderSupplier";
const MODULE_VI = "đơn mua";
const getSelector = (key : string) => (state:any) => state[MODULE][key];

const {
  loadingSelector,
  listSelector,
  getListFailedSelector,
  getByIdLoadingSelector,
  getByIdSelector,
  getByIdFailedSelector,
//   deleteSuccessSelector,
//   deleteFailedSelector,
  isSubmitLoadingSelector,
  createSuccessSelector,
  createFailedSelector,
  updateSuccessSelector,
  updateFailedSelector,
  pagingSelector,
} = getSelectors(MODULE);

export const useOrderSupplierPaging = () => useSelector(pagingSelector);

const updateOrderItemFailedSelector = getSelector('updateOrderItemFailed');
const updateOrderItemSuccessSelector = getSelector('updateOrderItemSuccess');

export const useGetOrderSuppliers = (param:any) => {
  return useFetchByParam({
    action: orderSupplierActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetOrderSupplier = (id: any, reFetch?: boolean) => {
  return useFetchByParam({
    action: orderSupplierActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
    reFetch,
  });
};

export const useCreateOrderSupplier = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: orderSupplierActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit:callback
  });
};

export const useUpdateOrderSupplier = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: orderSupplierActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

// export const useDeleteOrderSupplier = (callback?: any) => {
//   useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
//   useFailed(deleteFailedSelector);

//   return useSubmit({
//     action: orderSupplierActions.deleteRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

export const useOrderSupplierQueryParams = (status? : string) => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const supplierIds = query.get("supplierIds");
  const createSuccess = useSelector(createSuccessSelector);
  const updateSuccess = useSelector(updateSuccessSelector);
//   const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      status,
      supplierIds,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, status, supplierIds, createSuccess, updateSuccess]);
};

export const useUpdateOrderItem = (callback?: any) => {
  useSuccess(
    updateOrderItemSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    // callback
  );
  useFailed(updateOrderItemFailedSelector);

  return useSubmit({
    action: orderSupplierActions.updateOrderItemRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit : callback
  });
};

export const useUpdateOrderSupplierParams = (
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
    };

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

export const useResetOrderSupplier = () => {
  return useResetState(orderSupplierActions.reset);
};