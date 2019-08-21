import React from 'react'
import styled from 'styled-components'

export const Error = ({ errorText }) =>
    <Container>
        <h1>{errorText}</h1>
    </Container>

const
    Container = styled.div`
        width: 100%;
        text-align: center;

        h1 {
            font-size: 64px;
            font-weight: 300;
        }
    `