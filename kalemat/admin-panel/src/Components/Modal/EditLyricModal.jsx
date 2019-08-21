import React, { Fragment } from 'react'
import TextareaAutosize from 'react-autosize-textarea'

import {Title, InputGroup, InputColumn, Label, Input, Body, Button} from './styled'

export const EditLyricModal = ({
    data: { songName, singer, viewCount, lyricText, lyricsMeta },
    inputController,
    metadataInputController,
    updateHandler
}) =>
    <Fragment>
        <Title>Editing song: {songName}</Title>

        <Body>
            <InputGroup>
                <InputColumn>
                    <Input id="song-name" name="songName" value={songName} onChange={inputController} />
                    <Label htmlFor="song-name">Song name:</Label>
                </InputColumn>

                <InputColumn>
                    <Input id="singer" name="singer" value={singer} onChange={inputController} />
                    <Label htmlFor="singer">Singer:</Label>
                </InputColumn>
            </InputGroup>

            <InputGroup>
                {lyricsMeta && lyricsMeta.map(({ metaKey, metaValue }, key) =>
                    <InputColumn key={key}>
                        <Input id={metaKey} name={metaKey} value={lyricsMeta[key].metaValue} onChange={metadataInputController} />
                        <Label htmlFor={metaKey}>{metaKey}:</Label>
                    </InputColumn>
                )}
            </InputGroup>

            <InputGroup>
                <InputColumn>
                    <Input id="views" name="viewCount" value={viewCount} onChange={inputController} />
                    <Label htmlFor="views">Views:</Label>
                </InputColumn>
            </InputGroup>

            <InputGroup>
                <InputColumn>
                    <TextareaAutosize id="lyric-text" name="lyricText" value={lyricText} onChange={inputController} />
                    <Label htmlFor="lyric-text">Lyric text:</Label>
                </InputColumn>
            </InputGroup>

            <Button onClick={updateHandler}>
                Update
            </Button>
        </Body>
    </Fragment>