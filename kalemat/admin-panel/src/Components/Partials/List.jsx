import React from 'react'
import styled from 'styled-components'
// FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const propExists = (propName) => propName !== undefined
export const List = ({
    data: {
        key,
        imageUrl,
        title,
        viewCount,
        upvote,
        downvote
    },
    deleteHandler,
    openEditModalHandler,
    approveHandler,
    inspectHandler,
    banHandler,
    unbanHandler,
    badHandler,
    unbadHandler,
    goodHandler,
}) =>
    <ListStyle>
        <ListItem key={key}>
            {imageUrl && <ImgWrapper>
                <Img src={imageUrl} />
            </ImgWrapper>}
            {title && <Title>
                <h5>{title}</h5>
            </Title>}
            {propExists(viewCount) && <ListItemRow>
                <div className="icon-wrapper">
                    <FontAwesomeIcon
                        icon="eye"
                        fixedWidth
                        className="icon"
                        size="sm"
                    />
                    {viewCount}
                </div>
            </ListItemRow>}
            {(propExists(upvote) || propExists(downvote)) && <ListItemRow>
                <Likes>
                    {propExists(upvote) && <div className="upvote icon-wrapper">
                        <FontAwesomeIcon
                            icon="thumbs-up"
                            fixedWidth
                            className="icon"
                            size="sm"
                        />
                        {upvote}
                    </div>}
                    {propExists(downvote) && <div className="icon-wrapper">
                        <FontAwesomeIcon
                            icon="thumbs-down"
                            fixedWidth
                            className="icon"
                            size="sm"
                        />
                        {downvote}
                    </div>}
                </Likes>
            </ListItemRow>}
            {(propExists(openEditModalHandler) || propExists(deleteHandler) || propExists(approveHandler) || propExists(inspectHandler) || propExists(banHandler) || propExists(unbanHandler)) && <Options>
                <FontAwesomeIcon
                    icon="ellipsis-v"
                    fixedWidth
                    className="icon"
                    size="sm"
                />
                <div className="dropdown">
                    {propExists(openEditModalHandler) && <h4 onClick={() => openEditModalHandler(key)} >Edit</h4>}
                    {propExists(deleteHandler) && <h4 onClick={() => deleteHandler(key)}>Delete</h4>}
                    {propExists(approveHandler) && <h4 onClick={() => approveHandler(key)}>Approve</h4>}
                    {propExists(inspectHandler) && <h4 onClick={() => inspectHandler(key)}>Inspect</h4>}
                    {propExists(banHandler) && <h4 onClick={() => banHandler(key)}>Ban</h4>}
                    {propExists(unbanHandler) && <h4 onClick={() => unbanHandler(key)}>Unban</h4>}
                    {propExists(badHandler) && <h4 onClick={() => badHandler(key)}>Bad</h4>}
                    {propExists(unbadHandler) && <h4 onClick={() => unbadHandler(key)}>Good</h4>}
                    {propExists(goodHandler) && <h4 onClick={() => goodHandler(key)}>Bad</h4>}
                </div>
            </Options>}
        </ListItem>
    </ListStyle>
const
    ListStyle = styled.div`
        width: 100%;
    `,
    ListItem = styled.div`
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 100px;
        padding: 20px;
        border-bottom: 1px solid #ECEFF1;
        background: #fff;
    `,
    ImgWrapper = styled.div`
        display: flex;
        width: 60px;
        margin-right: 20px;
        border-radius: 30px;
        background: #BDBDBD;
        overflow: hidden;
    `,
    Img = styled.img`
        height: 60px;
        min-width: 100%;
    `,
    Title = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        flex: 1;
        h4, h5 {
            color: #757575;
            font-weight: 400;
        }
    `,
    ListItemRow = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 400;
        padding: 0 30px;
        color: #9E9E9E;
        .icon {
            margin: 0 5px;
            color: #CFD8DC;
        }
    `,
    Likes = styled.div`
        display: flex;
        justify-content: space-between;
        .icon-wrapper, .upvote, .downvote {
            display: flex;
            align-items: center;
        }
        .upvote {
            margin-right: 24px;
        }
    `,
    Options = styled.div`
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #ECEFF1;
        .dropdown {
            position: absolute;
            z-index: 10;
            visibility: hidden;
            padding: 10px 0;
            top: 0;
            left: -100px;
            width: 100px;
            background: #fff;
            box-shadow: 0 1px 2px rgba(0,0,0,.1);
            h4 {
                padding: 10px 20px;
                font-weight: 400;
                color: #444;
                cursor: pointer;
                &:hover {
                    background: #efefef;
                }
            }
        }
        &:hover {
            .dropdown {
                visibility: visible;
            }
        }
    `