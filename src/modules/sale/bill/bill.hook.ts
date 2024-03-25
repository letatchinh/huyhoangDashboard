import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "~/redux/store";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetch,
  useFetchByParam,
  useQueryParams,
  useResetState,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { billSliceAction } from "./redux/reducer";
const MODULE = "bill";
const MODULE_VI = "";
const getSelector = (key : string) => (state:any) => state[MODULE][key];

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

const getListDebtSelector = getSelector('debt');
const isGetDebtLoadingSelector = getSelector('isGetDebtLoading');
const getDebtFailedSelector = getSelector('getDebtFailed');

const updateBillItemFailedSelector = getSelector('updateBillItemFailed');
const updateBillItemSuccessSelector = getSelector('updateBillItemSuccess');
const getListProductSuggestSuccessSelector = getSelector('listProductSuggest');
const getListProductSuggestFailedSelector = getSelector('getProductSuggestFailed');
const listProductSuggestLoadingSelector = getSelector('isProductSuggestLoading');

const pagingProductSuggestSelector = getSelector('pagingProductSuggest');
export const useBillProductSuggestPaging = () => useSelector(pagingProductSuggestSelector);

export const useBillPaging = () => useSelector(pagingSelector);

export const useGetBills = (param: any) => {
  return useFetchByParam({
    action: billSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param,
  });
};
export const useGetBill = (id: any,reFetch?:boolean) => {
  return useFetchByParam({
    action: billSliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
    reFetch,
  });
};

export const useCreateBill = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    // callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: billSliceAction.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateBill = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: billSliceAction.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit : callback
  });
};

export const useDeleteBill = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: billSliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};


export const useUpdateBillItem = (callback?: any) => {
  useSuccess(
    updateBillItemSuccessSelector,
    `Cập nhật Đơn hàng thành công`,
    // callback
  );
  useFailed(updateBillItemFailedSelector);

  return useSubmit({
    action: billSliceAction.updateBillItemRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit : callback
  });
};

export const useBillQueryParams = (status? : string) => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const supplierIds = query.get("supplierIds");
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
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
  }, [page, limit, keyword, createSuccess, deleteSuccess,status,supplierIds]);
};

export const useUpdateBillParams = (query: any, listOptionSearch?: any[]) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [keyword, setKeyword] = useState(get(query, "keyword"));
  useEffect(() => {
    console.log(query,'query');
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

export const useGetDebtRule = () => {
  return useFetch({
    action: billSliceAction.getDebtRequest,
    loadingSelector: isGetDebtLoadingSelector,
    dataSelector: getListDebtSelector,
    failedSelector: getDebtFailedSelector,
  });
};

export const useGetProductListSuggest = (param?: any) => {
  return useFetchByParam({
    action: billSliceAction.getListProductSuggestRequest,
    loadingSelector: listProductSuggestLoadingSelector,
    dataSelector: getListProductSuggestSuccessSelector,
    failedSelector: getListProductSuggestFailedSelector,
    param,
  });
};
export const useResetBillAction = () => {
  return useResetState(billSliceAction.resetAction);
};