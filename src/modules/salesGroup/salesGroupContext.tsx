import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { useDeleteSalesGroup, useUpdateSalesGroup } from "./salesGroup.hook";
import { useMatchPolicy } from "../policy/policy.hook";
import POLICIES from "../policy/policy.auth";
import { useDispatch } from "react-redux";
import { salesGroupActions } from "./redux/reducer";
export type GlobalSalesGroup = {
  isSubmitLoading: boolean;
  updateSalesGroup: (p: any) => void;
  deleteSalesGroup: (p: any) => void;
  onOpenFormCreateGroupFromExistGroup: (p: any) => void;
  onOpenForm: (p?: any) => void;
  onCloseForm: () => void;
  onOpenFormRelation: (p?: any) => void;
  onCloseFormRelation: () => void;
  id?: any;
  parentNear?: any;
  isOpenForm: boolean;
  isOpenFormRelation: boolean;
  isOpenTarget: boolean;
  onOpenFormTarget: (p?: any) => void;
  onCloseFormTarget: () => void;
  isOpenFormExchangeRate: boolean;
  onCloseFormExchangeRate: () => void;
  onOpenFormExchangeRate: (value?: any) => void;
  setParentNear: any;
  groupInfo: any,
  setGroupInfo: any,
  canWrite: boolean,
  canDelete: boolean,
  canUpdate: boolean,
  setId:(p?: any)=> void
};
const SalesGroup = createContext<GlobalSalesGroup>({
  isSubmitLoading: false,
  updateSalesGroup: () => {},
  deleteSalesGroup: () => {},
  onOpenFormCreateGroupFromExistGroup: () => {},
  onOpenForm: () => {},
  onCloseForm: () => {},
  onOpenFormRelation: () => {},
  onCloseFormRelation: () => {},
  id: null,
  parentNear: null,
  isOpenForm: false,
  isOpenFormRelation: false,
  isOpenTarget: false,
  onOpenFormTarget: () => {},
  onCloseFormTarget: () => {},
  isOpenFormExchangeRate: false,
  onCloseFormExchangeRate: () => { },
  onOpenFormExchangeRate: () => { },
  setParentNear: () => { },
  groupInfo: null,
  setGroupInfo: () => { },
  canWrite: false,
  canDelete: false,
  canUpdate: false,
  setId: () =>{},
});

type SalesGroupProviderProps = {
  children: ReactNode;
};

export function SalesGroupProvider({
  children,
}: SalesGroupProviderProps): JSX.Element {
  const [isOpenFormRelation, setIsOpenFormRelation]: any = useState(false);
  const [id, setId]: any = useState();
  const [parentNear, setParentNear]: any = useState();
  const [isOpenForm, setIsOpenForm]: any = useState(false);
  const [isOpenTarget, setIsOpenTarget]: any = useState(false);
  
  const [isOpenFormExchangeRate, setIsOpenFormExchangeRate]: any = useState(false);
  const [groupInfo, setGroupInfo]: any = useState();
  //Permission
  const canWrite = useMatchPolicy(POLICIES.WRITE_SALESGROUP);
  const canDelete = useMatchPolicy(POLICIES.DELETE_SALESGROUP);
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_SALESGROUP);

  const dispatch = useDispatch();
  const resetState = () => {
    return dispatch(salesGroupActions.resetAction());
  };
  // Control form
  const onOpenForm = useCallback((idSelect?: any) => {
    if (idSelect) {
      setId(idSelect);
    }
    setIsOpenForm(true);
  }, []);

  const onOpenFormCreateGroupFromExistGroup = useCallback((data?: any) => {
    setParentNear(data);
    setIsOpenForm(true);
  }, []);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
    setParentNear(null);
    setIsOpenTarget(false);
  }, []);

  const onOpenFormRelation = useCallback((idSelect?: any) => {
    if (idSelect) {
      setId(idSelect);
    }
    setIsOpenFormRelation(true);
  }, []);
  const onCloseFormRelation = useCallback(() => {
    setIsOpenFormRelation(false);
    setId(null);
  }, []);

  const onOpenFormTarget = useCallback((idSelect?: any) => {
    if (idSelect) {
      setId(idSelect);
    }
    setIsOpenTarget(true);
  }, []);
  const onCloseFormTarget = useCallback(() => {
    setIsOpenTarget(false);
    setId(null);
  }, []);
  const onOpenFormExchangeRate = useCallback((idSelect?: any) => {
    if (idSelect) {
      setId(idSelect);
    }
    setIsOpenFormExchangeRate(true);
  }, []);

  const onCloseFormExchangeRate = useCallback(() => {
    setIsOpenFormExchangeRate(false);
    setId(null);
    setParentNear(null);
  }, []);

  const [isSubmitLoading, updateSalesGroup] = useUpdateSalesGroup(() => {
    onCloseForm();
    resetState();
  });
  const [, deleteSalesGroup]: any = useDeleteSalesGroup();

  return (
    <SalesGroup.Provider
      value={{
        isSubmitLoading,
        updateSalesGroup,
        onOpenForm,
        onOpenFormCreateGroupFromExistGroup,
        onCloseForm,
        id,
        setId,
        parentNear,
        isOpenForm,
        isOpenFormRelation,
        onOpenFormRelation,
        onCloseFormRelation,
        deleteSalesGroup,
        isOpenTarget,
        onOpenFormTarget,
        onCloseFormTarget,
        isOpenFormExchangeRate,
        onOpenFormExchangeRate,
        onCloseFormExchangeRate,
        setParentNear,
        groupInfo,
        setGroupInfo,
        canWrite,
        canDelete,
        canUpdate,
      }}
    >
      {children}
    </SalesGroup.Provider>
  );
}

const useSalesGroupStore = (): GlobalSalesGroup => useContext(SalesGroup);

export default useSalesGroupStore;
