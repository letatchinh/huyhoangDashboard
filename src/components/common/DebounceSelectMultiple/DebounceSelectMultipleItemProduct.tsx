import { Flex, Select, Spin } from 'antd';
import { SelectProps } from 'antd/lib/index';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import ProductModule from "~/modules/product";
import { DSM_getOptionsProduct } from './DebounceSelectMultiple.service';
import useDebounceSelectMultipleStore from './DebounceSelectMultipleProvider';

const refCollection = 'product';
export default function DebounceSelectMultipleItemProduct(props : SelectProps) : React.JSX.Element {
    const {DSM_setting} = useDebounceSelectMultipleStore();
    const [dataSource,setDataSource] = useState<any[]>([]);
    const [loading,setLoading] = useState(false);

    // Init Data Source From Store
    useEffect(() => {
        setDataSource(DSM_setting.dataSource[refCollection]);
    },[DSM_setting]);

    // Handle Fetch Search
    const fetcher = async (keyword : string = "") => {
        try {
            
            if(!keyword) { // Clear Will Return Data Source Root
                setDataSource(DSM_setting.dataSource[refCollection]);
                return;
            };
            setLoading(true);
            const dataFetcher = await ProductModule.api.getAll({
                keyword,
                limit: 20,
                isSupplierMaster: true,
            });
            const data = DSM_getOptionsProduct(dataFetcher);
            // Search Will Set DataSource Search
            setDataSource(data);
            setLoading(false);
            
        } catch (error) {
            console.log(error,'error');
            setLoading(false);
        }
    };
    const debounceFetcher = debounce(fetcher,500);
    
    return (
        <Select 
        options={dataSource}
        allowClear
        showSearch
        {...loading && {dropdownRender : () => <Flex justify={'center'} align="center" style={{width : '100%',height : 200}}>
            <Spin />
        </Flex>}}
        onSearch={debounceFetcher}
        filterOption={() => true}
        {...props}
        />
    )
}