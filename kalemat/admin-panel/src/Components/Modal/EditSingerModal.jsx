import React, { Fragment } from 'react'

import {Title, InputGroup, InputColumn, Label, Input, Body, Button} from './styled'

export const EditSingerModal = ({
    data: { name, imageUrl },
    inputController,
    updateHandler
}) =>
    <Fragment>
        <Title>Editing <b>{name}</b></Title>

        <Body>
            <InputGroup>
                <InputColumn>
                    <Input id="name" name="name" value={name} onChange={inputController} />
                    <Label htmlFor="name">Singer:</Label>
                </InputColumn>
            </InputGroup>
            <InputGroup>
            <img src={imageUrl}  />
            </InputGroup>
             

            <Button onClick={updateHandler}>
                Update
            </Button>
        </Body>
    </Fragment>