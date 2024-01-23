import { get, groupBy, last } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp, removeAccents } from "~/utils/helpers";
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
import { employeeSliceAction } from "./redux/reducer";
import { useDispatch } from "react-redux";
const MODULE  = "employee";
const MODULE_VI  = "Nhân viên";

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

export const useEmployeePaging = () => useSelector(pagingSelector);

export const useGetEmployeees = (payload: object) => {
  return useFetchByParam({
    action: employeeSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param: payload
  });
};
export const useGetEmployee = (id: any) => {
  return useFetchByParam({
    action: employeeSliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateEmployee = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: employeeSliceAction.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateEmployee = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: employeeSliceAction.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteEmployee = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: employeeSliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useEmployeeQueryParams = () => {
  const query = useQueryParams();
  const [page, setPage] = useState(query.get("page") || 1);
  const [limit, setLimit] = useState(query.get("limit") || 10);
  const keyword = query.get("keyword");

  const onTableChange: any = ({ current, pageSize }: any) => {
    setPage(current);
    setLimit(pageSize);
  };
  
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
    };
    return [queryParams, onTableChange];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess]);
};

export const useUpdateEmployeeParams = (
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

const adapterValidateUsername = async (username: any, callApi: any) => {
  const res = await callApi({ username: removeAccents(username?.toLowerCase()) }) // API Get username
  return get(res, 'username', '')
};
export const autoCreateUsername = async ({ fullName, callApi }: any) => {
  const splitFullName = fullName?.trim()?.split(' ')
  let username = last(splitFullName)
  for (let i = 0; i <= splitFullName?.length - 2; i++) {
    const value = get(splitFullName, `${i}.[0]`, '')
    username += value
  }
  const newUserName = await adapterValidateUsername(username, callApi)
  return newUserName
};

export const useResetStateEmployee = () => {
  return useResetState(employeeSliceAction.resetAction);
};