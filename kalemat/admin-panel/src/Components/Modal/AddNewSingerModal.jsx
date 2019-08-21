import React, { Fragment } from 'react'
import FileUploader from 'react-firebase-file-uploader'
import { storage } from 'firebase/app'
import 'firebase/storage'

import loadingCircle from '../../assets/svg/loading-circle.svg'

import { Title, InputGroup, InputColumn, Label, Input, Body, Button, Upload, Img, ImgContainer, ImageUploadWrapper, CircleLoading } from './styled'

export const AddNewSingerModal = ({
    data: { name },
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
        <Title>Adding new singer</Title>

        <Body>

            <InputGroup>
                <InputColumn>
                    <Input id="name" name="name" value={name} onChange={inputController} />
                    <Label htmlFor="name">Singer:</Label>
                </InputColumn>
            </InputGroup> 
            
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


 
 

            <Button onClick={pushHandler}>Save</Button>
        </Body>
    </Fragment>