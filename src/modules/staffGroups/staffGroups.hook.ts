
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetch, useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { staffGroupsActions } from "./redux/reducer";
const MODULE = "staffGroups";
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

export const useStaffGroupsPaging = () => useSelector(pagingSelector);
const getSelectorPolicy = (key : string) => (state:any) => state.policy[key];
const actionsSelector = getSelectorPolicy('actions');

export const useGetStaffGroups = (param?:any) => {
  return useFetch({
    action: staffGroupsActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
  });
};
export const useGetStaffGroup = (id: any) => {
  return useFetchByParam({
    action: staffGroupsActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateStaffGroup = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: staffGroupsActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateStaffGroup = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: staffGroupsActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteStaffGroup = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: staffGroupsActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useStaffGroupsQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const groupId = query.get("groupId");
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      groupId
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess, groupId]);
};

export const useUpdateStaffGroupsParams = (
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
console.log(searchString,'searchString')
    // Navigate
    navigate(`${pathname}?${searchString}`);
  };

  return [keyword, { setKeyword, onParamChange }];
};

export const useResetStaffGroupsAction = () => {
  return useResetState(staffGroupsActions.resetAction);
};

export const useResourceColumns = (renderPermission: any) => {
  const actions = useSelector(actionsSelector);
  const actionColumns = (actions || [])?.map(({ name, key }: any, index: number) => ({
    title: name,
    dataIndex: 'key',
    key: key,
    width : '10%',
    align: 'center',
    render: renderPermission(key)
  }));
  return [
    {
      title: 'Chức năng',
      dataIndex: 'name',
      key: 'resource',
      width : 'auto',
    },
    ...actionColumns
  ];
};