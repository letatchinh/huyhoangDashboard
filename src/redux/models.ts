export type initStateSlice<T=any> = {
    isLoading?: boolean;
    list?: T[];
    listSearch?: [];
    getListFailed?: any;

    paging?: {
      current: number,
      pageSize:number,
      total: number,
    }|null;

    createSuccess?: any;
    createFailed?: any;
  
    updateSuccess?: any;
    updateFailed?: any;
  
    deleteSuccess?: any;
    deleteFailed?: any;
  
    submitSuccess?: any;
    submitFailed?: any;
  
    isSubmitLoading?: boolean;
  
    byId?: any;
    isGetByIdLoading?: boolean;
    getByIdFailed?: any;
  };

  const moduleRedux ={
    auth:'auth',
    supplier:'supplier',
    branch:'branch',
    geo:'geo',
    employee:'employee',
    user: 'user',
    userGroup: 'userGroup',
    policy: 'policy',
    configDiscount: 'configDiscount',
    }as const
    
    
  export type ModuleRedux = keyof typeof moduleRedux;