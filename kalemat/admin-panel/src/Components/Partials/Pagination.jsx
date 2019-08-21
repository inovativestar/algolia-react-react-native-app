import React from 'react'
import styled from 'styled-components'

export const Pagination = ({ dataFetcher, isNextPage, isDataLoading }) =>
    isNextPage && <PaginationWrapper>
        <Button onClick={dataFetcher} disabled={isDataLoading}>
            {isDataLoading ? 'Loading...' : 'Load more'}
        </Button>
    </PaginationWrapper>

const
    PaginationWrapper = styled.div`
        box-sizing: border-box;
        width: 100%;
        padding: 20px;
        background: #fff;
    `,

    Button = styled.button`
        padding: 15px 0;
        width: 100%;
        font-size: 14px;
        background: rgba(0,0,0,.05);
        border-radius: 3px;
        border: none;
        outline: none;
        cursor: pointer;
    `