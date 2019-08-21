import React, { Fragment } from 'react'
import TextareaAutosize from 'react-autosize-textarea/lib'
import DatePicker from 'react-date-picker'
import FileUploader from 'react-firebase-file-uploader'
import { storage } from 'firebase/app'
import 'firebase/storage'

import loadingCircle from '../../assets/svg/loading-circle.svg'

import { Title, InputGroup, InputColumn, Label, Input, Body, Button, Upload, Img, ImgContainer, ImageUploadWrapper, CircleLoading } from './styled'

export const AddNewSongModal = ({
    data: { date, songName, singer, rithm, tone, lyricText },
    moduleDateInputChangeHandler,
    inputController,
    pushHandler,
    onUploadStart,
    onUploadError,
    onUploadSuccess,
    onProgress,
    isUploading,
    imageUrl,
}) =>
    <Fragment>
        <Title>Adding new song</Title>

        <Body>
            <ImageUploadWrapper>
                <ImgContainer>
                    {imageUrl && <Img src={imageUrl} alt="" />}
                </ImgContainer>

                <Upload>
                    {isUploading && <CircleLoading src={loadingCircle} />}

                    <div className="text">Choose image to upload</div>

                    <FileUploader
                        hidden
                        accept="image/*"
                        name="avatar"
                        randomizeFilename
                        storageRef={storage().ref("posters")}
                        onUploadStart={onUploadStart}
                        onUploadError={onUploadError}
                        onUploadSuccess={onUploadSuccess}
                        onProgress={onProgress}
                    />
                </Upload>
            </ImageUploadWrapper>

            <InputGroup>
                <InputColumn>
                    <Input
                        id="song-name"
                        name="songName"
                        onChange={inputController}
                        value={songName}
                    />
                    <Label htmlFor="song-name">Song name</Label>
                </InputColumn>
            </InputGroup>
            
            <InputGroup>
                <InputColumn>
                    <Input
                        id="singer"
                        name="singer"
                        onChange={inputController}
                        value={singer}
                    />
                <Label htmlFor="singer">Singer with auto complate</Label>


                <br /> 
                <select name="singers"  >
                     <option value="singer.key">singers from firebase</option>
                    <option value="singer.key">singers from firebase</option>
                    <option value="singer.key">singers from firebase</option>
                    <option value="singer.key">singers from firebase</option>
                    <option value="singer.key">singers from firebase</option>
                </select>     
                <br />     
                <b>After chose singer should take the Singer name and image from <i>Singers</i> to <i>Lyrics</i> </b>
                </InputColumn>

             </InputGroup>

            <InputGroup>
                <InputColumn>
                    <Input
                        id="rithm"
                        name="rithm"
                        onChange={inputController}
                        value={rithm}
                    />
                    <Label htmlFor="rithm">Rithm</Label>
                </InputColumn>

                <InputColumn>
                    <Input
                        id="tone"
                        name="tone"
                        onChange={inputController}
                        value={tone}
                    />
                    <Label htmlFor="tone">Tone</Label>
                </InputColumn>
            </InputGroup>

            <InputGroup>
                <InputColumn>
                    <TextareaAutosize
                        id="lyric-text"
                        name="lyricText"
                        onChange={inputController}
                        value={lyricText}
                    />
                    <Label htmlFor="lyric-text">Lyric text</Label>
                </InputColumn>
            </InputGroup>

            <InputGroup>
                <InputColumn>
                    <DatePicker
                        onChange={moduleDateInputChangeHandler}
                        value={new Date(date)}
                    />
                </InputColumn>
            </InputGroup>

            <Button onClick={pushHandler}>Save</Button>
        </Body>
    </Fragment>