// Please UnComment To use

import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetchByParam,
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { reportIndividualCollaboratorActions } from "./redux/reducer";
const MODULE = "reportIndividualCollaborator";
const MODULE_VI = "";

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

export const useReportIndividualCollaboratorPaging = () => useSelector(pagingSelector);

export const useGetReportIndividualCollaborators = (param:any) => {
  return useFetchByParam({
    action: reportIndividualCollaboratorActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetReportIndividualCollaborator = (id: any) => {
  return useFetchByParam({
    action: reportIndividualCollaboratorActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateReportIndividualCollaborator = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: reportIndividualCollaboratorActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateReportIndividualCollaborator = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: reportIndividualCollaboratorActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteReportIndividualCollaborator = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: reportIndividualCollaboratorActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useReportIndividualCollaboratorQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  // const keyword = query.get("keyword");
  const sellerId = query.get("sellerId");
  const rangerTime = query.get("rangerTime");
  const rangerType = query.get("rangerType");
  const productId = query.get("productId");
  const datatype = query.get("datatype");

  return useMemo(() => {
    const queryParams = {
      page:Number(page),
      limit:Number(limit),
      sellerId,
      rangerTime,
      rangerType,
      productId,
      datatype,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, sellerId, rangerTime, rangerType, productId, datatype]);
};

export const useUpdateReportIndividualCollaboratorParams = (
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