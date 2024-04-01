
import { get } from "lodash";
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
import { reportEmployeeActions } from "./redux/reducer";
const MODULE = "reportEmployee";
const MODULE_VI = "";

const getSelector = (key : any) => (state : any) => state[MODULE][key];
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
const updatePreviewSuccessSelector = getSelector('updatePreviewSuccess');
const updatePreviewFailedSelector = getSelector('updatePreviewFailed');

const updateStatusSuccessSelector = getSelector('updateStatusSuccess');
const updateStatusFailedSelector = getSelector('updateStatusFailed');

export const useReportEmployeePaging = () => useSelector(pagingSelector);

export const useGetReportEmployees = (param:any) => {
  return useFetchByParam({
    action: reportEmployeeActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetReportEmployee = (id: any) => {
  return useFetchByParam({
    action: reportEmployeeActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateReportEmployee = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: reportEmployeeActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateReportEmployee = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: reportEmployeeActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateStatusReportEmployee = (callback?: any) => {
  useSuccess(
    updateStatusSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateStatusFailedSelector);

  return useSubmit({
    action: reportEmployeeActions.updateStatusRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdatePreviewReportEmployee = (callback?: any) : any => {
  useSuccess(
    updatePreviewSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updatePreviewFailedSelector);

  return useSubmit({
    action: reportEmployeeActions.updatePreviewRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteReportEmployee = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: reportEmployeeActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useReportEmployeeQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword ]);
};

export const useUpdateReportEmployeeParams = (
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

export const useResetAction = () => {
    return useResetState(reportEmployeeActions.resetAction);

}