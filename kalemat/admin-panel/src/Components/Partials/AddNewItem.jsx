import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const AddNewItem = ({ clickHandler }) =>
    <AddItemButton onClick={clickHandler}>
        <FontAwesomeIcon
            icon="plus"
            fixedWidth
            className="icon"
            size="lg"
        />
    </AddItemButton>

const

    AddItemButton = styled.button`
        position: fixed;

        bottom: 40px;
        right: 40px;

        width: 70px;
        height: 70px;

        border-radius: 40px;
        border: none;

        color: #fff;
        background: #3D5AFE;
        box-shadow: 3px 5px 17px rgba(0,0,0,.3);
        outline: none;
        cursor: pointer;
    `